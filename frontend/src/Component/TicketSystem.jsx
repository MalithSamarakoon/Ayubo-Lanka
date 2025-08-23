// frontend/src/Component/TicketSystem.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TicketSystem = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    priority: 'medium',
    department: 'general',
    subject: '',
    description: '',
    attachments: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const generateTicketNumber = () => {
    return 'TKT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData to handle file uploads
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'attachments') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append files
      selectedFiles.forEach(file => {
        submitData.append('attachments', file);
      });
      
      // Generate ticket number
      const newTicketNumber = generateTicketNumber();
      submitData.append('ticketNumber', newTicketNumber);
      
      const response = await axios.post('/api/support/ticket', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTicketNumber(newTicketNumber);
      setSubmitStatus({ type: 'success', message: 'Ticket created successfully!' });
      setFormData({
        name: '',
        email: '',
        priority: 'medium',
        department: 'general',
        subject: '',
        description: '',
        attachments: []
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error creating ticket:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to create ticket. Please try again.' });
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
        <div className={`p-4 rounded-2xl mb-6 ${submitStatus.type === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'}`}
        >
          <div className="flex items-center">
            {submitStatus.type === 'success' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">{submitStatus.message}</p>
                  {ticketNumber && (
                    <p className="text-sm mt-1">Your ticket number: <span className="font-bold">{ticketNumber}</span></p>
                  )}
                </div>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {submitStatus.message}
              </>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="Your email address"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-green-700 mb-1">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-green-700 mb-1">
              Department *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
          <label htmlFor="subject" className="block text-sm font-medium text-green-700 mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            placeholder="Brief description of your issue"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-green-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            placeholder="Please describe your issue in detail..."
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-green-200 rounded-2xl hover:border-green-300 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-green-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                  <span>Upload files</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="sr-only" 
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-green-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-700 mb-2">Selected Files:</h4>
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-green-600 truncate">{file.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Ticket...
              </div>
            ) : (
              'Raise Support Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketSystem;