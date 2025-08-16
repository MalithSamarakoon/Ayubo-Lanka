import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/frontend_assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const bookingSlots = [
    { day: "MON", date: 10, label: "MON" },
    { day: "TUE", date: 11, label: "TUE" },
    { day: "WED", date: 12, label: "WED" },
    { day: "THU", date: 13, label: "THU" },
    { day: "FRI", date: 14, label: "FRI" },
    { day: "SAT", date: 15, label: "SAT" },
    { day: "SUN", date: 16, label: "SUN" },
  ];

  const timeSlots = [
    "8:00 am",
    "8:30 am",
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
  ];

  useEffect(() => {
    if (doctors && docId) {
      const doc = doctors.find((d) => d._id === docId);
      setDocInfo(doc);
    }
  }, [doctors, docId]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Doctor Image */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex justify-center items-center">
              <img
                src={docInfo.image}
                alt={docInfo.name}
                className="w-32 h-40 md:w-40 md:h-48 rounded-lg object-cover shadow-lg"
              />
            </div>
            {/* Doctor Details */}
            <div className="flex-1 p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    Dr. {docInfo.name}
                    <span className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  </h1>
                  <p className="text-gray-600 mb-1">
                    {docInfo.degree} - {docInfo.speciality}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {docInfo.experience}
                  </p>
                </div>
              </div>
              {/* About Section */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">About</h3>
                  <span className="ml-2 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">i</span>
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {docInfo.about}
                </p>
              </div>
              {/* Appointment Fee */}
              <div>
                <p className="text-gray-900 font-medium">
                  Appointment Fee:{" "}
                  <span className="text-xl font-bold">${docInfo.fees}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Booking Slots Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Booking slots
            </h2>
            {/* Day Selection */}
            <div className="flex flex-wrap gap-3 mb-8">
              {bookingSlots.map((slot) => (
                <button
                  key={slot.day}
                  onClick={() => setSelectedDay(slot.day)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 min-w-[70px] ${
                    selectedDay === slot.day
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-medium mb-1">{slot.label}</span>
                  <span className="text-lg font-bold">{slot.date}</span>
                </button>
              ))}
            </div>
            {/* Time Selection */}
            <div className="flex flex-wrap gap-3 mb-8">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedTime === time
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {/* Book Appointment Button */}
            <button
              onClick={() => navigate(`/Doctor/${docId}/book/patientform`)}
              className="w-full bg-blue-500 text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedDay || !selectedTime}
            >
              Book an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
