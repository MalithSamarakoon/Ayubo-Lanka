import React, { useState } from "react";

const initialFormState = {
  name: "",
  age: "",
  phone: "",
  email: "",
  address: "",
  medicalInfo: "",
};

const validate = (values) => {
  let errors = {};
  // Name
  if (!values.name.trim()) errors.name = "Full name is required";
  // Age
  if (!values.age) errors.age = "Age is required";
  else if (
    isNaN(Number(values.age)) ||
    Number(values.age) < 1 ||
    Number(values.age) > 120
  )
    errors.age = "Please enter a valid age";
  // Phone
  if (!values.phone.trim()) errors.phone = "Telephone number is required";
  else if (!/^[\d\+\-\s]{7,15}$/.test(values.phone))
    errors.phone = "Please enter a valid telephone number";
  // Email
  if (!values.email.trim()) errors.email = "Email is required";
  else if (
    !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/.test(
      values.email
    )
  )
    errors.email = "Please enter a valid email address";
  // Address
  if (!values.address.trim()) errors.address = "Address is required";
  // Medical Information: Optional
  if (values.medicalInfo.length > 500)
    errors.medicalInfo = "Maximum 500 characters allowed";
  return errors;
};

const PatientForm = ({ onContinue }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
      if (onContinue) onContinue(formData);
      // Proceed with next step if needed (e.g. API call)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Patient Registration
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Please provide your information to get started with your medical
            consultation
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                Personal Information
              </h2>

              {/* Name */}
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    name="name"
                    id="name"
                    type="text"
                    className={`w-full px-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                      errors.name && (touched.name || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (touched.name || submitted) && (
                  <div className="flex items-center mt-2 text-red-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="group">
                <label
                  htmlFor="age"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Age <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    name="age"
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    className={`w-full px-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                      errors.age && (touched.age || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your age"
                  />
                </div>
                {errors.age && (touched.age || submitted) && (
                  <div className="flex items-center mt-2 text-red-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">{errors.age}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                Contact Information
              </h2>

              {/* Phone */}
              <div className="group">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Telephone Number <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    name="phone"
                    id="phone"
                    type="tel"
                    className={`w-full pl-14 pr-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                      errors.phone && (touched.phone || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter telephone number"
                  />
                </div>
                {errors.phone && (touched.phone || submitted) && (
                  <div className="flex items-center mt-2 text-red-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">{errors.phone}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className={`w-full pl-14 pr-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                      errors.email && (touched.email || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (touched.email || submitted) && (
                  <div className="flex items-center mt-2 text-red-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">{errors.email}</p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="group">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Home Address <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-6 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <input
                    name="address"
                    id="address"
                    type="text"
                    className={`w-full pl-14 pr-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                      errors.address && (touched.address || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your complete address"
                  />
                </div>
                {errors.address && (touched.address || submitted) && (
                  <div className="flex items-center mt-2 text-red-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">{errors.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                Medical Information
              </h2>

              {/* Medical Info */}
              <div className="group">
                <label
                  htmlFor="medicalInfo"
                  className="block text-sm font-semibold text-slate-700 mb-3"
                >
                  Relevant Medical Information
                  <span className="text-slate-500 font-normal ml-2">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    name="medicalInfo"
                    id="medicalInfo"
                    rows={4}
                    maxLength={500}
                    className={`w-full px-6 py-4 text-slate-900 bg-white border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:scale-[1.02] resize-none ${
                      errors.medicalInfo && (touched.medicalInfo || submitted)
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    }`}
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Please include any allergies, chronic conditions, current medications, or other relevant medical information..."
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    {errors.medicalInfo &&
                      (touched.medicalInfo || submitted) && (
                        <div className="flex items-center text-red-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-sm font-medium">
                            {errors.medicalInfo}
                          </p>
                        </div>
                      )}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      formData.medicalInfo.length > 450
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
                  >
                    {formData.medicalInfo.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-95"
              >
                <div className="flex items-center justify-center">
                  <span>Continue to Next Step</span>
                  <svg
                    className="w-6 h-6 ml-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Your information is secure and will only be used for medical
            consultation purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
