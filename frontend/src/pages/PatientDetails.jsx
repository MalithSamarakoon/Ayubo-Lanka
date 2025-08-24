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

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  const patient = location.state; // incoming patient data from PatientForm

  // If backend didn't provide bookingId, generate one
  const bookingId =
    patient?.bookingId || `AYU-${Math.floor(Math.random() * 1000000)}`;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
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
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/doctor/${docId}/book/patientupdate`, { state: patient });
  };

  const handleCancel = async () => {
    try {
      await fetch(`http://localhost:3000/api/patients/${patient.id}`, {
        method: "DELETE",
      });
      alert("Appointment cancelled successfully");
      navigate(`/doctor/${docId}`);
    } catch {
      alert("Failed to cancel appointment");
    }
  };

  const handlePay = () => {
    navigate(`/doctor/${docId}/book/payment`, {
      state: { ...patient, bookingId },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Ayurveda Medical Center Header */}
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Patient Appointment Details
                  </h1>
                  <p className="text-green-100 text-sm font-medium">
                    Ayurveda Medical Center - Natural Healing
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                  <p className="text-xs text-green-100 uppercase tracking-wider font-semibold">
                    Booking ID
                  </p>
                  <p className="text-yellow-300 font-mono font-bold text-lg">
                    {bookingId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <User className="w-6 h-6 text-emerald-600 mr-3" />
              Patient Information
            </h2>
          </div>

          <div className="p-8">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Full Name
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.name}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-100 p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                    Age
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.age} years old
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-100 p-5 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Phone
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {patient.phone}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {patient.email}
                </p>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl mb-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
                <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
                  Address
                </span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {patient.address}
              </p>
            </div>

            {/* Medical Information */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
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
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              Available Actions
            </h3>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleUpdate}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit className="w-5 h-5 mr-3" />
                Update Details
              </button>

              <button
                onClick={handleCancel}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <X className="w-5 h-5 mr-3" />
                Cancel Appointment
              </button>

              <button
                onClick={handlePay}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
