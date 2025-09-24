import React, { useState } from "react";
import api from "../lib/api";

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const initial = {
  name: "",
  email: "",
  department: "general",
  subject: "",
  description: "",
};

export default function TicketSystem({ onSuccess }) {
  const [formData, setFormData] = useState(initial);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);


  const v = {
    name: (v) => (!v.trim() ? "Name is required" : ""),
    email: (v) =>
      !v.trim()
        ? "Email is required"
        : !/^\S+@\S+\.\S+$/.test(v)
        ? "Enter a valid email"
        : "",
    department: (v) => (!v ? "Select a department" : ""),
    subject: (v) => (!v.trim() ? "Subject is required" : ""),
    description: (v) =>
      !v.trim()
        ? "Description is required"
        : v.trim().length < 5
        ? "Description is too short"
        : "",
    files: (arr) => {
      if (arr.length > MAX_FILES) return `Max ${MAX_FILES} files`;
      for (const f of arr) {
        if (!ALLOWED.includes(f.type)) return "Only JPG, PNG, PDF, DOC, DOCX";
        if (f.size > MAX_SIZE) return "Each file must be ≤ 10MB";
      }
      return "";
    },
  };

  const validateField = (name, value) => {
    const err = name === "files" ? v.files(value) : v[name](value);
    setErrors((p) => ({ ...p, [name]: err }));
    return err;
    };
  const validateAll = () => {
    const e = {
      name: v.name(formData.name),
      email: v.email(formData.email),
      department: v.department(formData.department),
      subject: v.subject(formData.subject),
      description: v.description(formData.description),
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
    setSubmitStatus(null);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("attachments", f));

      const { data } = await api.post("/api/tickets", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTicketNumber(data?.ticketNumber);
      setSubmitStatus({ type: "success", message: "Ticket created successfully!" });
      setFormData(initial);
      setFiles([]);
      setErrors({});
      onSuccess?.("Ticket created successfully!");
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to create ticket.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-2">Raise a Support Ticket</h2>
        <p className="text-green-600">Get dedicated help from our support team with a trackable ticket</p>
      </div>

      {submitStatus && (
        <div
          className={`p-4 rounded-2xl mb-6 ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">{submitStatus.type === "success" ? "✅" : "⚠️"}</span>
            <div>
              <p className="font-medium">{submitStatus.message}</p>
              {ticketNumber && (
                <p className="text-sm mt-1">
                  Your ticket number: <span className="font-bold">{ticketNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* name + email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* department */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 border border-green-200 rounded-2xl"
          >
            <option value="general">General Support</option>
            <option value="products">Product Inquiry</option>
            <option value="treatments">Treatments</option>
            <option value="billing">Billing & Payments</option>
            <option value="technical">Technical Issues</option>
          </select>
          {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department}</p>}
        </div>

        {/* subject */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Subject *</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 border border-green-200 rounded-2xl"
          />
          {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject}</p>}
        </div>

        {/* description */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl"
          />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* attachments */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Attachments (JPG, PNG, PDF, DOC, DOCX – up to 5 files, 10MB each)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-green-200 rounded-2xl">
            <div className="space-y-1 text-center">
              <label htmlFor="ticket-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600">
                <span>Upload files</span>
              </label>
              <input id="ticket-file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
              <p className="text-xs text-green-500">Max 10MB each</p>
            </div>
          </div>
          {errors.files && <p className="text-red-600 text-xs mt-1">{errors.files}</p>}

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                  <span className="text-sm text-green-600 truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl disabled:opacity-60"
        >
          {isSubmitting ? "Creating Ticket..." : "Raise Support Ticket"}
        </button>
      </form>
    </div>
  );
}
