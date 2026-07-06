import Title from "../Components/Title"
import CartTotal from "../Components/CartTotal"
import {useState ,useContext} from "react"
import { assets } from "../assets/frontend_assets/assets"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"


const PlaceOrders = () =>{
    const [method,setMethod] = useState('cod');
    const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData(data => ({...data, [name] : value}));
    }

    const initPay = (data) =>{
        const { order, key } = data;
        const options = {
            key,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response);
                try{
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {headers: {token}});
                }catch(error){
                    alert("Error verifying payment. Please try again.",error);
                    console.error("Error verifying payment:", error);
                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        let orderItems = []

        for(const items in cartItems){
            for(const item in cartItems[items]){
                if(cartItems[items][item] > 0){
                    const itemInfo = structuredClone(products.find(product => product._id === items));
                    if(itemInfo){
                        itemInfo.size = item;
                        itemInfo.quantity = cartItems[items][item];
                        orderItems.push(itemInfo);
                    }
                }
            }
        }

        let orderData = {
            address: formData,
            items: orderItems,
            amount: getCartAmount() + delivery_fee,
            // paymentMethod: method
        }
        try{

        switch (method){
            //API CALLS for COD
            case 'cod':
                const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}});
                if(response.data.success){
                    setCartItems({});
                    navigate('/orders');
                }else{
                    alert("Error placing order. Please try again.",response.data.error);
                    // console.error("Error placing order:", response.data.error);
                    // console.log("Response data:", response.data);
                }
                break;

            case 'stripe':
                const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}});
                if(responseStripe.data.success){
                    const {session_url} = responseStripe.data;
                    window.location.replace(session_url);
                }else{
                    alert("Error placing order. Please try again.",responseStripe.data.error);
                    console.error("Error placing order:", responseStripe.data.error);
                }

                break;

            case 'razorpay':
                const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}});
                if(responseRazorpay.data.success){
                    initPay(responseRazorpay.data);
                }


                break;
            default:
                break;
        }}catch(error){
            alert("Error placing order. Please try again.",error);
            console.error("Error placing order:", error);
        }
        // Handle form submission logic here
        // console.log(orderItems);
        // console.log(itemInfo);
    }
    return (
         <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* ----------Left Slide -------------- */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={'DELIVERY'} text2 = {'INFORMATION'} />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="First Name" />
                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Last Name" />
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Email address" />
                <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Street Name" />
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="City" />
                    <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="State" />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="zipCode" value={formData.zipCode} type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Zip Code" />
                    <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Country" />
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone Number" />
            </div>
            {/* ---------------Right Side ---------------*/}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* --------------------Payment Methods -------------------- */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <button
                            type="button"
                            onClick={()=>setMethod('stripe')}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition ${method === 'stripe' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.stripe_logo} alt="Stripe" className="h-5 mx-4" />
                        </button>

                        <button
                            type="button"
                            onClick={()=>setMethod('razorpay')}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition ${method === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.razorpay_logo} alt="Razorpay" className="h-5 mx-4" />
                        </button>

                        <button
                            type="button"
                            onClick={()=>setMethod('cod')}
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition ${method === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className="text-gray-500 text-sm font-medium">CASH ON DELIVERY</p>
                        </button>
                    </div>
                </div>
                <div className="w-full text-end mt-8">
                    <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
                </div>
            </div>
         </form>
    )
}


export default PlaceOrders