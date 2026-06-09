import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../Components/RelatedProducts";

const Products = () => {
    const { productId } = useParams();
    const { products ,currency,addToCart} = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size,setSize] = useState('');
    
    const fetchProductData = async () => {
        if (!products) return;
        const foundProduct = products.find((item) => item._id === productId);
        if (foundProduct) {
            setProductData(foundProduct);
            setImage(foundProduct.image[0]);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* Product Data Container */}
            <div className="flex gap-12 flex-col sm:flex-row">
                
                {/* Product Images Section */}
                {/* FIX: Added 'flex' and fixed typo to 'sm:flex-row' */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    
                    {/* Thumbnail List */}
                    {/* FIX: Adjusted width percentages and added scrollbar hiding if needed */}
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {
                            productData.image.map((item, index) => (
                                <img 
                                    src={item} 
                                    key={index} 
                                    alt={`Product thumb ${index}`} 
                                    /* FIX: Added onClick to make thumbnails interactive */
                                    onClick={() => setImage(item)} 
                                    className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-all ${image === item ? 'border border-orange-500' : ''}`} 
                                />
                            ))
                        }
                    </div>

                    {/* Main Active Image Display */}
                    {/* FIX: Ensured correct flex growth alongside layout */}
                    <div className="w-full sm:w-[80%]">
                        <img src={image} alt="Selected Product View" className="w-full h-auto object-cover" />
                    </div>

                </div>

                {/* Product Details Section (Right Side) */}
                <div className="flex-1">
                    {/* You can start putting your Title, Price, Description, Size-selector buttons here */}
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_icon} alt="" className="w-3 5" />
                        <img src={assets.star_dull_icon} alt="" className="w-3 5" />
                        <p className="pl-2">(122)</p>
                    </div>
                        <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
                        <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                        <div className="flex flex-col gap-4 my-8">
                            <p>Select Size</p>
                            <div className="flex gap-2">
                                {productData.sizes.map((item,index)=>(
                                    <button onClick={()=> setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} `} key={index}>{item}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={()=>addToCart(productData._id,size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">Add to Cart</button>
                        <hr className="mt-8 sm:w-4/5" />
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                </div>

            </div>
            {/* Description and Review Section */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Descripton</b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum laboriosam unde saepe, vel doloribus numquam eius dolor quod corrupti sequi impedit assumenda architecto autem velit, excepturi labore tenetur dignissimos et!</p>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi odit non fugit, quisquam officia illo qui hic. Inventore odio ea voluptatibus et quis ullam deleniti quam ex, iste distinctio amet!</p>
                </div>
            </div>

            {/* ------------Display related products  */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
        // Description and Review Section
    ) : <div className="opacity-0"></div>
}

export default Products;