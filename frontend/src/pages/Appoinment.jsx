import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { AppContext } from "../Context/AppContext";
import DoctorProfileCard from "../Component/DoctorProfileCard";
import BookingDateSelector from "../Component/BookingDateSelector";
import BookingTimeSelector from "../Component/BookingTimeSelector";
import BookingSummary from "../Component/BookingSummary";

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
        <DoctorProfileCard docInfo={docInfo} />
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
            <BookingDateSelector
              bookingSlots={bookingSlots}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
            <BookingTimeSelector
              timeSlots={timeSlots}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
            <BookingSummary
              docInfo={docInfo}
              bookingSlots={bookingSlots}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
            />
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
