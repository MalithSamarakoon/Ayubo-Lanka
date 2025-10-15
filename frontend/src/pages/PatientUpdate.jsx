import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Edit,
  X,
  Check,
  Loader,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";


const sriLankaPhone = /^(?:\+94|0)\d{9}$/;
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
  });
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

  
  useEffect(() => {
    if (!patient) {
      Swal.fire({
        title: "Error!",
        text: "No patient data found to update. Redirecting...",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/doctor/${docId}`);
      });
    }
  }, [patient, navigate, docId]);

 
  const validateField = (field, value) => {
    let msg = "";
    switch (field) {
      case "name":
        if (!value.trim()) msg = "Name is required.";
        else if (value.trim().length < 2)
          msg = "Name must be at least 2 characters.";
        else if (/\d/.test(value)) msg = "Name cannot contain numbers.";
        break;
      case "age":
        if (!value) msg = "Age is required.";
        else if (Number(value) < 1 || Number(value) > 120)
          msg = "Age must be between 1 and 120.";
        break;
      case "phone":
        if (!value.trim()) msg = "Phone is required.";
        else if (!sriLankaPhone.test(value.trim()))
          msg = "Use a valid Sri Lankan format (e.g., 0XXXXXXXXX).";
        break;
      case "email":
        if (!value.trim()) msg = "Email is required.";
        else if (!emailRegex.test(value.trim()))
          msg = "Please enter a valid email address.";
        break;
      case "address":
        if (!value.trim()) msg = "Address is required.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: msg }));
    return msg === "";
  };

  const validateAll = () => {
    const fields = ["name", "age", "phone", "email", "address"];
    const results = fields.map((f) => validateField(f, formData[f]));
    return results.every(Boolean);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextVal = name === "age" ? value.replace(/[^\d]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: nextVal }));
    if (touched[name]) {
      validateField(name, nextVal);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const scrollToFirstError = () => {
    const firstErrorField = Object.keys(errors).find(
      (key) => errors[key] && refs[key]
    );
    if (firstErrorField && refs[firstErrorField].current) {
      refs[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981", 
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, discard changes",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1); // Go back to the previous page
      }
    });
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
      scrollToFirstError();
      Swal.fire({
        title: "Incomplete Form",
        text: "Please correct the highlighted errors before updating.",
        icon: "warning",
        confirmButtonColor: "#10B981",
      });
      return;
    }

    setSubmitting(true);
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const res = await fetch(`${base}/api/patients/${patient._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedPatient = await res.json();
        await Swal.fire({
          title: "Updated!",
          text: "Patient details have been successfully updated.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/doctor/${docId}/book/patientdetails`, {
          state: updatedPatient,
          replace: true,
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update patient details."
        );
      }
    } catch (err) {
      Swal.fire({
        title: "Update Failed",
        text: err.message || "An unexpected error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444", // Red
      });
    } finally {
      setSubmitting(false);
    }
  };

  
  const inputBase =
    "w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-lg shadow-sm focus:ring-2 transition-all duration-200 placeholder-gray-400 text-gray-800";
  const invalidBorder =
    "border-red-300 focus:border-red-500 focus:ring-red-200";
  const validBorder =
    "border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200";

  if (!patient) return null; // Render nothing while redirecting

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header Section */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Edit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Update Patient Record
              </h1>
              <p className="text-sm text-gray-600">
                Modify patient information for the consultation.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-8 space-y-8">
            {/* Personal Info */}
            <div ref={refs.name}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's full name"
                  className={`${inputBase} ${
                    errors.name ? invalidBorder : validBorder
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div ref={refs.age}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter patient's age"
                    className={`${inputBase} ${
                      errors.age ? invalidBorder : validBorder
                    }`}
                  />
                </div>
                {errors.age && (
                  <p className="mt-2 text-sm text-red-600">{errors.age}</p>
                )}
              </div>
              <div ref={refs.phone}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0XXXXXXXXX"
                    className={`${inputBase} ${
                      errors.phone ? invalidBorder : validBorder
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div ref={refs.email}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's email"
                  className={`${inputBase} ${
                    errors.email ? invalidBorder : validBorder
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div ref={refs.address}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Home Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's complete address"
                  rows={3}
                  className={`${inputBase} resize-none pt-3 ${
                    errors.address ? invalidBorder : validBorder
                  }`}
                />
              </div>
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Medical Information{" "}
                <span className="font-normal text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <Heart className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  name="medicalInfo"
                  value={formData.medicalInfo}
                  onChange={handleChange}
                  placeholder="Allergies, past conditions, etc."
                  rows={4}
                  className={`${inputBase} resize-none pt-3 ${validBorder}`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  {" "}
                  <Loader className="w-5 h-5 mr-2 animate-spin" /> Saving...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Check className="w-5 h-5 mr-2" /> Update Record{" "}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="w-full flex items-center justify-center px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientUpdate;
