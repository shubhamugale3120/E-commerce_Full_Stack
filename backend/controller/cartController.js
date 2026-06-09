


import userModel from '../models/userModel.js';

//Add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        let cartData = userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData: cartData });
        res.status(200).json({ message: 'Item added to cart successfully', cartData: cartData });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
}

//Update cart
const updateCart = async (req, res) => {

    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        let cartData = userData.cartData;

        if (!cartData[itemId]) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData: cartData });
        res.status(200).json({ message: 'Cart updated successfully', cartData: cartData });

    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
}
//get cart items data
const getUserCart = async (req, res) => {
    const {userId} = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartData = userData.cartData;

    res.status(200).json({ success: true, cartData: cartData });
}

export { addToCart, updateCart, getUserCart };