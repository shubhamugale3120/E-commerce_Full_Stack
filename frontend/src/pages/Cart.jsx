import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import { assets } from "../assets/frontend_assets/assets"
import CartTotal from "../Components/CartTotal"

const Cart = () => {
    const { products, currency, cartItems ,updateQuantity,navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        if(products.length > 0){
        const tempData = [];
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItems[items][item]
                    });
                }
            }
        } 
        setCartData(tempData); 
        console.log(tempData);}
    }, [cartItems,products]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-medium text-gray-800 uppercase tracking-[0.18em]">
                    Your Cart
                </h2>
                <div className="mt-2 h-px w-20 bg-gray-800/80"></div>
            </div>

            {cartData.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 px-6 py-10 text-center text-gray-500 shadow-sm">
                    Your cart is empty
                </div>
            ) : (
                <>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="hidden md:grid md:grid-cols-[auto_1fr_140px_40px] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 border-b border-gray-200">
                            <span>Product</span>
                            <span>Details</span>
                            <span className="text-center">Quantity</span>
                            <span></span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartData.map((item) => {
                                const productData = products.find((product) => product._id === item._id);

                                if (!productData) return null;

                                return (
                                    <div key={`${productData._id}-${item.size}`} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_140px_40px] items-center gap-4 px-4 sm:px-5 py-4 sm:py-5 hover:bg-gray-50/70 transition-colors">
                                        <div className="w-18 sm:w-20 flex items-center justify-center">
                                            <div className="rounded-xl bg-white border border-gray-100 p-1 shadow-sm">
                                                <img src={productData.image?.[0]} alt={productData.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" />
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{productData.name}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                                <span className="font-medium text-gray-800">{currency}{productData.price}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>Size: {item.size}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>Subtotal: {currency}{productData.price * item.quantity}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <input
                                                type="number"
                                                min={1}
                                                defaultValue={item.quantity}
                                                onChange={(e) => updateQuantity(item._id, item.size, parseInt(e.target.value) || 1)}
                                                className="w-20 rounded-md border border-gray-200 bg-white px-3 py-2 text-center text-sm text-gray-700 shadow-sm outline-none transition focus:border-gray-400"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item._id, item.size, 0)}
                                            className="justify-self-end rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                            aria-label={`Remove ${productData.name}`}
                                        >
                                            <img src={assets.bin_icon} alt="" className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                            <CartTotal />
                            <div className="w-full text-end">
                                <button onClick={()=>navigate('/place-orders')} className="bg-black text-white text-sm my-8 px-8 py-3">Proceed to Checkout</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;