import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const SupportReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    inquiryType: "", subject: "", message: ""
  });

  const [existingFiles, setExistingFiles] = useState([]);
  const [removed, setRemoved] = useState(new Set());
  const [newFiles, setNewFiles] = useState([]);

  const fileUrl = (p) => `${api.defaults.baseURL?.replace(/\/$/, "")}${p}`;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/support/inquiry/${id}`);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          inquiryType: data.inquiryType || "",
          subject: data.subject || "",
          message: data.message || "",
        });
        setExistingFiles(data.files || []);
      } catch (e) {
        toast.error("Failed to load inquiry");
        navigate("/support", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const toggle = (filename) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });
  };
  const onAdd = (e) => setNewFiles((p) => [...p, ...Array.from(e.target.files || [])]);

  const onDelete = async () => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/api/support/inquiry/${id}`);
      toast.success("Inquiry deleted");
      navigate("/support");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const onUpdate = async () => {
    setSaving(true);
    try {
      const keep = existingFiles.filter(f => !removed.has(f.filename)).map(f => f.filename);
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("keep", JSON.stringify(keep));
      newFiles.forEach((f) => fd.append("files", f));

      const { data } = await api.put(`/api/support/inquiry/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExistingFiles(data.inquiry.files || []);
      setRemoved(new Set());
      setNewFiles([]);
      toast.success("Inquiry updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onConfirm = () => {
    toast.success("Inquiry submitted successfully!");
    navigate("/support");
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Review Your Inquiry</h2>

      {["name","email","phone","subject"].map((k) => (
        <div key={k} className="mb-3">
          <label className="block text-sm text-green-700 mb-1 capitalize">{k}</label>
          <input
            className="w-full px-4 py-2 border border-green-200 rounded-2xl"
            value={formData[k]}
            onChange={(e) => setFormData((p) => ({ ...p, [k]: e.target.value }))}
          />
        </div>
      ))}

      <div className="mb-3">
        <label className="block text-sm text-green-700 mb-1">Inquiry Type</label>
        <select
          className="w-full px-4 py-2 border border-green-200 rounded-2xl"
          value={formData.inquiryType}
          onChange={(e) => setFormData((p) => ({ ...p, inquiryType: e.target.value }))}
        >
          <option value="product">Product</option>
          <option value="treatment">Treatment</option>
          <option value="appointment">Appointment</option>
          <option value="complaint">Complaint</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-green-700 mb-1">Message</label>
        <textarea
          rows="4"
          className="w-full px-4 py-2 border border-green-200 rounded-2xl"
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-green-700 mb-2">Existing Attachments</label>
        {existingFiles.length === 0 && <p className="text-sm text-green-600">None</p>}
        <ul className="space-y-2">
          {existingFiles.map((f) => {
            const willRemove = removed.has(f.filename);
            const isImg = /(\.png|\.jpe?g)$/i.test(f.originalName || f.filename);
            return (
              <li key={f.filename} className="flex items-center gap-3 bg-green-50 p-3 rounded-xl">
                <input type="checkbox" checked={willRemove} onChange={() => toggle(f.filename)} />
                {isImg ? (
                  <img src={fileUrl(f.path)} alt={f.originalName || f.filename} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <a href={fileUrl(f.path)} className="text-green-700 underline" target="_blank" rel="noreferrer">
                    {f.originalName || f.filename}
                  </a>
                )}
                <span className="text-sm text-green-700 flex-1 truncate">{f.originalName || f.filename}</span>
                {willRemove && <span className="text-red-600 text-xs">will be removed</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-green-700 mb-2">Add More Files</label>
        <input type="file" multiple onChange={onAdd} />
        {newFiles.length > 0 && <div className="mt-2 text-sm text-green-700">{newFiles.length} new file(s) selected</div>}
      </div>

      <div className="flex gap-3">
        <button onClick={onUpdate} disabled={saving} className="px-4 py-2 rounded-2xl bg-emerald-600 text-white">
          {saving ? "Saving…" : "Update"}
        </button>
        <button onClick={onDelete} className="px-4 py-2 rounded-2xl bg-red-600 text-white">Delete</button>
        <button onClick={onConfirm} className="ml-auto px-4 py-2 rounded-2xl bg-green-700 text-white">Confirm</button>
      </div>
    </div>
  );
};

export default SupportReview;
