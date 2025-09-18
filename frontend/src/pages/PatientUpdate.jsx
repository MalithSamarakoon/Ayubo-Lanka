import React, { useRef, useState } from "react";
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
import { motion } from "framer-motion";

const sriLankaPhone = /^(?:\+94|0)\d{9}$/; // +94XXXXXXXXX or 0XXXXXXXXX
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const refs = {
    name: useRef(null),
    age: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    address: useRef(null),
    medicalInfo: useRef(null),
  };

  const setFieldError = (field, message) =>
    setErrors((prev) => ({ ...prev, [field]: message }));

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
        if (value.trim() && !emailRegex.test(value.trim()))
          msg = "Please enter a valid email.";
        break;
      default:
        break;
    }
    setFieldError(field, msg);
    return msg === "";
  };

  const validateAll = () => {
    const fields = ["name", "age", "phone", "email"];
    const results = fields.map((f) => validateField(f, formData[f]));
    return results.every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextVal = name === "age" ? value.replace(/[^\d]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: nextVal }));
    if (touched[name]) validateField(name, nextVal);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
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
      refs[first[0]].current.focus?.();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, age: true, phone: true, email: true });
    if (!validateAll()) {
      setTimeout(scrollToFirstError, 0);
      return;
    }
    navigate(`/doctor/${docId}/book/patientdetails`, { state: formData });
  };

  const handleCancel = () => navigate(-1);

  // Inputs
  const inputBase =
    "w-full pl-10 pr-4 py-4 bg-white border rounded-xl shadow-sm focus:ring-2 transition-all duration-200 placeholder-gray-400";
  const invalidBorder =
    "border-rose-300 focus:border-rose-500 focus:ring-rose-200";
  const validBorder =
    "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200";
  const validBorderGreen =
    "border-green-200 focus:border-green-500 focus:ring-green-200";
  const validBorderTeal =
    "border-teal-200 focus:border-teal-500 focus:ring-teal-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl w-full bg-black/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-green-400 to-emerald-500">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Update Patient Record
                </h1>
                <p className="text-white/90 text-sm font-medium">
                  Modify patient information for Ayurveda consultation
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/30">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm" />
              <span className="text-sm font-semibold text-white/90">
                Ayurveda System Active
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="bg-white">
          <div className="px-6 md:px-8 py-10 space-y-10">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>

              {/* Name */}
              <div className="mb-3" ref={refs.name}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter patient's full name"
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                    className={`${inputBase} ${
                      errors.name ? invalidBorder : validBorder
                    } text-gray-900 hover:border-emerald-300`}
                    required
                    minLength={2}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Age + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div ref={refs.age}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                      onBlur={handleBlur}
                      placeholder="Enter patient's age"
                      aria-invalid={!!errors.age}
                      aria-describedby="age-error"
                      className={`${inputBase} ${
                        errors.age ? invalidBorder : validBorderGreen
                      } text-gray-900 hover:border-green-300 pl-10`}
                      required
                      min={0}
                      max={120}
                      step={1}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.age && (
                    <p id="age-error" className="mt-2 text-sm text-rose-600">
                      {errors.age}
                    </p>
                  )}
                </div>

                <div ref={refs.phone}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0XXXXXXXXX or +94XXXXXXXXX"
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-error"
                      className={`${inputBase} ${
                        errors.phone ? invalidBorder : validBorderTeal
                      } text-gray-900 hover:border-teal-300`}
                      required
                      pattern="(?:\+94|0)\d{9}"
                    />
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="mt-2 text-sm text-rose-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </h3>

              {/* Email */}
              <div className="mb-3" ref={refs.email}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter patient's email address"
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                    className={`${inputBase} ${
                      errors.email ? invalidBorder : validBorderGreen
                    } text-gray-900 hover:border-green-300`}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div ref={refs.address}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Home Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-5 h-5 text-teal-500" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter patient's complete address"
                    rows={3}
                    className={`w-full pl-10 pr-4 py-4 bg-white border rounded-xl shadow-sm focus:ring-2 transition-all duration-200 placeholder-gray-400 resize-none ${validBorderTeal} text-gray-900 hover:border-teal-300`}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl mr-4 flex items-center justify-center shadow-md">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Medical Information for Ayurveda Treatment
              </h3>

              <div ref={refs.medicalInfo}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Medical History & Ayurveda Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 w-5 h-5 text-teal-500" />
                  <textarea
                    name="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter medical history, allergies, current medications, Ayurvedic constitution (Prakriti), etc."
                    rows={6}
                    className={`w-full pl-10 pr-4 py-4 bg-white border rounded-xl shadow-sm resize-none focus:ring-2 transition-all duration-200 placeholder-gray-400 hover:border-teal-300 ${validBorderTeal} text-gray-900`}
                  />
                </div>
                <div className="mt-4 flex items-center text-sm text-teal-700 bg-teal-100 p-4 rounded-xl border border-teal-200">
                  <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    Confidential medical information for Ayurveda practitioners
                    — ensure accuracy for personalized natural healing
                    treatments.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-3 group"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Cancel Changes</span>
              </button>

              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Save Patient Record</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer note */}
        <div className="px-6 md:px-8 py-4 bg-white/70 backdrop-blur-sm border-t border-emerald-100">
          <p className="text-center text-emerald-800 font-medium">
            <strong>Ayurveda Medical Center</strong> • All patient information
            is encrypted and secured for natural healing consultations
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientUpdate;
