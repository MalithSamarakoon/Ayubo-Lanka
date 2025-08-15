import React, { useState } from "react";
import Doctorlist from "../Component/Doctorlist";
import { doctors } from "../assets/frontend_assets/assets"; // Correct to actual path!

const Doctor = () => {
  const [filterDoc, setFilterDoc] = useState(doctors);
  const [activeSpec, setActiveSpec] = useState("All");

  const specialityList = [
    "All",
    "Ayurveda Massage Therapist",
    "Ayurvedic Detox Specialist",
    "Ayurveda Yoga Consultant",
    "Ayurveda Panchakarma Specialist",
    "Ayurvedic Pulse Diagnostician",
    "Sri Lankan Herbal Medicine Expert",
    "Ayurveda Herbalist",
    "Ayurvedic Physician",
  ];

  const handleFilterClick = (spec) => {
    setActiveSpec(spec);
    if (spec === "All") {
      setFilterDoc(doctors);
    } else {
      setFilterDoc(
        doctors.filter(
          (doc) => doc.speciality.toLowerCase() === spec.toLowerCase()
        )
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row px-5 md:px-10 my-10 gap-6">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white rounded-xl shadow-lg p-6 sticky top-20 h-fit">
        <p className="text-lg font-semibold mb-4">Specialities</p>
        <div className="flex flex-col gap-2">
          {specialityList.map((spec) => (
            <button
              key={spec}
              onClick={() => handleFilterClick(spec)}
              className={`text-left px-4 py-2 rounded-lg hover:bg-green-100 transition-colors ${
                activeSpec === spec
                  ? "bg-green-200 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
      {/* Doctor Grid */}
      <div className="md:w-3/4">
        <Doctorlist doctors={filterDoc} />
      </div>
    </div>
  );
};

export default Doctor;
