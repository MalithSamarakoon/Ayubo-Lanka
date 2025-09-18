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

  // ---------- Light Theme (neutral surfaces + emerald accents) ----------
  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 " +
    "border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200";
  const errCls = "border-red-400 focus:border-red-400 focus:ring-red-400";
  const okCls = "border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-5 bg-gradient-to-r from-green-500 to-emerald-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white drop-shadow">
                  Patient Registration Form
                </h1>
                <p className="text-white/90 text-sm font-medium">
                  Ayurveda Medical Center • Natural Healing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 text-emerald-500 mr-3" />
              Patient Information
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please fill out all required fields marked with *
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10" noValidate>
            {/* Personal */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div ref={refs.name}>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name <span className="text-red-600">*</span>
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
                      className={`${inputBase} ${errors.name ? errCls : okCls}`}
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

                {/* Age */}
                <div ref={refs.age}>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Age <span className="text-red-600">*</span>
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
                      className={`${inputBase} ${errors.age ? errCls : okCls}`}
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
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div ref={refs.phone}>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number <span className="text-red-600">*</span>
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
                      }`}
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

                {/* Email */}
                <div ref={refs.email}>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address <span className="text-red-600">*</span>
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
                      }`}
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

              {/* Address */}
              <div className="mt-6" ref={refs.address}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Address <span className="text-red-600">*</span>
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
                    }`}
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
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Medical Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Medical History / Current Conditions
                  <span className="text-emerald-700 font-medium ml-2">
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
                    className={`${inputBase} pl-10`}
                  />
                </div>
                <p className="text-sm text-emerald-700 mt-2 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  This information helps our Ayurveda practitioners provide
                  personalized care. All data is confidential.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 px-8 rounded-xl font-bold text-white shadow-sm transition-all duration-200
                bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white
                ${
                  submitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-md"
                }`}
              >
                <span className="inline-flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  {submitting ? "Submitting..." : "Submit Patient Information"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-700 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
            <strong className="text-gray-900">Ayurveda Medical Center</strong> ©
            2024 • Natural Healing &amp; Wellness • All patient information is
            confidential and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
