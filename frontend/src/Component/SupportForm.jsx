// frontend/src/Component/SupportForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const SupportForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setSelectedFiles(Array.from(e.target.files || []));

  const removeFile = (idx) =>
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      selectedFiles.forEach((file) => fd.append("files", file));

      const { data } = await api.post("/api/support/inquiry", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus({
        type: "success",
        message: "Inquiry submitted successfully!",
      });
      // optional resets (you'll navigate right away)
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
      });
      setSelectedFiles([]);

      onSuccess?.("Inquiry submitted successfully! We will contact you shortly.");

      // 👉 redirect to review page
      navigate(`/support/review/${data.inquiry._id}`);
    } catch (error) {
      console.error("API error:", error?.response?.data || error?.message);
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to submit inquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-800 mb-6">
        Submit Your Inquiry
      </h2>

      {submitStatus && (
        <div
          className={`p-4 rounded-md mb-6 ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inquiry Type *
            </label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Inquiry Type</option>
              <option value="product">Product Inquiry</option>
              <option value="treatment">Treatment Information</option>
              <option value="appointment">Appointment Request</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Files (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Files:
              </h4>
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span className="text-sm text-gray-600 truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-green-700 text-white font-medium rounded-md hover:bg-green-800"
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default SupportForm;
