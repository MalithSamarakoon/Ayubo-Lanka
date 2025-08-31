import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Content from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Doctor from "./pages/Doctor";
import PatientForm from "./pages/PatientForm"; // Import PatientForm
import Placeorder from "./pages/Placeorder";
import Order from "./pages/Order";
import Navbar from "./Component/Navbar";
import Login from "./pages/Login";
import Fotter from "./Component/Fotter";
import Appointment from "./pages/Appoinment"; 
import Support from "./pages/Support";

// Doctor details (slot selector)
import PatientDetails from "./pages/PatientDetails"; // Import PatientDetails page
import PatientUpdate from "./pages/PatientUpdate"; // Import PatientUpdate page
import Onlinepayment from "./pages/Onlinepayment"
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
        <Route path="/doctor/:docId" element={<Appointment />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/doctor/:docId/book/patientform"
          element={<PatientForm />}
        />
        <Route
          path="/doctor/:docId/book/patientdetails"
          element={<PatientDetails />}
        />
        <Route
          path="/doctor/:docId/book/patientupdate"
          element={<PatientUpdate />}
        />
        <Route path="/order" element={<Order />} />
      </Routes>
      <Fotter />
    </div>
  );
};
export default App;
