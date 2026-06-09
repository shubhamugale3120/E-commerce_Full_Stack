import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../Components/Title'
import ProductItem from '../Components/ProductItem'
import { assets } from '../assets/frontend_assets/assets'

export default function RelatedProducts({category,subCategory}) {
  const {products, currency} = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        if(products.length > 0){
            let productCopy = products.slice();

            productCopy = productCopy.filter((item)=> category === item.category);
            productCopy = productCopy.filter((item)=> subCategory === item.subCategory);

            setRelated(productCopy.slice(0,5));
        }
    },[products]);
  return (
    <div className='border-t pt-14'>
       <div className="text-2xl mb-3">
        
       <Title text1={"YOUR"} text2={"CART"}/>
       </div>
       <div>
        {
          related.map((item,index)=>{
            const productData = products.find((product)=> product._id === item._id);

            if(!productData) return null;

            return (
              <div className="py-4 border-b text-gray-700 grid grid-cols-[auto_1fr_auto_auto] items-center gap-4" key={productData._id}>
                <div className="w-20 flex items-center justify-center">
                  <img src={productData.image?.[0]} alt={productData.name} className="w-16 h-16 object-cover" />
                </div>

                <div className="pl-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm sm:text-lg font-medium">{productData.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="text-sm">{currency}{productData.price}</p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <input type="number" min={1} defaultValue={1} className="border w-16 sm:w-20 px-2 py-1 text-sm text-center" />
                </div>

                <div className="flex items-center justify-end pr-2">
                  <img src={assets.bin_icon} alt="Remove" className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
                </div>
              </div>
            )
          })
        }
       </div>
    </div>
  )
}
