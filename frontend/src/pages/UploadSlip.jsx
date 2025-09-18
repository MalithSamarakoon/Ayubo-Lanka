import React, { useState } from "react";
import axios from "axios";

export default function ReceiptUploadPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
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

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!allowed.includes(f.type)) {
      alert("Only JPG, PNG or PDF");
      return;
    }
    if (f.size > maxSize) {
      alert("Max 5MB");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl("");
  }

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Attach receipt file");
    if (!form.consent) return alert("Please accept the confirmation.");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("receipt", file);
      const { data } = await axios.post("/api/receipts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Submitted! Reference: ${data.id}`);
      // reset
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
      setPreviewUrl("");
    } catch (err) {
      alert(err?.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold">Bank Receipt Upload</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Bank"
            value={form.bank}
            onChange={(e) => update("bank", e.target.value)}
            required
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
          />
          <Input
            type="date"
            label="Payment Date"
            value={form.paymentDate}
            onChange={(e) => update("paymentDate", e.target.value)}
            required
          />
          <Input
            type="number"
            step="0.01"
            label="Amount (LKR)"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            required
          />
          <Select
            label="Payment Method"
            value={form.paymentMethod}
            onChange={(e) => update("paymentMethod", e.target.value)}
            required
            options={["Online transfer", "Cash deposit", "ATM", "CDM"]}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Receipt (JPG/PNG/PDF, max 5MB)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={onFileChange}
            className="block w-full"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="mt-2 max-h-56 rounded-lg border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Notes (optional)</label>
          <textarea
            className="mt-1 w-full border rounded-lg p-2"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
          />
          I confirm the details are correct and the receipt is genuine.
        </label>

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Receipt"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input {...props} className="w-full border rounded-lg p-2" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <select {...props} className="w-full border rounded-lg p-2">
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
