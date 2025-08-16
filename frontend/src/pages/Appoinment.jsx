import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

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
        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex justify-center items-center">
              <img
                src={docInfo.image}
                alt={docInfo.name}
                className="w-32 h-40 md:w-40 md:h-48 rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="flex-1 p-6 md:p-8">
              <h1 className="text-2xl font-bold">Dr. {docInfo.name}</h1>
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <p>{docInfo.experience}</p>
              <p>{docInfo.about}</p>
              <p>Fee: ${docInfo.fees}</p>
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Booking slots
            </h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {bookingSlots.map((slot) => (
                <button
                  key={slot.day}
                  onClick={() => setSelectedDay(slot.day)}
                  className={`p-3 rounded-lg border-2 ${
                    selectedDay === slot.day
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {slot.label} {slot.date}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border-2 ${
                    selectedTime === time
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate(`/doctor/${docId}/book/patientform`)}
              disabled={!selectedDay || !selectedTime}
              className="w-full bg-blue-500 text-white py-4 px-8 rounded-lg"
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
