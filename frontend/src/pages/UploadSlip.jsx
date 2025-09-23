// frontend/src/pages/UploadSlip.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ReceiptUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  // derive appointment identifiers from router state/params/query
  const stateApptId = location.state?.appointmentId; // Patient._id
  const stateApptNo = location.state?.appointmentNo; // Patient.id (numeric)
  const queryApptId = searchParams.get("appointmentId");
  const queryApptNo = searchParams.get("appointmentNo");
  const paramApptId = params.appointmentId;

  const appointmentId = stateApptId || queryApptId || paramApptId;
  const appointmentNo = stateApptNo || queryApptNo || undefined;

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [easterEgg, setEasterEgg] = useState(false);
  const [form, setForm] = useState({
    bank: "",
    branch: "",
    paymentDate: "",
    amount: "",
    paymentMethod: "",
    notes: "",
    consent: false,
  });

  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  const maxSize = 5 * 1024 * 1024;

  // Konami code
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  const konamiSeqRef = useRef([]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      konamiSeqRef.current = [...konamiSeqRef.current, e.code].slice(-10);
      if (konamiSeqRef.current.join(",") === konamiCode.join(",")) {
        setEasterEgg(true);
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  }

  function validateForm() {
    const newErrors = {};
    if (!user?._id) newErrors.patientId = "Not logged in. Please log in again.";
    if (!appointmentId && !appointmentNo)
      newErrors.appointmentId =
        "Missing booking. Open payment from the appointment page.";
    if (!form.bank) newErrors.bank = "Bank selection is required";
    if (!form.paymentDate) newErrors.paymentDate = "Payment date is required";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!form.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    if (!file) newErrors.file = "Receipt file is required (JPG/PNG/PDF)";
    if (form.paymentDate) {
      const selectedDate = new Date(form.paymentDate);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      if (selectedDate > today)
        newErrors.paymentDate = "Payment date cannot be in the future";
      else if (selectedDate < oneYearAgo)
        newErrors.paymentDate = "Payment date cannot be more than 1 year ago";
    }
    if (!form.consent) newErrors.consent = "You must confirm the details";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const next = { ...errors };
    delete next.file;

    if (!allowed.includes(f.type)) {
      next.file = "Only JPG, PNG or PDF files are allowed";
      setErrors(next);
      return;
    }
    if (f.size > maxSize) {
      next.file = "File size must be 5MB or less";
      setErrors(next);
      return;
    }

    setErrors(next);
    setFile(f);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl("");
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("patientId", user?._id);
      if (appointmentId) fd.append("appointmentId", appointmentId);
      if (!appointmentId && appointmentNo)
        fd.append("appointmentNo", String(appointmentNo));
      fd.append("bank", form.bank);
      fd.append("branch", form.branch);
      fd.append("paymentDate", form.paymentDate);
      fd.append("amount", form.amount);
      fd.append("paymentMethod", form.paymentMethod);
      fd.append("notes", form.notes || "");
      fd.append("file", file);

      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const { data } = await axios.post(`${base}/api/receipts`, fd, {
        withCredentials: true,
      });

      navigate("/home", {
        replace: true,
        state: { receiptId: data?.id, appointmentId: data?.appointmentId },
      });
      setForm({
        bank: "",
        branch: "",
        paymentDate: "",
        amount: "",
        paymentMethod: "",
        notes: "",
        consent: false,
      });
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setErrors({});
    } catch (err) {
      alert(err?.response?.data?.message || "❌ Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 flex items-center justify-center p-4 relative">
      {easterEgg && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-pulse text-6xl">🎉</div>
       
          <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-20 animate-pulse"></div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-4xl"
      >
        <motion.form
          onSubmit={onSubmit}
          whileHover={{ scale: 1.005 }}
          className="w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 space-y-6 border border-white/20"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Bank Receipt Upload
            </h1>
            <p className="text-emerald-800/80">
              Upload your bank slip securely (JPG/PNG/PDF, max 5MB)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              label="Bank *"
              value={form.bank}
              onChange={(e) => update("bank", e.target.value)}
              error={errors.bank}
              options={[
                "BOC",
                "People's Bank",
                "Commercial Bank",
                "Sampath",
                "HNB",
                "Other",
              ]}
            />
            <Input
              label="Branch"
              value={form.branch}
              onChange={(e) => update("branch", e.target.value)}
              placeholder="e.g. Colombo, Kandy"
            />
            <Input
              type="date"
              label="Payment Date *"
              value={form.paymentDate}
              onChange={(e) => update("paymentDate", e.target.value)}
              error={errors.paymentDate}
            />
            <Input
              type="number"
              step="0.01"
              label="Amount (LKR) *"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              error={errors.amount}
              placeholder="0.00"
            />
            <Select
              label="Payment Method *"
              value={form.paymentMethod}
              onChange={(e) => update("paymentMethod", e.target.value)}
              error={errors.paymentMethod}
              options={["Online transfer", "Cash deposit", "ATM", "CDM"]}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-emerald-900">
              Receipt File *{" "}
              <span className="text-emerald-700/70 font-normal">
                (JPG/PNG/PDF, max 5MB)
              </span>
            </label>

            <div className="relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={onFileChange}
                className="hidden"
                id="file-upload"
              />
              <motion.label
                htmlFor="file-upload"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                className={`block w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  errors.file
                    ? "border-red-300 bg-red-50"
                    : file
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50"
                }`}
              >
                <div className="space-y-2">
                  <div className="text-3xl">{file ? "✅" : "📎"}</div>
                  <div className="text-sm font-medium text-emerald-900/80">
                    {file
                      ? `Selected: ${file.name}`
                      : "Click to upload receipt"}
                  </div>
                </div>
              </motion.label>
            </div>
            {errors.file && (
              <p className="text-red-600 text-sm">{errors.file}</p>
            )}

            {previewUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="max-h-64 mx-auto rounded-lg border-2 border-emerald-200 shadow-md"
                />
              </motion.div>
            )}
            {file && !previewUrl && file.type === "application/pdf" && (
              <p className="text-xs text-emerald-800/80">
                📄 PDF selected. Preview not shown here.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-emerald-900">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full border-2 border-emerald-200 rounded-xl p-4 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 resize-none"
              rows={4}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Any additional information about this payment..."
            />
          </div>

          <label
            className={`flex items-start gap-3 text-sm cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
              errors.consent
                ? "border-red-300 bg-red-50"
                : "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 border-2 border-emerald-300 rounded focus:ring-emerald-500"
            />
            <span className="font-medium text-emerald-900">
              I confirm that all details provided are accurate and the receipt
              is genuine.
            </span>
          </label>
          {errors.consent && (
            <p className="text-red-600 text-sm ml-1">{errors.consent}</p>
          )}

          {(errors.patientId || errors.appointmentId) && (
            <p className="text-red-600 text-sm">
              {errors.patientId || errors.appointmentId}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg
                       bg-gradient-to-r from-green-500 to-emerald-600
                       hover:from-green-600 hover:to-emerald-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Receipt...
              </span>
            ) : (
              " Submit Receipt"
            )}
          </motion.button>

        
        </motion.form>
      </motion.div>
    </div>
  );
}


function Input({ label, error, className, ...props }) {
  const base =
    "w-full border-2 rounded-xl p-3 transition-all duration-300 focus:ring-2 focus:ring-emerald-200";
  const state = error
    ? "border-red-300 bg-red-50 focus:border-red-500"
    : "border-emerald-200 focus:border-emerald-500 hover:border-emerald-300";
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-emerald-900">
        {label}
      </label>
      <input {...props} className={`${base} ${state} ${className || ""}`} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
function Select({ label, options, error, className, ...props }) {
  const base =
    "w-full border-2 rounded-xl p-3 transition-all duration-300 focus:ring-2 focus:ring-emerald-200";
  const state = error
    ? "border-red-300 bg-red-50 focus:border-red-500"
    : "border-emerald-200 focus:border-emerald-500 hover:border-emerald-300";
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-emerald-900">
        {label}
      </label>
      <select {...props} className={`${base} ${state} ${className || ""}`}>
        <option value="">Select an option...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
