import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Content from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Doctor from "./pages/Doctor";

import Placeorder from "./pages/Placeorder";
import Order from "./pages/Order";
import Navbar from "./Component/Navbar";
import Login from "./pages/Login";
import Fotter from "./Component/Fotter";
import Appointment from "./pages/Appoinment";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contect" element={<Content />} />
        <Route path="/Product/:productID" element={<Product />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<Placeorder />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Doctor/:docId" element={<Appointment />} />{" "}
        {/* Doctor details */}
        <Route path="/order" element={<Order />} />
      </Routes>
      <Fotter />
    </div>
  );
};

export default App;
