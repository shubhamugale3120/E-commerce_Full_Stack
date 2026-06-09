import express from 'express';
import {addToCart,updateCart,getUserCart} from '../controller/cartController.js';
import userAuth from '../middleware/auth.js';
// import userAuth from '../middleware/userAuth.js';
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus,verifyStripe,verifyRazorpay} from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import Razorpay from 'razorpay';

//admin features
const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

//payment 
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);

// and user features
orderRouter.post('/userorders', userAuth, userOrders);

//verify payment
orderRouter.post('/verifyStripe', userAuth, verifyStripe);
orderRouter.post('/verifyRazorpay', userAuth, verifyRazorpay);

export default orderRouter;