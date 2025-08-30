import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Input from "../components/Input";
import { User, Mail, Phone, X } from "lucide-react";
import Loader from "../components/LoadingSpinner";

const API_BASE = "http://localhost:5000/api/user";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function UpdateUserModal({ id, open, onClose, onSaved }) {
  const [inputs, setInputs] = useState({ name: "", email: "", mobile: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const cardRef = useRef(null);

  useOnClickOutside(cardRef, onClose);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Fetch user data when opening / id changes
  useEffect(() => {
    if (!open || !id) return;
    const fetchUser = async () => {
      try {
        setIsFetching(true);
        const res = await axios.get(`${API_BASE}/${id}`);
        const u = res.data?.user || {};
        setInputs({
          name: u.name || "",
          email: u.email || "",
          mobile: u.mobile || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [open, id]);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await axios.patch(`${API_BASE}/${id}`, inputs);
      const updated = res.data?.user || { _id: id, ...inputs };
      onSaved?.(updated); // let parent update the row optimistically
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        key="modal"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div
          ref={cardRef}
          className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center shadow-lg mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 text-transparent bg-clip-text">
              Update Profile
            </h1>
            <p className="text-gray-500 mt-1">Edit personal information</p>
          </div>

          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                icon={User}
                type="text"
                name="name"
                placeholder="Full Name"
                value={inputs.name}
                onChange={handleChange}
              />
              <Input
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email"
                value={inputs.email}
                onChange={handleChange}
              />
              <Input
                icon={Phone}
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={inputs.mobile}
                onChange={handleChange}
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isLoading ? <Loader size={24} /> : "Update Profile"}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
