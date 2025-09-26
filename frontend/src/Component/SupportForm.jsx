import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/png", "image/jpeg", "application/pdf"];

const initial = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  subject: "",
  message: "",
};
<input
  id="support-file-upload"
  type="file"
  multiple
  className="sr-only"
  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
  onChange={(e) => {
    try {
      const next = Array.from(e.target.files || []);
      setFiles(next);
      validateField("files", next);
    } catch (err) {
      console.error("support file select error:", err);
    }
  }}
/>


export default function SupportForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initial);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const v = {
    name: (v) => (!v.trim() ? "Name is required" : v.trim().length < 2 ? "Name is too short" : ""),
    email: (v) =>
      !v.trim()
        ? "Email is required"
        : !/^\S+@\S+\.\S+$/.test(v)
        ? "Enter a valid email"
        : "",
    phone: (v) => (v && !/^[0-9+\-\s()]{7,20}$/.test(v) ? "Enter a valid phone" : ""),
    inquiryType: (v) => (!v ? "Select an inquiry type" : ""),
    subject: (v) => (!v.trim() ? "Subject is required" : ""),
    message: (v) => (!v.trim() ? "Message is required" : v.trim().length < 5 ? "Message is too short" : ""),
    files: (arr) => {
      if (arr.length > MAX_FILES) return `Max ${MAX_FILES} files`;
      for (const f of arr) {
        if (!ALLOWED.includes(f.type)) return "Only PNG, JPG, PDF";
        if (f.size > MAX_SIZE) return "Each file must be ≤ 5MB";
      }
      return "";
    },
  };

  const validateField = (name, value) => {
    const err = name === "files" ? v.files(value) : v[name] ? v[name](value) : "";
    setErrors((p) => ({ ...p, [name]: err }));
    return err;
  };

  const validateAll = () => {
    const e = {
      name: v.name(formData.name),
      email: v.email(formData.email),
      phone: v.phone(formData.phone),
      inquiryType: v.inquiryType(formData.inquiryType),
      subject: v.subject(formData.subject),
      message: v.message(formData.message),
      files: v.files(files),
    };
    setErrors(e);
    return Object.values(e).every((x) => !x);
  };

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleBlur = (e) => validateField(e.target.name, formData[e.target.name]);

  const handleFileChange = (e) => {
    const next = Array.from(e.target.files || []);
    setFiles(next);
    validateField("files", next);
  };

  const removeFile = (i) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    validateField("files", next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("files", f));

      const { data } = await api.post("/api/support/inquiry", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🚀 go to review page immediately
      navigate(`/support/review/${data.inquiry._id}`);
    } catch (error) {
      setErrors((p) => ({
        ...p,
        form: error?.response?.data?.message || "Failed to submit inquiry.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-800 mb-6">Submit Your Inquiry</h2>

      {errors.form && (
        <div className="p-4 rounded-md mb-6 bg-red-100 text-red-800">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type *</label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Inquiry Type</option>
              <option value="product">Product Inquiry</option>
              <option value="treatment">Treatment Information</option>
              <option value="appointment">Appointment Request</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
            {errors.inquiryType && (
              <p className="text-red-600 text-xs mt-1">{errors.inquiryType}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
        </div>

        {/* Files */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Files (PNG, JPG, PDF – up to 5 files, 5MB each)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <label htmlFor="support-file-upload" className="cursor-pointer text-green-700 font-medium">
                Upload files
              </label>
              <input id="support-file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            </div>
          </div>
          {errors.files && <p className="text-red-600 text-xs mt-1">{errors.files}</p>}

          {files.length > 0 && (
            <ul className="mt-3 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="text-sm flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="truncate">{f.name}</span>
                  <button type="button" className="text-red-600" onClick={() => removeFile(i)}>
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
