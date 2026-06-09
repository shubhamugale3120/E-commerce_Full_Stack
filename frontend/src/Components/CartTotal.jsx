import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

export default function CartTotal() {

    const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);
  return (
    <div>
      <div className="text-xl sm:text-2xl">
        <Title text1={"CART"} text2={"TOTALS"}/>
      </div>
      <div className="mt-4 space-y-3 text-sm sm:text-base text-gray-600">
        <div className="flex items-center justify-between">
          <p>Subtotal</p>
          <p className="font-medium text-gray-800">{currency}{getCartAmount()}.00</p>
        </div>
        <div className="h-px bg-gray-100"></div>
        <div className="flex items-center justify-between">
          <p>Delivery Fee</p>
          <p className="font-medium text-gray-800">{currency}{delivery_fee}.00</p>
        </div>
        <div className="h-px bg-gray-100"></div>
        <div className="flex items-center justify-between pt-1 text-base sm:text-lg">
          <b className="text-gray-800">Total</b>
          <b className="text-gray-900">{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
        </div>
      </div>
    </div>
  )
}
