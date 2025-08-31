import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

  navigate(`/doctor/:docId/book/patientdetails`, { state: formData });
};
  const handleCancel = () => {
    navigate(-1); // just go back without saving
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Update Patient Record
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Modify patient information and medical details
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                System Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-b-2xl shadow-lg border-x border-b border-slate-200">
          <div className="px-8 py-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-medium text-slate-800 mb-6 flex items-center">
                  <div className="w-5 h-5 bg-blue-600 rounded-full mr-3"></div>
                  Personal Information
                </h3>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient's full name"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                  />
                </div>

                {/* Age + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter patient's age"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-medium text-slate-800 mb-6 flex items-center">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full mr-3"></div>
                  Contact Information
                </h3>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter patient's email address"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Home Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter patient's complete address"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-medium text-slate-800 mb-6 flex items-center">
                  <div className="w-5 h-5 bg-red-600 rounded-full mr-3"></div>
                  Medical Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Medical History & Notes
                  </label>
                  <textarea
                    name="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    placeholder="Enter medical history, allergies, current medications, or other relevant medical information..."
                    rows="6"
                    className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-lg shadow-sm resize-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-slate-900 transition-all duration-200 placeholder-slate-400"
                  ></textarea>
                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Confidential medical information - ensure accuracy and
                    completeness
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-4 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 group"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Cancel Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 group transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Save Patient Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            All patient information is encrypted and secured according to HIPAA
            standards
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientUpdate;
