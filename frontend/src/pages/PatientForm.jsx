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
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../Component/Fotter";

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

  // Modern input styling
  const inputBase =
    "w-full pl-12 pr-4 py-4 rounded-xl border bg-white text-gray-900 placeholder-gray-500 " +
    "border-gray-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 shadow-sm";
  const errCls = "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30";
  const okCls = "border-gray-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full mx-auto bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Top header (inside the glass card) */}
        <div className="px-8 py-6 bg-gradient-to-r from-green-400 to-emerald-500">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Patient Registration
              </h1>
              <p className="text-white/90 text-sm font-medium mt-1">
                Ayurveda Medical Center • Natural Healing
              </p>
            </div>
          </div>
        </div>

        {/* White body with the form */}
        <div className="bg-white">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              Patient Information
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please fill out all required fields marked with *
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12" noValidate>
            {/* Personal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div ref={refs.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
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
                    <p
                      id="name-error"
                      className="mt-2 text-sm text-rose-600 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div ref={refs.age}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
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
                    <p
                      id="age-error"
                      className="mt-2 text-sm text-rose-600 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div ref={refs.phone}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
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
                    <p
                      id="phone-error"
                      className="mt-2 text-sm text-rose-600 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div ref={refs.email}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
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
                    <p
                      id="email-error"
                      className="mt-2 text-sm text-rose-600 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-6" ref={refs.address}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={`${inputBase} pl-12 ${
                      errors.address ? errCls : okCls
                    }`}
                    aria-invalid={!!errors.address}
                    aria-describedby="address-error"
                    required
                  />
                </div>
                {errors.address && (
                  <p
                    id="address-error"
                    className="mt-2 text-sm text-rose-600 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Medical */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                Medical Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History / Current Conditions
                  <span className="text-emerald-600 font-medium ml-2">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    name="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    placeholder="Provide relevant history, medications, allergies, etc."
                    rows={4}
                    className={`${inputBase} pl-12`}
                  />
                </div>
                <p className="text-sm text-gray-700 mt-3 bg-emerald-50/70 p-3 rounded-lg border border-emerald-100">
                  This information helps our Ayurveda practitioners provide
                  personalized care. All data is confidential.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-white shadow-md transition-all duration-300
                bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white
                ${
                  submitting
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                <span className="inline-flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {submitting ? "Submitting..." : "Submit Patient Information"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Footer outside the animated card */}
      <div className="mt-10 max-w-3xl mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PatientForm;
