import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import axios from "axios";
import DoctorProfileCard from "../Component/DoctorProfileCard";
import BookingDateSelector from "../Component/BookingDateSelector";
import BookingTimeSelector from "../Component/BookingTimeSelector";
import BookingSummary from "../Component/BookingSummary";


const URL = "http://localhost:5000/api/user/users";

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

  "2:30 PM",

  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!docId) {
        setError("No doctor ID provided");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(URL);
        const doctors = res.data?.users || [];
        const doctor = doctors.find(
          (d) => d._id === docId && d.role?.toLowerCase() === "doctor"
        );
        if (doctor) {
          const transformedDoctor = {
            ...doctor, 
            name: doctor.name || "Unknown Doctor",
            speciality: doctor.specialization || "General Practice",
            fees: 2500,
            experience: "5 years",
            about: `Dr. ${
              doctor.name
            } is a certified medical professional specializing in ${
              doctor.specialization || "General Practice"
            }.`,
            address: doctor.companyAddress || "Medical Center",
            degree: "MBBS, MD",
            image: "/api/placeholder/300/300",
          };
          setDocInfo(transformedDoctor);
          setSelectedDay(null);
          setSelectedTime(null);
        } else {
          setError("Doctor not found");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor information");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, [docId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            Loading doctor information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !docInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Doctor Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the doctor you're looking for.
          </p>
          <button
            onClick={() => navigate("/doctor")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-emerald-500 green-400">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br  from-green-400 to-emerald-500 flex items-center justify-center shadow-md ring-1 ring-white/10">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl leading-tight font-extrabold text-slate-900 tracking-tight">
                Book Appointment
              </h1>
              <p className="text-sm md:text-base text-black-500">
                Schedule your consultation with Dr. {docInfo.name}
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <DoctorProfileCard
          docInfo={docInfo}
          onBook={() =>
            document
              .getElementById("booking-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />

        <div
          id="booking-section"
          className="rounded-3xl bg-white/95 border border-emerald-100 shadow-lg shadow-emerald-100/50 overflow-hidden"
        >
         

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
              onClick={() =>
                navigate(`/doctor/${docId}/book/patientform`, {
                  state: { doctorId: docInfo._id, selectedDay, selectedTime },
                })
              }
              disabled={!selectedDay || !selectedTime}
              className={`w-full h-14 inline-flex items-center justify-center rounded-xl font-semibold text-base md:text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                selectedDay && selectedTime
                  ? "bg-gradient-to-r from-emerald-500 via-teal-600 to-green-400 text-white shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-0"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              {selectedDay && selectedTime ? (
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Proceed to Book Consultation
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
