import Title from "../Components/Title"
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from "../Components/NewsletterBox";

const About = () =>{
    return(
         <div>
            <div className="text-2xl text-center pt-8 border-t">
                <Title text1="About" text2="Us" />
            </div>
            <div className="my-10 flex flex-col md:flex-row gap-16">
                <img src={assets.about_img} alt="" className="w-full md:max-w-[450px]" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                    <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <b className="text-gray-800">Our Mission</b>
                    <p>Our mission is to provide the best products and services to our customers.</p>
                </div>
            </div>
            <div className="text-xl py-4">
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className="flex flex-col md:flex-row text-sm mb-20">
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Quality Assurance:</b>
                    <p className="text-gray-600">We are committed to providing high-quality products that meet the highest standards.</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Convenience</b>
                    <p className="text-gray-600">We strive to make shopping easy and convenient for our customers.</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Exceptional Customer Service</b>
                    <p className="text-gray-600">We are dedicated to providing exceptional customer service that exceeds expectations.</p>
                </div>
            </div>
            <NewsletterBox />
         </div>
    )
}

export default About