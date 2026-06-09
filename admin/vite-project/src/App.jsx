import React from 'react'
import {useEffect} from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { useState } from 'react'
export const currency = '$';

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setNotification(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      {notification ? (
        <div className={`fixed right-4 top-4 z-50 rounded-md px-4 py-3 text-sm text-white shadow-lg ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      ) : null}
      {token === "" ? <Login setToken={setToken} onNotify={showNotification} /> :<><Navbar setToken={setToken}/>
      <hr/>
      <div className="flex w-full">
        <Sidebar/>
        <div className="w-[70%] mx-auto ml-max(5vw,5px)] my-8 text-gray-600 text-base">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/add" replace />} /> */}
            <Route path="/add" element={<Add token={token} onNotify={showNotification} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            {/* <Route path="*" element={<Navigate to="/add" replace />} /> */}
          </Routes>
        </div>
      </div></> }
      
    </div>
  )
}

export default App
