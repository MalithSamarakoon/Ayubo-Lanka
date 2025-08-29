import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SupportForm from '../Component/SupportForm';
import FeedbackForm from '../Component/FeedbackForm';
import TicketSystem from '../Component/TicketSystem';

const Support = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const Modal = ({ children, onClose }) => (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ✅ Hero Section */}
        <motion.div
          className="text-center mb-16 relative overflow-hidden"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <motion.div
              className="w-64 h-64 bg-green-100 rounded-full opacity-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />
          </div>
          <div className="relative">
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Support Center
              </h1>
            </motion.div>
            <p className="text-lg text-green-600 max-w-2xl mx-auto mb-6">
              We're here to assist you with inquiries, tickets, and feedback regarding our Ayurvedic products and treatments.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* ✅ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              id: 'inquiry',
              title: 'Submit Inquiry',
              icon: '📩',
              description: 'Have questions about our products or treatments? Send us a message.',
              color: 'from-green-400 to-emerald-500',
              buttonText: 'Ask Question',
            },
            {
              id: 'ticket',
              title: 'Raise Support Ticket',
              icon: '🎫',
              description: 'Need technical assistance or have an urgent issue? Create a support ticket.',
              color: 'from-blue-400 to-cyan-500',
              buttonText: 'Create Ticket',
            },
            {
              id: 'feedback',
              title: 'Rate Experience',
              icon: '⭐',
              description: 'Share your experience and help us improve our services.',
              color: 'from-amber-400 to-orange-500',
              buttonText: 'Share Feedback',
            },
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition duration-300 rounded-3xl blur"></div>
              <div className="relative bg-white rounded-3xl p-8 h-full text-center shadow-md hover:shadow-xl transition duration-300 group-hover:-translate-y-1 border border-green-100 flex flex-col">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white`}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-green-800 text-xl mb-4">
                  {item.title}
                </h3>
                <p className="text-green-600 text-sm mb-6 flex-grow">
                  {item.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-6 font-medium rounded-xl text-white bg-gradient-to-r ${item.color} hover:shadow-md transition-all`}
                  onClick={() => openModal(item.id)}
                >
                  {item.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Stats, Other Ways to Reach Us ... keep as-is */}

        {/* ✅ FAQ Section with Motion Accordion */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-lg p-10 mb-20"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How long does shipping take?",
                a: "Typically 3-5 business days within Sri Lanka. International shipping takes 7-14 business days depending on the destination."
              },
              {
                q: "Can I schedule a consultation online?",
                a: "Yes, you can book appointments through our website. Our Ayurvedic doctors are available for both in-person and online consultations."
              },
              {
                q: "Are your products authentic Ayurveda?",
                a: "All our products are certified authentic Ayurvedic formulations, made with traditional methods and natural ingredients."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition">
                <button
                  className="w-full flex justify-between items-center font-semibold text-green-800"
                  onClick={() => toggleFAQ(i)}
                >
                  {faq.q}
                  <motion.span
                    animate={{ rotate: openFAQ === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-green-600 mt-2 pl-2 overflow-hidden"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ✅ Modal Section */}
      <Modal onClose={closeModal}>
        {activeModal === 'inquiry' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Submit Your Inquiry
            </h2>
            <SupportForm onSuccess={closeModal} />
          </div>
        )}

        {activeModal === 'ticket' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Raise Support Ticket
            </h2>
            <TicketSystem onSuccess={closeModal} />
          </div>
        )}

        {activeModal === 'feedback' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Share Your Feedback
            </h2>
            <FeedbackForm onSuccess={closeModal} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Support;
