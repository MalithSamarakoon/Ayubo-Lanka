import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Smartphone,
  CircleDollarSign,
  ShieldCheck,
  FileUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Onlinepayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { docId } = useParams();

  const [method, setMethod] = useState("slip");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.bookingId) {
      navigate(`/doctor/${docId}/book/patientdetails`);
    }
  }, [state, docId, navigate]);

  const handlePay = async () => {
    try {
      setLoading(true);

      // If user chose bank slip → go to UploadSlip route
      if (method === "slip") {
        navigate(`/doctor/${docId}/book/patientdetails/slip`, {
          state: {
            bookingId: state.bookingId,
            amount: state.amount,
            name: state.name,
            phone: state.phone,
            email: state.email,
          },
        });
        return;
      }

      // Otherwise (wallet/bank) — your existing simulated payment flow
      await new Promise((r) => setTimeout(r, 800));
      const order = {
        bookingId: state.bookingId,
        method: method.toUpperCase(),
        paid: true,
        paidAt: new Date().toISOString(),
        name: state.name,
        phone: state.phone,
        email: state.email,
      };
      navigate(`/doctor/${docId}/book/success`, { state: { order } });
    } catch (e) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!state?.bookingId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white shadow-xl rounded-2xl border border-green-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
            <h1 className="text-2xl font-bold text-white">Online Payment</h1>
            <p className="text-green-100 text-sm mt-1">
              Booking ID:{" "}
              <span className="font-mono font-semibold text-yellow-200">
                {state.bookingId}
              </span>
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Methods */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Select a payment method
              </h2>
              <div className="space-y-3">
                {[
                  { value: "slip", label: "Upload Bank Slip", icon: FileUp },
                  { value: "wallet", label: "Mobile Wallet", icon: Smartphone },
                  {
                    value: "bank",
                    label: "Bank Transfer (Online)",
                    icon: CircleDollarSign,
                  },
                ].map((opt) => (
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${
                      method === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={opt.value}
                      checked={method === opt.value}
                      onChange={(e) => setMethod(e.target.value)}
                    />
                    <opt.icon className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{opt.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl"
            >
              <p className="text-sm text-emerald-800">
                You’re paying for the appointment of{" "}
                <strong>{state.name}</strong>.
              </p>
              {state?.amount && (
                <p className="text-sm text-emerald-800 mt-1">
                  Amount:{" "}
                  <strong>Rs. {Number(state.amount).toLocaleString()}</strong>
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm">
                  Your payment is encrypted and secure.
                </span>
              </div>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border font-semibold text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePay}
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-colors ${
                  loading
                    ? "bg-emerald-600/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {loading ? "Processing..." : "Pay Now"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-emerald-700">
            Need help? Contact support at{" "}
            <span className="font-medium">support@ayurcenter.lk</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
