import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const initial = {
  name: "",
  email: "",
  rating: 0,
  feedback: "",
  consent: false,
};

export default function FeedbackForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initial);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (submitStatus) {
      const t = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(t);
    }
  }, [submitStatus]);

  const v = {
    name: () => "",
    email: (v) => (v && !/^\S+@\S+\.\S+$/.test(v) ? "Enter a valid email" : ""),
    rating: (n) => (!n || n < 1 || n > 5 ? "Please select a rating" : ""),
    feedback: (t) =>
      !t.trim() ? "Feedback is required" : t.trim().length < 10 ? "Please add a bit more detail" : "",
    consent: (c) => (c ? "" : "Please confirm consent to submit"),
  };

  const validateAll = () => {
    const e = {
      email: v.email(formData.email),
      rating: v.rating(formData.rating),
      feedback: v.feedback(formData.feedback),
      consent: v.consent(formData.consent),
    };
    setErrors(e);
    return Object.values(e).every((x) => !x);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleRatingChange = (rating) => setFormData((p) => ({ ...p, rating }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/api/feedback", formData);
      // 🚀 go to review page immediately
      navigate(`/feedback/review/${data.feedback._id}`);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to submit feedback.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-2">Share Your Experience</h2>
      <p className="text-green-600 mb-6">Your feedback helps us improve our products and services</p>

      {submitStatus && (
        <div
          className={`p-4 rounded-2xl mb-6 ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{submitStatus.type === "success" ? "✅" : "⚠️"}</span>
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* name / email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Your Name (Optional)</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Email Address (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* rating */}
        <div className="bg-green-50 p-6 rounded-2xl">
          <label className="block text-sm font-medium text-green-700 mb-3">
            How would you rate your experience? *
          </label>
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl focus:outline-none transition-transform duration-200 hover:scale-110"
                  aria-label={`Rate ${star} - ${ratingLabels[star]}`}
                >
                  {star <= (hoverRating || formData.rating) ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-yellow-300">☆</span>
                  )}
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-green-700 font-medium bg-green-100 px-4 py-1 rounded-full">
                {ratingLabels[formData.rating]}
              </p>
            )}
          </div>
          {errors.rating && (
            <p className="text-red-600 text-xs mt-2 text-center">{errors.rating}</p>
          )}
        </div>

        {/* feedback text */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Your Feedback *</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          />
          {errors.feedback && <p className="text-red-600 text-xs mt-1">{errors.feedback}</p>}
        </div>

        {/* consent */}
        <div className="flex items-start bg-green-50 p-4 rounded-2xl">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            className="focus:ring-green-500 h-4 w-4 text-green-600 border-green-300 rounded"
          />
          <label htmlFor="consent" className="ml-3 text-sm font-medium text-green-700">
            I agree to have my feedback shared anonymously for improvement purposes
          </label>
        </div>
        {errors.consent && <p className="text-red-600 text-xs -mt-4 mb-2">{errors.consent}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
