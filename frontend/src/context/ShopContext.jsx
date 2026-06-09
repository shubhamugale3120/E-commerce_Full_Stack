import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const getStoredCart = () => {
    try {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : {};
    } catch (error) {
        return {};
    }
};

const ShopContextProvider = (props) =>{
    const currency = '$'
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;    
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState(getStoredCart);
    const navigate = useNavigate();
    const [products,setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems || {}));
    }, [cartItems]);

    let addToCart = async (itemId,size)=>{

        if(!size){
            toast.error('select Product Size');
            return
        }
        const cartData = structuredClone(cartItems || {});

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));
        try{
            await axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}});
        }catch(error){
            console.log(error);
        }
    }

    const getCartCount = ()=>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalCount +=cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity)=>{
        const cartData = structuredClone(cartItems || {});

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;

        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));
        if(token){
        try{
            await axios.post(backendUrl + '/api/cart/update',{ itemId, size, quantity},{headers:{token}});
        }catch(error){
            console.log(error);
        }}
    }

    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);

            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += cartItems[items][item] * itemInfo.price;
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems]);

    const getProductsData = async () =>{
        try{
            const response = await axios.get(backendUrl + '/api/product/list',{}, { headers: { token } });
            // console.log(response.data);
            if(response.data.success){
                setProducts(response.data.products);
            }else{
                console.log(response.data.message);
            }
        }catch(error){
            console.log(error);
        }
    }

    const getUserCart = async (authToken) =>{
        try{
            const response = await axios.post(backendUrl + '/api/cart/get',{}, { headers: {authToken } });
            // const serverCart = response.data.cartData || {};
            if(response.data.success){
            setCartItems(serverCart);}
            // localStorage.setItem('cartItems', JSON.stringify(serverCart));
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(()=>{
    //     getProductsData();
    // },[]);

    // useEffect(()=>{
    //     const storedToken = localStorage.getItem('token');
    //     if (storedToken) {
    //         setToken(storedToken);
    //             getUserCart(storedToken);
    //     }
    // },[]);

    useEffect(() => {
        const initializeApp = async () => {
            // First: Fetch products from backend
            await getProductsData();
            
            // Second: If token exists, fetch the user's cart
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                await getUserCart(storedToken);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value = {
        products,currency,delivery_fee, //to access this across the website(or dom)
        search,setSearch,showSearch,setShowSearch,cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendUrl,token,setToken,setCartItems
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;