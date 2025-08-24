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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Book Appointment
              </h1>
              <p className="text-green-700">
                Schedule your Ayurveda consultation with our specialist
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <DoctorProfileCard docInfo={docInfo} />
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Available Slots</h2>
            </div>
            <p className="text-green-100 mt-2">
              Select your preferred date and time for natural healing
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
                  ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] hover:from-green-700 hover:via-emerald-700 hover:to-teal-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedDay && selectedTime ? (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Proceed to Book Ayurveda Consultation
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
