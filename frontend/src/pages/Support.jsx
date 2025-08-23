// frontend/src/pages/Support.jsx
import React, { useState } from 'react';
import SupportForm from '../Component/SupportForm';
import FeedbackForm from '../Component/FeedbackForm';
import TicketSystem from '../Component/TicketSystem';

const Support = () => {
  const [activeTab, setActiveTab] = useState('inquiry');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Animated Header */}
        <div className="text-center mb-12 relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-64 h-64 bg-green-100 rounded-full opacity-10 animate-pulse"></div>
          </div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center mb-4 animate-fade-in-down">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-green-800 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Support Center
              </h1>
            </div>
            <p className="text-lg text-green-600 max-w-2xl mx-auto mb-6">
              We're here to help you with any questions about our Ayurvedic products or treatments.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-1 flex border border-green-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-50"></div>
            
            {[
              { id: 'inquiry', label: 'Submit Inquiry', icon: '📩' },
              { id: 'ticket', label: 'Raise Ticket', icon: '🎫' },
              { id: 'feedback', label: 'Rate Experience', icon: '⭐' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`relative py-3 px-6 font-medium rounded-xl transition-all duration-300 flex items-center z-10 mx-1 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                    : 'text-green-700 hover:text-green-900 hover:bg-green-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="relative mb-16">
          <div className="absolute -inset-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-tr-full"></div>
            
            <div className="relative p-8">
              {activeTab === 'inquiry' && <SupportForm />}
              {activeTab === 'ticket' && <TicketSystem />}
              {activeTab === 'feedback' && <FeedbackForm />}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-bold text-green-800 text-xl mb-2">98%</h3>
            <p className="text-green-600">Customer Satisfaction</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="font-bold text-green-800 text-xl mb-2">2.5 hours</h3>
            <p className="text-green-600">Average Response Time</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-bold text-green-800 text-xl mb-2">24/7</h3>
            <p className="text-green-600">Support Availability</p>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-green-800 mb-12 relative">
            <span className="relative z-10 bg-white px-4">Other Ways to Reach Us</span>
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-green-100 z-0"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: "Call Us",
                details: ["+94 11 234 5678", "Mon-Fri: 8:00 AM - 6:00 PM"],
                color: "bg-green-500",
                action: "tel:+94112345678"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Email Us",
                details: ["support@ayurvediccenter.lk", "inquiry@ayurvediccenter.lk"],
                color: "bg-emerald-500",
                action: "mailto:support@ayurvediccenter.lk"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Visit Us",
                details: ["123 Ayurveda Road, Colombo", "Sri Lanka"],
                color: "bg-teal-500",
                action: "https://maps.google.com"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: "Live Chat",
                details: ["Available 24/7", "Click to start chat"],
                color: "bg-cyan-500",
                action: "#chat"
              }
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.action} 
                className="relative group block"
                target={item.action.includes('http') ? '_blank' : '_self'}
                rel={item.action.includes('http') ? 'noopener noreferrer' : ''}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-6 h-full flex flex-col items-center text-center shadow-md hover:shadow-xl transition duration-300 group-hover:-translate-y-1">
                  <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-sm text-green-600">{detail}</p>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden mb-16">
          <div className="absolute -right-16 -top-16 w-40 h-40 bg-green-100 rounded-full opacity-30"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-100 rounded-full opacity-30"></div>
          
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {[
              {
                question: "How long does shipping take?",
                answer: "Typically 3-5 business days within Sri Lanka. International shipping takes 7-14 business days depending on the destination."
              },
              {
                question: "Can I schedule a consultation online?",
                answer: "Yes, you can book appointments through our website. Our Ayurvedic doctors are available for both in-person and online consultations."
              },
              {
                question: "Are your products authentic Ayurveda?",
                answer: "All our products are certified authentic Ayurvedic formulations, made with traditional methods and natural ingredients."
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
              },
              {
                question: "How do I know which treatment is right for me?",
                answer: "We recommend scheduling a consultation with our Ayurvedic specialists who can assess your needs and recommend personalized treatments."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept credit cards, debit cards, bank transfers, and several popular digital payment platforms."
              },
              {
                question: "How can I track my ticket status?",
                answer: "Once you submit a ticket, you'll receive a tracking number. You can use this to check your ticket status on our website."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer refunds within 30 days of purchase for unopened products. For treatments, please refer to our cancellation policy."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-green-50 rounded-2xl p-5 transition-all duration-300 hover:bg-green-100 hover:shadow-sm">
                <h3 className="font-semibold text-green-800 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">?</span>
                  {faq.question}
                </h3>
                <p className="text-sm text-green-600 pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Support Status Banner */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white text-center mb-16">
          <h3 className="font-bold text-xl mb-2">System Status: All Systems Operational</h3>
          <p className="opacity-90">No ongoing incidents or maintenance. Our support team is ready to help you!</p>
        </div>
      </div>

      {/* Custom animations */}
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Support;