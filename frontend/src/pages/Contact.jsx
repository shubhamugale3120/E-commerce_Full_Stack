import Title from '../Components/Title'
import { assets } from "../assets/frontend_assets/assets";
import NewletterBox from '../Components/NewsletterBox';

const Contact = () =>{
    return (
        <div>
         <div className="text-center text-2xl pt-10 border-t">
            <Title text1="Contact" text2="Us" />
         </div>

         <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
            <img src={assets.contact_img} alt="" className="w-full md:max-w-[480px]" />
            <div className="flex flex-col justify-center items-start gap-6">
                <p className="font-semibold text-xl text-gray-600">Our Store</p>
                <p className="text-gray-500">54709 willms station <br/>New York, NY 10001</p>
                <p className="text-gray-500">Phone: (123) 456-7890 <br/>Email: info@ourstore.com</p>
                <p className="font-semibold text-xl text-gray-600">Careers at forever</p>
                <p className="text-gray-500">Learn more about our opening hours.</p>
                <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">View Careers</button>
            </div>
         </div>
         <NewletterBox />
        </div>
    )
}

export default Contact