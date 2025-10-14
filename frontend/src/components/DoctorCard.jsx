
import React from "react";

const DoctorCard = ({ doctor, onBook, onViewDetails }) => {
  return (
    <div
      key={doctor._id}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
    >
    
      <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 p-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
           
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
     
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              doctor.isApproved
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {doctor.isApproved ? "Verified" : "Pending"}
          </span>
        </div>
      </div>

     
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {doctor.name}
          </h3>
          <p className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-block">
            {doctor.specialization || "General Practice"}
          </p>
        </div>

        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            {doctor.email}
          </div>
          {doctor.mobile !== "-" && (
            <div className="flex items-center text-gray-600 text-sm">
              {doctor.mobile}
            </div>
          )}
          {doctor.doctorLicenseNumber !== "-" && (
            <div className="flex items-center text-gray-600 text-sm">
              License: {doctor.doctorLicenseNumber}
            </div>
          )}
        </div>

        
        <div className="flex space-x-2">
          <button
            onClick={() => onBook(doctor._id)}
            disabled={!doctor.isApproved}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              doctor.isApproved
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => onViewDetails(doctor._id)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Info SVG Icon */}
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
