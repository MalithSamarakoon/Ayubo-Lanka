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
  Trash2,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  const patient = location.state;
  const bookingId =
    patient?.bookingId || `AYU-${Math.floor(Math.random() * 1000000)}`;
  const appointmentId = patient?._id || null;
  const appointmentNo = patient?.id ?? null;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Patient Data Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            It seems the patient details were not provided. Please go back and
            fill out the form first.
          </p>
          <button
            onClick={() => navigate(`/doctor/${docId}/book`)}
            className="flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back to Form
          </button>
        </motion.div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/doctor/${docId}/book/patientupdate`, { state: patient });
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const pid = patient.id || patient._id;
        if (!pid) throw new Error("No patient ID found");

        const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
        const res = await fetch(`${base}/api/patients/${pid}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to cancel");
        }

        await Swal.fire(
          "Cancelled!",
          "Your appointment has been cancelled.",
          "success"
        );
        navigate(`/doctor/${docId}`);
      } catch (e) {
        Swal.fire(
          "Error!",
          e.message || "Failed to cancel appointment.",
          "error"
        );
      }
    }
  };

  const handlePay = () => {
    if (!appointmentId) {
      Swal.fire(
        "Missing Information",
        "Patient ID is missing. Please try updating the patient details again.",
        "error"
      );
      return;
    }
    const search = new URLSearchParams({ appointmentId });
    if (appointmentNo != null) {
      search.set("appointmentNo", String(appointmentNo));
    }
    navigate(`/onlinepayment?${search.toString()}`, {
      state: { docId, bookingId, ...patient },
    });
  };

  const DetailItem = ({ icon, label, value }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex items-start gap-4 p-5 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 border border-transparent hover:border-emerald-100 hover:shadow-sm"
    >
      <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-semibold text-gray-800 break-words leading-relaxed">
          {value || <span className="text-gray-400 italic">Not Provided</span>}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Patient Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 relative"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400"></div>

          <div className="px-8 py-8 bg-gradient-to-br from-emerald-50 via-white to-green-50/30 border-b border-gray-100 flex items-center gap-5">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
            >
              <User className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Patient Appointment Summary
              </h1>
             
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={<User className="w-5 h-5 text-emerald-600" />}
              label="Full Name"
              value={patient.name}
            />
            <DetailItem
              icon={<Calendar className="w-5 h-5 text-emerald-600" />}
              label="Age"
              value={patient.age}
            />
            <DetailItem
              icon={<Phone className="w-5 h-5 text-emerald-600" />}
              label="Phone Number"
              value={patient.phone}
            />
            <DetailItem
              icon={<Mail className="w-5 h-5 text-emerald-600" />}
              label="Email Address"
              value={patient.email}
            />
            <div className="md:col-span-2">
              <DetailItem
                icon={<MapPin className="w-5 h-5 text-emerald-600" />}
                label="Address"
                value={patient.address}
              />
            </div>
            <div className="md:col-span-2">
              <DetailItem
                icon={<FileText className="w-5 h-5 text-emerald-600" />}
                label="Medical Information"
                value={patient.medicalInfo}
              />
            </div>
          </div>
        </motion.div>

        {/* Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"></div>

          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="inline-block w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></span>
              Next Steps
            </h2>
            <p className="text-sm text-gray-600 mt-1 ml-7">
              Choose an action to proceed with your appointment
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ActionButton
              icon={<Edit />}
              text="Update Details"
              onClick={handleUpdate}
              variant="secondary"
            />
            <ActionButton
              icon={<Trash2 />}
              text="Cancel"
              onClick={handleCancel}
              variant="danger"
            />
            <ActionButton
              icon={<CreditCard />}
              text="Proceed to Payment"
              onClick={handlePay}
              variant="primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ActionButton = ({ icon, text, onClick, variant }) => {
  const baseClasses =
    "w-full flex items-center justify-center px-5 py-4 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 relative overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white focus:ring-emerald-300",
    secondary:
      "bg-white text-emerald-700 border-2 border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-400 focus:ring-emerald-200",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-300",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
      {React.cloneElement(icon, { className: "w-5 h-5 mr-2 relative z-10" })}
      <span className="relative z-10">{text}</span>
    </motion.button>
  );
};

export default PatientDetails;
