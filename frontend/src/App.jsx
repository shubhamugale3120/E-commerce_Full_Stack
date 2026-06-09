import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collections'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Orders from './pages/Orders'
import PlaceOrders from './pages/PlaceOrders'
import Products from './pages/Products'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import Verify from './pages/Verify'
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* Use to notify user about the size selection */}
      <ToastContainer/>
      <Navbar/>
      <SearchBar />
      <Routes>
          <Route path= '/' element = {<Home/>} />
          <Route path = '/about' element = {<About/>}/>
          <Route path = '/cart' element ={<Cart/>} />
          <Route path = '/collection' element = {<Collection/>}  />
          <Route path = '/contact' element = {<Contact/>} />
          <Route path = '/login' element = {<Login/>} />
          <Route path = '/orders' element = {<Orders/>} />
          <Route path = '/place-orders' element = {<PlaceOrders/>} />
          <Route path = '/product/:productId' element = {<Products/>} />
          <Route path = '/verify' element = {<Verify/>} />
      </Routes>
      <Footer/>
      
    </div>
  )
}

export default App
