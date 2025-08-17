import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Award } from "lucide-react";
import { AppContext } from "../Context/AppContext";

const bookingSlots = [
  { day: "MON", date: 10, label: "MON", fullDate: "Aug 10" },
  { day: "TUE", date: 11, label: "TUE", fullDate: "Aug 11" },
  { day: "WED", date: 12, label: "WED", fullDate: "Aug 12" },
  { day: "THU", date: 13, label: "THU", fullDate: "Aug 13" },
  { day: "FRI", date: 14, label: "FRI", fullDate: "Aug 14" },
  { day: "SAT", date: 15, label: "SAT", fullDate: "Aug 15" },
  { day: "SUN", date: 16, label: "SUN", fullDate: "Aug 16" },
];

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (doctors && docId) {
      const doc = doctors.find((d) => d._id === docId);
      setDocInfo(doc);
    }
  }, [doctors, docId]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Book Appointment
              </h1>
              <p className="text-gray-600">
                Schedule your consultation with our specialist
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Doctor Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Doctor Image Section */}
            <div className="relative lg:w-80">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
              <div className="relative p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="relative mb-4">
                  <img
                    src={docInfo.image}
                    alt={`Dr. ${docInfo.name}`}
                    className="w-32 h-40 lg:w-40 lg:h-48 rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="text-center text-white">
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm opacity-90">Available Today</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Dr. {docInfo.name}
                      </h2>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                        <Award className="w-5 h-5" />
                        <span>
                          {docInfo.degree} - {docInfo.speciality}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        Rs. {docInfo.fees}.00
                      </p>
                      <p className="text-sm text-gray-600">Consultation</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <User className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{docInfo.experience}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {docInfo.about}
                    </p>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">4.9 (127 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Available Slots</h2>
            </div>
            <p className="text-blue-100 mt-2">
              Select your preferred date and time
            </p>
          </div>

          <div className="p-6 lg:p-8">
            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Select Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {bookingSlots.map((slot) => (
                  <button
                    key={slot.day}
                    onClick={() => setSelectedDay(slot.day)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedDay === slot.day
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-sm font-medium ${
                          selectedDay === slot.day
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {slot.label}
                      </div>
                      <div
                        className={`text-xl font-bold mt-1 ${
                          selectedDay === slot.day
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {slot.date}
                      </div>
                      <div
                        className={`text-xs ${
                          selectedDay === slot.day
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {slot.fullDate}
                      </div>
                    </div>
                    {selectedDay === slot.day && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Select Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`group relative px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedTime === time
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center font-medium">{time}</div>
                    {selectedTime === time && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            {selectedDay && selectedTime && (
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">Dr. {docInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {
                        bookingSlots.find((s) => s.day === selectedDay)
                          ?.fullDate
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold">Consultation Fee:</span>
                    <span className="font-bold text-blue-600">
                    Rs. {docInfo.fees}.00
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={() => navigate(`/doctor/${docId}/book/patientform`)}
              disabled={!selectedDay || !selectedTime}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 ${
                selectedDay && selectedTime
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedDay && selectedTime ? (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Proceed to Book Appointment
                </span>
              ) : (
                "Please select date and time"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
