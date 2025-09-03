import React, { useRef, useState } from "react";
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

const sriLankaPhone = /^(?:\+94|0)\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const refs = {
    name: useRef(null),
    age: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    address: useRef(null),
  };

  const setFieldError = (field, msg) =>
    setErrors((prev) => ({ ...prev, [field]: msg }));

  const validateField = (field, value) => {
    let msg = "";
    switch (field) {
      case "name":
        if (!value.trim()) msg = "Name is required.";
        else if (value.trim().length < 2)
          msg = "Name must be at least 2 characters.";
        break;
      case "age": {
        if (value === "" || value === null) msg = "Age is required.";
        else {
          const n = Number(value);
          if (!Number.isInteger(n)) msg = "Age must be a whole number.";
          else if (n < 0 || n > 120) msg = "Age must be between 0 and 120.";
        }
        break;
      }
      case "phone":
        if (!value.trim()) msg = "Phone is required.";
        else if (!sriLankaPhone.test(value.trim()))
          msg = "Use 0XXXXXXXXX or +94XXXXXXXXX.";
        break;
      case "email":
        if (!value.trim()) msg = "Email is required.";
        else if (!emailRegex.test(value.trim()))
          msg = "Please enter a valid email.";
        break;
      case "address":
        if (!value.trim()) msg = "Address is required.";
        break;
      default:
        break;
    }
    setFieldError(field, msg);
    return !msg;
  };

  const validateAll = () => {
    const fields = ["name", "age", "phone", "email", "address"];
    const results = fields.map((f) => validateField(f, formData[f]));
    return results.every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === "age" ? value.replace(/[^\d]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    if (touched[name]) validateField(name, next);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    validateField(name, formData[name]);
  };

  const scrollToFirstError = () => {
    const first = Object.entries(errors).find(
      ([k, v]) => v && refs[k]?.current
    );
    if (first) {
      refs[first[0]].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      refs[first[0]].current.querySelector("input,textarea")?.focus?.();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      age: true,
      phone: true,
      email: true,
      address: true,
    });

    if (!validateAll()) {
      setTimeout(scrollToFirstError, 0);
      return;
    }

    try {
      setSubmitting(true);
     const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
 const response = await fetch(`${API_BASE}/api/patients`, {
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
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-3 transition-all duration-200 bg-white";
  const errCls = "border-red-300 focus:border-red-500 focus:ring-red-100";
  const okCls =
    "border-green-200 focus:border-emerald-500 focus:ring-emerald-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        {/* Form */}
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

          <form onSubmit={handleSubmit} className="p-8 space-y-8" noValidate>
            {/* Personal */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={refs.name}>
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
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      className={`${inputBase} ${
                        errors.name ? errCls : okCls
                      } hover:border-emerald-300`}
                      aria-invalid={!!errors.name}
                      aria-describedby="name-error"
                      required
                      minLength={2}
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div ref={refs.age}>
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
                      onBlur={handleBlur}
                      placeholder="Enter your age"
                      className={`${inputBase} ${
                        errors.age ? errCls : okCls
                      } hover:border-emerald-300`}
                      aria-invalid={!!errors.age}
                      aria-describedby="age-error"
                      required
                      min={0}
                      max={120}
                      step={1}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.age && (
                    <p id="age-error" className="mt-2 text-sm text-red-600">
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={refs.phone}>
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
                      onBlur={handleBlur}
                      placeholder="0XXXXXXXXX or +94XXXXXXXXX"
                      className={`${inputBase} ${
                        errors.phone ? errCls : okCls
                      } hover:border-emerald-300`}
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-error"
                      required
                      pattern="(?:\+94|0)\d{9}"
                    />
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="mt-2 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div ref={refs.email}>
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
                      onBlur={handleBlur}
                      placeholder="Enter email address"
                      className={`${inputBase} ${
                        errors.email ? errCls : okCls
                      } hover:border-emerald-300`}
                      aria-invalid={!!errors.email}
                      aria-describedby="email-error"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6" ref={refs.address}>
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
                    onBlur={handleBlur}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={`${inputBase} pl-10 ${
                      errors.address ? errCls : okCls
                    } hover:border-emerald-300`}
                    aria-invalid={!!errors.address}
                    aria-describedby="address-error"
                    required
                  />
                </div>
                {errors.address && (
                  <p id="address-error" className="mt-2 text-sm text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Medical */}
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
                    placeholder="Provide relevant history, medications, allergies, etc."
                    rows={4}
                    className={`${inputBase} pl-10 border-green-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300`}
                  />
                </div>
                <p className="text-sm text-emerald-600 mt-2 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  This information helps our Ayurveda practitioners provide
                  personalized care. All data is confidential.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t-2 border-green-100">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
                  submitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-green-700 hover:via-emerald-700 hover:to-teal-700"
                }`}
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                {submitting ? "Submitting..." : "Submit Patient Information"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
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
