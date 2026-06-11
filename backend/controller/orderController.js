import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import razorpay from 'razorpay';
import crypto from 'crypto';

//global variables
const currency = 'usd';
const razorpayCurrency = 'INR';
const deliveryCharge = 10;

//gateway intialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
//Place order

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
}

//Place order with Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`, line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url })

        // res.status(201).json({success: true, message:"Order placed successfully", orderId:newOrder._id});
    } catch (error) {
        console.error("Error placing order with Stripe:", error);
        res.status(500).json({ message: "Error placing order with Stripe", error: error.message });
    }
}

//verify Stripe payment
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true, message: "Payment verified and order placed successfully" });
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Payment failed. Order cancelled." });
        }
    } catch (error) {
        console.error("Error verifying Stripe payment:", error);
        res.status(500).json({ message: "Error verifying Stripe payment", error: error.message });
    }
}

//Place order with Razorpay
const placeOrderRazorpay = async (req, res) => {
    try{
        const { userId, items, amount, address } = req.body;
        // const { origin } = req.headers;
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: razorpayCurrency,
            receipt: newOrder._id.toString(),
        }

        const order = await razorpayInstance.orders.create(options);
        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            orderId: newOrder._id,
        });
    }catch (error) {
        console.error("Error placing order with Razorpay:", error);
        res.status(500).json({ message: "Error placing order with Razorpay", error: error.message });
    }
}

const verifyRazorpay = async (req, res) => {
    try{
        const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing Razorpay payment fields" });
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ success: true, message: "Payment verified and order placed successfully" });
        }else{
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    }catch (error) {    
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ message: "Error verifying Razorpay payment", error: error.message });
    }
}

//Get all orders (admin)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
}

//Get user orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const orders = await orderModel.find({ userId })
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching user orders", error: error.message });
    }
}

//Update order status (admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and status are required" });
        }
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay };