// frontend/src/Component/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const FeedbackForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedback: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (submitStatus) {
      const t = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(t);
    }
  }, [submitStatus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRatingChange = (rating) => setFormData(prev => ({ ...prev, rating }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/api/feedback', formData);
      setSubmitStatus({ type: 'success', message: data.message || 'Thank you for your valuable feedback!' });
      setFormData({ name: '', email: '', rating: 0, feedback: '', consent: false });
      onSuccess?.();
    } catch (error) {
      console.error('API error:', error?.response?.data || error?.message);
      setSubmitStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = { 1:'Poor', 2:'Fair', 3:'Good', 4:'Very Good', 5:'Excellent' };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-2">Share Your Experience</h2>
      <p className="text-green-600 mb-6">Your feedback helps us improve our products and services</p>

      {submitStatus && (
        <div className={`p-4 rounded-2xl mb-6 ${submitStatus.type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center">
            <span className="mr-2">{submitStatus.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Your Name (Optional)</label>
            <input name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Email Address (Optional)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl">
          <label className="block text-sm font-medium text-green-700 mb-3">How would you rate your experience? *</label>
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-3">
              {[1,2,3,4,5].map(star => (
                <button key={star} type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${star} - ${ratingLabels[star]}`}>
                  {star <= (hoverRating || formData.rating) ? <span className="text-yellow-400">★</span> : <span className="text-yellow-300">☆</span>}
                </button>
              ))}
            </div>
            {formData.rating > 0 && <p className="text-green-700 font-medium bg-green-100 px-4 py-1 rounded-full">{ratingLabels[formData.rating]}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Your Feedback *</label>
          <textarea name="feedback" value={formData.feedback} onChange={handleChange} required rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" />
        </div>

        <div className="flex items-start bg-green-50 p-4 rounded-2xl">
          <input id="consent" name="consent" type="checkbox" checked={formData.consent} onChange={handleChange}
            className="focus:ring-green-500 h-4 w-4 text-green-600 border-green-300 rounded" />
          <label htmlFor="consent" className="ml-3 text-sm font-medium text-green-700">
            I agree to have my feedback shared anonymously for improvement purposes
          </label>
        </div>

        <button type="submit" disabled={isSubmitting || formData.rating === 0}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl">
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
