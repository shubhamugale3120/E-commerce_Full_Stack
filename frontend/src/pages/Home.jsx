import React from "react";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import BestSeller from "../Components/BestSeller";
import OurPolicy from '../Components/OurPolicy'
import NewsletterBox from "../Components/NewsletterBox";

const Home = () =>{
    return (
        <>
        <Hero/>
        <LatestCollection/>
        <BestSeller/>
        <OurPolicy/> 
        <NewsletterBox/>
        </>
    )
}

export default Home;