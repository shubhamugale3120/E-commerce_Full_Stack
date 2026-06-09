import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

export default function SearchBar() {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const [visible,setVisible] = useState(false);

    useEffect (()=>{
        if(location.pathname.includes('collection')  ) {
            setVisible(true);
        }else{
            setVisible(false);
        }
    },[location])

    // FIX: Only render the search bar if showSearch is true
    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center py-4'>
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2">
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    type="text" 
                    className="flex-1 outline-none bg-inherit text-sm" 
                    placeholder='Search'
                />
                <img src={assets.search_icon} alt="" className="w-4" />
            </div>
            <img 
                onClick={() => setShowSearch(false)} 
                className='inline w-3 cursor-pointer' 
                src={assets.cross_icon} 
                alt="" 
            />
        </div>
    ) : null; // Return null if showSearch is false
}