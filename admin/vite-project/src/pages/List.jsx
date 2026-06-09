import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { currency } from '../App';

const List = ({token}) => {

  const [list,setList] = useState([]);

  const fetchList = async () => {
    try{
      const response = await axios.get(backendUrl + '/api/product/list');
      if(response.data.success){
        setList(response.data.products);
      }else{
        console.log(response.data.message);
      }
      console.log(response.data);
    }catch(error){
      console.log(error);
    }
  }

  const removeProduct = async (id) =>{
    try{
      const response = await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}});

      if(response.data.success){
        await fetchList();
      }else{
        console.log(response.data.message);
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchList();
  },[]);
  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">

        {/* -------------List Product--------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>currency</b>
          <b className="text-center">Actions</b>
        </div>
        {/* ----------Product List------------- */}
        {
          list.map((item,index)=>(
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img src={item.image[0]} alt=''/>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price.toFixed(2)}</p>
              <p className="text-right md:text-center cursor-pointer text-lg" onClick={() => removeProduct(item._id)}>X</p>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default List;
