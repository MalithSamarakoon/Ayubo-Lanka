// frontend/src/Component/TicketSystem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const TicketSystem = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "general",
    subject: "",
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setSelectedFiles(Array.from(e.target.files || []));

  const removeFile = (i) =>
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
      selectedFiles.forEach((f) => submitData.append("attachments", f));

      const { data } = await api.post("/api/tickets", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTicketNumber(data.ticketNumber);
      setSubmitStatus({
        type: "success",
        message: "Ticket created successfully!",
      });

      // Redirect to review page for this ticket
      navigate(`/tickets/review/${data.ticket._id}`);

      // (Optionally reset local state; not needed if you immediately navigate)
      setFormData({
        name: "",
        email: "",
        department: "general",
        subject: "",
        description: "",
      });
      setSelectedFiles([]);
      onSuccess?.();
    } catch (error) {
      console.error("API error:", error?.response?.data || error?.message);
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to create ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-2">
          Raise a Support Ticket
        </h2>
        <p className="text-green-600">
          Get dedicated help from our support team with a trackable ticket
        </p>
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
            <span className="mr-2">
              {submitStatus.type === "success" ? "✅" : "⚠️"}
            </span>
            <div>
              <p className="font-medium">{submitStatus.message}</p>
              {ticketNumber && (
                <p className="text-sm mt-1">
                  Your ticket number:{" "}
                  <span className="font-bold">{ticketNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl"
            >
              <option value="general">General Support</option>
              <option value="products">Product Inquiry</option>
              <option value="treatments">Treatments</option>
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Issues</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Subject *
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-green-200 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-green-200 rounded-2xl">
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
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="text-xs text-green-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-700 mb-2">
                Selected Files:
              </h4>
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-green-50 p-3 rounded-xl"
                  >
                    <span className="text-sm text-green-600 truncate">
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
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl"
        >
          {isSubmitting ? "Creating Ticket..." : "Raise Support Ticket"}
        </button>
      </form>
    </div>
  );
};

export default TicketSystem;
