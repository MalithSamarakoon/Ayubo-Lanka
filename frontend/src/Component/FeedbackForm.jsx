// frontend/src/Component/FeedbackForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedback: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/feedback', formData);
      setSubmitStatus({ type: 'success', message: 'Thank you for your valuable feedback!' });
      setFormData({
        name: '',
        email: '',
        rating: 0,
        feedback: '',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rating labels based on score
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-800 mb-2">Share Your Experience</h2>
      <p className="text-green-600 mb-6">Your feedback helps us improve our products and services</p>
      
      {submitStatus && (
        <div className={`p-4 rounded-2xl mb-6 ${submitStatus.type === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'}`}
        >
          <div className="flex items-center">
            {submitStatus.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {submitStatus.message}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="Enter your email"
            />
          </div>
        </div>
        
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
                >
                  {star <= (hoverRating || formData.rating) ? (
                    <span className="text-yellow-400 drop-shadow-sm">★</span>
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
        </div>
        
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-green-700 mb-1">
            Your Feedback *
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            placeholder="Please share your experience with our products or services..."
          ></textarea>
        </div>
        
        <div className="flex items-start bg-green-50 p-4 rounded-2xl">
          <div className="flex items-center h-5">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleChange}
              className="focus:ring-green-500 h-4 w-4 text-green-600 border-green-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="consent" className="font-medium text-green-700">
              I agree to have my feedback shared anonymously for improvement purposes
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting || formData.rating === 0}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;