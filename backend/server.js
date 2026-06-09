import express from 'express';
import cors from 'cors';
import'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//App configuration
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());//To parse JSON bodies
app.use(cors()); //to acess frontend from backend and api requests from frontend to backend

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

//Routes
app.get('/', (req, res) => {
    res.send("API WORKING FINE");
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});