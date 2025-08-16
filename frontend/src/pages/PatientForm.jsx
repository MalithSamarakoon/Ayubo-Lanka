import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
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

const PatientForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/patients", // CHANGE TO YOUR BACKEND URL
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Your information was submitted successfully!");
          setFormData(initialFormState);
          setTouched({});
          setSubmitted(false);
           navigate("/Doctor/:docId/book/patientdetails");
        } else {
          alert(data.message || "There was an error submitting your form.");
        }
      } catch (error) {
        alert("Failed to submit. Network/server error.");
      }
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
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Patient Registration
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Please provide your information to get started with your medical
            consultation
          </p>
        </div>
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              id="name"
              type="text"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name && (touched.name || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
            />
            {errors.name && (touched.name || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block font-medium text-gray-700 mb-2"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <input
              name="age"
              id="age"
              type="number"
              min="1"
              max="120"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.age && (touched.age || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your age"
            />
            {errors.age && (touched.age || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.age}</p>
            )}
          </div>
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block font-medium text-gray-700 mb-2"
            >
              Telephone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              id="phone"
              type="tel"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone && (touched.phone || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter telephone number"
            />
            {errors.phone && (touched.phone || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              id="email"
              type="email"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email && (touched.email || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="your@email.com"
            />
            {errors.email && (touched.email || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 mb-2"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              id="address"
              type="text"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.address && (touched.address || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter address"
            />
            {errors.address && (touched.address || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>
          {/* Medical Info */}
          <div>
            <label
              htmlFor="medicalInfo"
              className="block font-medium text-gray-700 mb-2"
            >
              Relevant Medical Information (optional)
            </label>
            <textarea
              name="medicalInfo"
              id="medicalInfo"
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.medicalInfo && (touched.medicalInfo || submitted)
                  ? "border-red-400"
                  : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none`}
              value={formData.medicalInfo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Allergies, chronic conditions, medications…"
            />
            {errors.medicalInfo && (touched.medicalInfo || submitted) && (
              <p className="text-xs text-red-500 mt-1">{errors.medicalInfo}</p>
            )}
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formData.medicalInfo.length}/500
            </div>
          </div>
          {/* Continue/Button */}
          <button
            type="submit"
            className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition-all"
          >
            Continue
          </button>
        </form>
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
