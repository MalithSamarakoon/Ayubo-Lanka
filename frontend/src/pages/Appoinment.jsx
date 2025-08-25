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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
          <p className="text-lg text-slate-600 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 text-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md ring-1 ring-white/10">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Book Appointment
              </h1>
              <p className="text-emerald-700">
                Schedule your Ayurveda consultation with our specialist
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <DoctorProfileCard docInfo={docInfo} />

        <div className="rounded-3xl bg-white/95 border border-emerald-100 shadow-lg shadow-emerald-100/50 overflow-hidden">
          {/* Section header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 md:p-7">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Available Slots
              </h2>
            </div>
            <p className="text-emerald-100 mt-2">
              Select your preferred date and time for natural healing
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
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
              className={`w-full h-14 inline-flex items-center justify-center rounded-xl font-semibold text-base md:text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                selectedDay && selectedTime
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-0"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              {selectedDay && selectedTime ? (
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Proceed to Book Ayurveda Consultation
                </span>
              ) : (
                "Please select date and time"
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          This is not an emergency service. If you are experiencing a medical
          emergency, please contact your local emergency number immediately.
        </p>
      </div>
    </div>
  );
};

export default Appointment;
