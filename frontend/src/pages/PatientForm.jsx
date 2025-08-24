import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Heart,
  CheckCircle,
} from "lucide-react";

const initialFormState = {
  name: "",
  age: "",
  phone: "",
  email: "",
  address: "",
  medicalInfo: "",
};

const PatientForm = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Your information was submitted successfully!");
        navigate(`/doctor/${docId}/book/patientdetails`, {
          state: data.patient || data,
        });
      } else {
        alert(data.message || "Error submitting form");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Ayurveda Medical Center Header */}
        <div className="bg-white shadow-lg rounded-2xl border border-green-100 mb-6 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Patient Registration Form
                </h1>
                <p className="text-green-100 text-sm font-medium">
                  Ayurveda Medical Center - Natural Healing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Form */}
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 text-emerald-600 mr-3" />
              Patient Information
            </h2>
            <p className="text-sm text-emerald-700 mt-2 font-medium">
              Please fill out all required fields marked with *
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-emerald-500"
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
                    </div>
                    <input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Medical Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Medical History / Current Conditions
                  <span className="text-emerald-600 font-medium ml-2">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="w-5 h-5 text-emerald-500" />
                  </div>
                  <textarea
                    name="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    placeholder="Please provide any relevant medical history, current medications, allergies, or health conditions that may help our Ayurveda practitioners provide better care..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-3 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                  />
                </div>
                <p className="text-sm text-emerald-600 mt-2 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  This information helps our Ayurveda practitioners provide
                  personalized natural healing treatments. All medical
                  information is strictly confidential.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t-2 border-green-100">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                Submit Patient Information
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-emerald-700 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl border border-emerald-200 shadow-sm">
            <strong>Ayurveda Medical Center</strong> © 2024 • Natural Healing &
            Wellness • All patient information is confidential and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
