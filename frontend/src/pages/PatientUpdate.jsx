import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Heart,
  Edit,
  X,
  Check,
  Shield,
} from "lucide-react";

const PatientUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  const patient = location.state;

  const [formData, setFormData] = useState({
    name: patient?.name || "",
    age: patient?.age || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    medicalInfo: patient?.medicalInfo || "",
    bookingId: patient?.bookingId || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated data:", formData);

    navigate(`/doctor/${docId}/book/patientdetails`, { state: formData });
  };

  const handleCancel = () => {
    navigate(-1); // just go back without saving
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="bg-white rounded-t-3xl shadow-lg border border-green-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center shadow-md">
                <Edit className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Update Patient Record
                </h1>
                <p className="text-emerald-700 font-medium mt-1">
                  Modify patient information for Ayurveda consultation
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-100 px-5 py-3 rounded-xl border border-emerald-200">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm font-semibold text-emerald-700">
                Ayurveda System Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-green-100">
          <div className="px-8 py-10">
            <div className="space-y-10">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Personal Information
                </h3>

                {/* Name */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter patient's full name"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-emerald-200 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-emerald-300"
                    />
                  </div>
                </div>

                {/* Age + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z"
                        />
                      </svg>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter patient's age"
                        className="w-full pl-10 pr-4 py-4 bg-white border-2 border-green-200 rounded-xl shadow-sm focus:ring-4 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-green-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full pl-10 pr-4 py-4 bg-white border-2 border-teal-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-teal-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  Contact Information
                </h3>

                {/* Email */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter patient's email address"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-green-200 rounded-xl shadow-sm focus:ring-4 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-green-300"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-teal-500" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter patient's complete address"
                      rows="3"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-teal-200 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-teal-300 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Medical Information for Ayurveda Treatment
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Medical History & Ayurveda Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 w-5 h-5 text-teal-500" />
                    <textarea
                      name="medicalInfo"
                      value={formData.medicalInfo}
                      onChange={handleChange}
                      placeholder="Enter medical history, allergies, current medications, Ayurvedic constitution (Prakriti), or other relevant medical information for natural healing treatment..."
                      rows="6"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-teal-200 rounded-xl shadow-sm resize-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-200 placeholder-gray-400 hover:border-teal-300"
                    ></textarea>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-teal-700 bg-teal-100 p-4 rounded-xl border border-teal-200">
                    <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-medium">
                      Confidential medical information for Ayurveda
                      practitioners - ensure accuracy and completeness for
                      personalized natural healing treatments
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t-2 border-green-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-3 group"
                >
                  <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Cancel Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Save Patient Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-emerald-700 font-medium bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl border border-emerald-200 shadow-sm">
            <strong>Ayurveda Medical Center</strong> • All patient information
            is encrypted and secured for natural healing consultations
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientUpdate;
