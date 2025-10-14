import React from "react";
import ayuboLogo from "../assets/frontend_assets/ayubologo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-50 to-emerald-100 text-gray-700 w-full border-t border-emerald-200 mt-32">
      <div className="mx-auto px-6  py-12 grid grid-cols-1 sm:grid-cols-3 justify-between text-sm">
        
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={ayuboLogo}
              alt="AyuboLanka Logo"
              className="w-16 h-16 object-contain"
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 text-transparent bg-clip-text">
              AyuboLanka.lk
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Your trusted Ayurvedic partner in wellness and natural healing. 
            Discover authentic herbal products crafted with care for your wellbeing.
          </p>
        </div>

       
        <div className="mx-auto">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Company</h3>
          <ul className="flex flex-col gap-2">
            <li className="hover:text-emerald-600 cursor-pointer transition-colors">
              Home
            </li>
            <li className="hover:text-emerald-600 cursor-pointer transition-colors">
              About Us
            </li>
            <li className="hover:text-emerald-600 cursor-pointer transition-colors">
              Delivery
            </li>
            <li className="hover:text-emerald-600 cursor-pointer transition-colors">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mx-auto">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium">📞</span>
              +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium">✉️</span>
              Galgamustores@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium">📍</span>
              Galgamuwa, Sri Lanka
            </li>
          </ul>
        </div>
      </div>

   
      <div className="border-t border-emerald-300 mt-6"></div>

   
      <p className="text-center text-sm py-5 text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-emerald-700">AyuboLanka.lk</span> — All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
