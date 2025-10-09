import React, { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

<<<<<<< HEAD
  const patient = location.state; // data from PatientForm or after Update
=======
  const [patient, setPatient] = useState(location.state);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

>>>>>>> 1fb6856e269c0dd655edd238ef239b8b47e059bf
  const bookingId =
    patient?.bookingId || `AYU-${Math.floor(Math.random() * 1000000)}`;
  const appointmentId = patient?._id || null;
  const appointmentNo = patient?.id ?? null;

<<<<<<< HEAD
  // IDs to link receipt with this booking
  const appointmentId = patient?._id || null; // Mongo _id of Patient/Booking
  const appointmentNo = patient?.id ?? null; // numeric booking no (if you have)
=======
  // Fetch patient data if not in location.state or if we need updated data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!location.state && patient?._id) {
        try {
          setLoading(true);
          const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
          const res = await fetch(`${base}/api/patients/${patient._id}`);
          if (res.ok) {
            const data = await res.json();
            setPatient(data);
          } else {
            setError("Failed to fetch patient data");
          }
        } catch (err) {
          setError("Error fetching patient data");
          console.error("Fetch patient error:", err);
        } finally {
          setLoading(false);
        }
      } else if (location.state) {
        setLoading(false);
      }
    };
>>>>>>> 1fb6856e269c0dd655edd238ef239b8b47e059bf

    fetchPatientData();
  }, [location.state, patient?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
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
            {error || "No Patient Data Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Please insert patient details first to continue."}
          </p>
          <button
            onClick={() => navigate(`/doctor/${docId}/book/patientform`)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Create New Patient
          </button>
        </motion.div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/doctor/${docId}/book/patientupdate`, {
      state: patient,
      onUpdate: (updatedPatient) => setPatient(updatedPatient),
    });
  };

  const handleCancel = async () => {
    try {
      const pid = patient.id || patient._id;
      if (!pid) throw new Error("No patient id found");
      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const res = await fetch(`${base}/api/patients/${pid}`, {
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
<<<<<<< HEAD
    // 👉 Pass via state + ALSO via URL query (for refresh/update safety)
    const search = new URLSearchParams();
    if (appointmentId) search.set("appointmentId", appointmentId);
    if (appointmentNo != null)
      search.set("appointmentNo", String(appointmentNo));

    navigate(`/onlinepayment?${search.toString()}`, {
=======
    if (!patient._id) {
      alert(
        "Patient ID is missing. Please try updating the patient details again."
      );
      return;
    }

    navigate(`/onlinepayment`, {
>>>>>>> 1fb6856e269c0dd655edd238ef239b8b47e059bf
      state: {
        docId,
        bookingId,
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        amount: patient.amount,
<<<<<<< HEAD
        appointmentId,
        appointmentNo,
=======
        appointmentId: patient._id, 
        appointmentNo: patient.id,
        patientData: patient,
>>>>>>> 1fb6856e269c0dd655edd238ef239b8b47e059bf
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-10 px-4">
      {/* ... (UI content unchanged for brevity) ... */}
      <div className="px-6 md:px-8 pb-8">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
              Available Actions
            </h3>
          </div>

<<<<<<< HEAD
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
=======
           
>>>>>>> 1fb6856e269c0dd655edd238ef239b8b47e059bf
          </div>
        </div>
      </div>
      {/* ... */}
    </div>
  );
};

export default PatientDetails;
