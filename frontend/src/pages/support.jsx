// frontend/src/pages/Support.jsx
import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SupportForm from "../Component/SupportForm";
import FeedbackForm from "../Component/FeedbackForm";
import TicketSystem from "../Component/TicketSystem";
import axiosInstance from "../lib/axios";

const TOAST_POSITION = "top-left";

const positionClasses = (pos) => {
  switch (pos) {
    case "top-left": return "top-4 left-4";
    case "top-right": return "top-4 right-4";
    case "top-center": return "top-4 left-1/2 -translate-x-1/2";
    case "bottom-left": return "bottom-6 left-4";
    case "bottom-right": return "bottom-6 right-4";
    case "bottom-center": return "bottom-6 left-1/2 -translate-x-1/2";
    case "middle-left": return "top-1/2 -translate-y-1/2 left-4";
    case "middle-right": return "top-1/2 -translate-y-1/2 right-4";
    case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    default: return "top-4 left-1/2 -translate-x-1/2";
  }
};

export default function Support() {
  // 'inquiry' | 'ticket' | 'feedback' | null
  const [activeModal, setActiveModal] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [toast, setToast] = useState(null); // { type, message }
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);

  
  const loadApproved = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/feedback/approved");
      if (Array.isArray(data) && data.length > 0) {
        setApprovedFeedbacks(data);
        return;
      }
      
      const all = await axiosInstance.get("/feedback");
      const list = (all.data || []).filter((f) => f.isApproved || f.approved || f.consent);
      setApprovedFeedbacks(list);
    } catch (e) {
      console.error("Failed to load approved feedbacks", e);
    }
  }, []);

  
  useEffect(() => {
    loadApproved();                       
    const onFocus = () => loadApproved(); 
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadApproved]);

  const openModal = (m) => setActiveModal(m);
  const closeModal = () => setActiveModal(null);
  const toggleFAQ = (i) => setOpenFAQ(openFAQ === i ? null : i);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: TOAST_POSITION.includes("bottom") ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: TOAST_POSITION.includes("bottom") ? 10 : -10 }}
            className={`fixed ${positionClasses(TOAST_POSITION)} z-[60] rounded-xl px-4 py-3 shadow-lg border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{toast.type === "success" ? "✅" : "⚠️"}</span>
              <p className="font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Support Center
              </h1>
            </motion.div>
            <p className="text-lg text-green-600 max-w-2xl mx-auto mb-6">
              We're here to assist you with inquiries, tickets, and feedback regarding our Ayurvedic products and treatments.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full" />
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              id: "inquiry",
              title: "Submit Inquiry",
              icon: "📩",
              description: "Have questions about our products or treatments? Send us a message.",
              color: "from-green-400 to-emerald-500",
              buttonText: "Ask Question",
            },
            {
              id: "ticket",
              title: "Raise Support Ticket",
              icon: "🎫",
              description: "Need technical assistance or have an urgent issue? Create a support ticket.",
              color: "from-blue-400 to-cyan-500",
              buttonText: "Create Ticket",
            },
            {
              id: "feedback",
              title: "Rate Experience",
              icon: "⭐",
              description: "Share your experience and help us improve our services.",
              color: "from-amber-400 to-orange-500",
              buttonText: "Share Feedback",
            },
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition duration-300 rounded-3xl blur" />
              <div className="relative bg-white rounded-3xl p-8 h-full text-center shadow-md hover:shadow-xl transition duration-300 group-hover:-translate-y-1 border border-green-100 flex flex-col">
                <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-white`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-green-800 text-xl mb-4">{item.title}</h3>
                <p className="text-green-600 text-sm mb-6 flex-grow">{item.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-6 font-medium rounded-xl text-white bg-gradient-to-r ${item.color} hover:shadow-md transition-all`}
                  onClick={() => setActiveModal(item.id)}
                >
                  {item.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approved feedbacks section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-green-800 mb-3">What our patients say</h3>
          {approvedFeedbacks.length === 0 ? (
            <div className="text-gray-500">No feedbacks yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {approvedFeedbacks.map((f) => {
                const rating = Math.max(0, Math.min(5, Number(f.rating) || 0));
                return (
                  <div key={f._id} className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2">
                      <b>{f.name || "Anonymous"}</b>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                        {"★".repeat(rating) + "☆".repeat(5 - rating)}
                      </span>
                    </div>
                    <p className="mt-2 text-green-800">{f.feedback}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Chatbot guidance */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mt-12"
        >
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">Need quick help? Try our AI Chatbot</h3>
          <p className="text-emerald-700 mb-4">
            You can ask questions about appointments or products using the AI chatbot. Click the chat icon at the bottom-right corner of the page to start.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-emerald-900 font-medium mb-2">Sample questions (English)</div>
              <ul className="list-disc ml-5 text-emerald-800 text-sm space-y-1">
                <li>How do I book an appointment?</li>
                <li>What is the price of [Product Name]?</li>
                <li>Which product helps with [symptom]?</li>
                <li>Do you deliver within Sri Lanka?</li>
                <li>How can I contact support?</li>
              </ul>
            </div>
            <div>
              <div className="text-emerald-900 font-medium mb-2">උදාහරණ ප්‍රශ්න (සිංහල)</div>
              <ul className="list-disc ml-5 text-emerald-800 text-sm space-y-1">
                <li>මම appointment එකක් بک කරන්න කොහොම ද?</li>
                <li>[නිෂ්පාදනයේ නාමය] මිල කීයද?</li>
                <li>[ලක්ෂණය] සඳහා සුදුසු නිෂ්පාදන මොනවද?</li>
                <li>ශ්‍රී ලංකාව තුළ බෙදාහරිම තියෙනවද?</li>
                <li>Support එකට සම්බන්ධ වන්නේ කොහොමද?</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-lg p-10 mt-16 mb-20"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How long does shipping take?", a: "Typically 3-5 business days within Sri Lanka. International shipping takes 7-14 business days depending on the destination." },
              { q: "Can I schedule a consultation online?", a: "Yes, you can book appointments through our website. Our Ayurvedic doctors are available for both in-person and online consultations." },
              { q: "Are your products authentic Ayurveda?", a: "All our products are certified authentic Ayurvedic formulations, made with traditional methods and natural ingredients." },
            ].map((faq, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition">
                <button className="w-full flex justify-between items-center font-semibold text-green-800" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  {faq.q}
                  <motion.span animate={{ rotate: openFAQ === i ? 180 : 0 }} transition={{ duration: 0.3 }}>▼</motion.span>
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
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

  
      <ModalShell open={Boolean(activeModal)} onClose={() => setActiveModal(null)}>
        {activeModal === "inquiry" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Submit Your Inquiry</h2>
            <SupportForm
              onSuccess={(msg) => {
                showToast(msg || "Inquiry submitted successfully!");
                setActiveModal(null);
              }}
            />
          </div>
        )}
        {activeModal === "ticket" && (
          <div className="p-6">
            <TicketSystem
              onSuccess={(msg) => {
                showToast(msg || "Ticket created successfully!");
                setActiveModal(null);
              }}
            />
          </div>
        )}
        {activeModal === "feedback" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Share Your Feedback</h2>
            <FeedbackForm
              onSuccess={(msg) => {
                showToast(msg || "Thank you! Your feedback was submitted.");
                loadApproved(); 
                setActiveModal(null);
              }}
            />
          </div>
        )}
      </ModalShell>
    </div>
  );
}


const ModalShell = memo(function ModalShell({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-2xl w-[90%] shadow-xl border p-2">
        <button className="absolute right-3 top-3 text-gray-500" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
});
