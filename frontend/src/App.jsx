import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import BestSeller from "./Component/BestSeller";
import Footer from "./Component/Fotter";
import Hero from "./Component/Hero";
import LatestCollection from "./Component/LatestCollection";

import NewsLetterBox from "./Component/NewsLetterBox";
import OurPolicy from "./Component/OurPolicy";
import ProductItems from "./Component/ProductItems";
import Title from "./Component/Title";

import Appointment from "./pages/Appoinment"
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Onlinepayment from "./pages/Onlinepayment";
import Order from "./pages/Order";
import PatientDetails from "./pages/PatientDetails";
import PatientForm from "./pages/PatientForm";
import PatientUpdate from "./pages/PatientUpdate";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/doctor/:docId" element={<Appointment />} />
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
        <Route path="/onlinepayment" element={<Onlinepayment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
