import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  X,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  const patient = location.state; // data from PatientForm
  const bookingId =
    patient?.bookingId || `AYU-${Math.floor(Math.random() * 1000000)}`;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-2xl rounded-2xl border border-red-200 p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Patient Data Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please insert patient details first to continue with your Ayurveda
            consultation.
          </p>
          <div className="w-16 h-1.5 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/doctor/${docId}/book/patientupdate`, { state: patient });
  };

  const handleCancel = async () => {
    try {
      const pid = patient.id || patient._id;
      if (!pid) throw new Error("No patient id found");
      const res = await fetch(`http://localhost:3000/api/patients/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to cancel");
      alert("Appointment cancelled successfully");
      navigate(`/doctor/${docId}`);
    } catch (e) {
      alert(e.message || "Failed to cancel appointment");
    }
  };

  const handlePay = () => {
    // If your route is /onlinepayment, use that. Otherwise keep this nested path.
    navigate(`/onlinepayment`, { state: { ...patient, bookingId, docId } });
    // navigate(`/doctor/${docId}/book/onlinepayment`, { state: { ...patient, bookingId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl w-full mx-auto bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-green-400 to-emerald-500">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Patient Appointment Details
                </h1>
                <p className="text-white/90 text-sm font-medium">
                  Ayurveda Medical Center • Natural Healing
                </p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 text-right">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-white/80">
                Booking ID
              </p>
              <p className="text-white font-mono font-bold text-lg">
                {bookingId}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white">
          {/* Patient info heading */}
          <div className="px-6 md:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <User className="w-6 h-6 text-emerald-600 mr-3" />
              Patient Information
            </h2>
          </div>

          {/* Patient info grid */}
          <div className="px-6 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Name */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Full Name
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.name}
                </p>
              </div>

              {/* Age */}
              <div className="bg-gradient-to-br from-green-50 to-teal-100 p-5 rounded-xl border border-green-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                    Age
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.age} years old
                </p>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-100 p-5 rounded-xl border border-teal-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                    Phone
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.phone}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {patient.email}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl mb-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
                <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
                  Address
                </span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {patient.address}
              </p>
            </div>

            {/* Medical Info */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-teal-600" />
                <span className="text-sm font-bold text-teal-800 uppercase tracking-wider">
                  Medical Information for Ayurveda Treatment
                </span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {patient.medicalInfo || "No medical information provided"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 md:px-8 pb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Available Actions
                </h3>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={handleUpdate}
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-5 h-5 mr-3" />
                    Update Details
                  </button>

                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <X className="w-5 h-5 mr-3" />
                    Cancel Appointment
                  </button>

                  <button
                    onClick={handlePay}
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetails;
