import productModel from '../models/productModel.js';
import {v2 as cloudinary} from 'cloudinary';//cloudinary v2 is used for uploading images to cloudinary
import fs from 'fs';
import path from 'path';

const parseSizes = (sizesInput) => {
    if (Array.isArray(sizesInput)) {
        return sizesInput;
    }

    if (sizesInput === undefined || sizesInput === null) {
        return [];
    }

    if (typeof sizesInput !== 'string') {
        return [];
    }

    const raw = sizesInput.trim();
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        // Accept common non-JSON input like ['M','L'] from form-data tools.
        try {
            const normalized = raw.replace(/'/g, '"');
            const parsed = JSON.parse(normalized);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return raw
                .replace(/^\[/, '')
                .replace(/\]$/, '')
                .split(',')
                .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
                .filter(Boolean);
        }
    }
};

const uploadImageToCloudinary = async (image, label) => {
    try {
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        return result.secure_url;
    } catch (error) {
        console.error(`Cloudinary upload failed for ${label}`, {
            filePath: image?.path,
            message: error.message,
            http_code: error.http_code,
            name: error.name,
        });
        throw error;
    }
};


//function for add product, get all products, get single product, delete product, update product

const addProduct = async (req,res)=>{
    try {
        const {name, description, price, category, subCategory, sizes, bestSeller} = req.body;

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        // if (!image1 || !image2 || !image3 || !image4) {
        //     return res.json({ success: false, message: 'Please upload all four product images' });
        // }

        const images = [
            { image: image1, label: 'image1' },
            { image: image2, label: 'image2' },
            { image: image3, label: 'image3' },
            { image: image4, label: 'image4' },
        ].filter(({ image }) => image !== undefined);

        const imageUrls = await Promise.all(
            images.map(({ image, label }) => uploadImageToCloudinary(image, label))
        );

        const productData = {
            name,
            description,
            price: Number(price),
            image: imageUrls,
            category,
            subCategory,
            sizes: parseSizes(sizes),
            bestSeller: bestSeller === 'true',
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.log(error);
        res.status(error.http_code || 500).json({success: false, message:error.message, http_code: error.http_code || null})
    }
}



const listProduct = async (req,res)=>{
    try{
        const products = await productModel.find({});
        res.json({success: true, products})
    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message})
    }
}



const removeProduct = async (req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message:'Product removed successfully'})
    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message})
    }
}



const singleProduct = async (req,res)=>{
    try{
        const { productId } = req.body;
        const product = await productModel.findById(productId).lean();
        res.json({success: true, product})
    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message})
    }
}



// const addProduct = (req,res)=>{


export { addProduct, listProduct, removeProduct, singleProduct };
