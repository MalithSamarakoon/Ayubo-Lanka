import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

export default function Onlinepayment() {
  const { state } = useLocation(); // patient + bookingId (+ maybe amount/orderId)
  const navigate = useNavigate();
  const { docId } = useParams();

  const [method, setMethod] = useState("card"); // card | wallet | bank
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.bookingId) {
      // Opened directly -> take back
      navigate(`/doctor/${docId}/book/patientdetails`);
    }
  }, [state, docId, navigate]);

  const handlePay = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your real gateway init (Stripe/PayHere/PayPal etc.)
      // For demo we just navigate to success.
      await new Promise((r) => setTimeout(r, 800));
      const order = {
        bookingId: state.bookingId,
        method: method.toUpperCase(),
        paid: true,
        paidAt: new Date().toISOString(),
        // include whatever you need:
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-green-100 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
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
                <label className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-sm cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    checked={method === "card"}
                    onChange={(e) => setMethod(e.target.value)}
                  />
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">Debit / Credit Card</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-sm cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="wallet"
                    checked={method === "wallet"}
                    onChange={(e) => setMethod(e.target.value)}
                  />
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">Mobile Wallet</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-xl hover:shadow-sm cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value="bank"
                    checked={method === "bank"}
                    onChange={(e) => setMethod(e.target.value)}
                  />
                  <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">Bank Transfer (Online)</span>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
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
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border font-semibold"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handlePay}
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg ${
                  loading
                    ? "bg-emerald-600/70 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-emerald-700">
            Need help? Contact support at{" "}
            <span className="font-medium">support@ayurcenter.lk</span>
          </p>
        </div>
      </div>
    </div>
  );
}
