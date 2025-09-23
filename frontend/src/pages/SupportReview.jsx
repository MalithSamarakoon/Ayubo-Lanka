// frontend/src/pages/SupportReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const SupportReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/support/inquiry/${id}`);
      setDoc(data.inquiry);
      setDraft({
        name: data.inquiry.name || "",
        email: data.inquiry.email || "",
        phone: data.inquiry.phone || "",
        inquiryType: data.inquiry.inquiryType || "",
        subject: data.inquiry.subject || "",
        message: data.inquiry.message || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inquiry");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) =>
    setDraft((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/api/support/inquiry/${id}`, draft);
      setDoc(data.inquiry);
      setEdit(false);
      toast.success("Inquiry updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this inquiry?");
    if (!ok) return;
    try {
      await api.delete(`/api/support/inquiry/${id}`);
      toast.success("Inquiry deleted");
      navigate("/support");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const onConfirm = () => {
    toast.success("Inquiry submitted successfully!");
    navigate("/support");
  };

  if (!doc) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-green-800 mb-4">
        Review Your Inquiry
      </h1>

      {!edit ? (
        <div className="space-y-3 bg-green-50 p-4 rounded-xl">
          <div><b>Name:</b> {doc.name}</div>
          <div><b>Email:</b> {doc.email}</div>
          <div><b>Phone:</b> {doc.phone}</div>
          <div><b>Type:</b> {doc.inquiryType}</div>
          <div><b>Subject:</b> {doc.subject}</div>
          <div><b>Message:</b> {doc.message}</div>

          {doc.files?.length > 0 && (
            <div className="pt-2">
              <b>Attachments:</b>
              <ul className="list-disc pl-6">
                {doc.files.map((f, i) => (
                  <li key={i}>
                    <a href={f.path} target="_blank" rel="noreferrer">
                      {f.originalName || f.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 bg-white p-4 rounded-xl border">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" value={draft.name} onChange={onChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" value={draft.email} onChange={onChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" value={draft.phone} onChange={onChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Inquiry Type</label>
            <select
              name="inquiryType"
              value={draft.inquiryType}
              onChange={onChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Inquiry Type</option>
              <option value="product">Product Inquiry</option>
              <option value="treatment">Treatment Information</option>
              <option value="appointment">Appointment Request</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input name="subject" value={draft.subject} onChange={onChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea name="message" value={draft.message} onChange={onChange} rows={5} className="w-full border rounded p-2" />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {!edit ? (
          <button onClick={() => setEdit(true)} className="px-4 py-2 rounded bg-amber-500 text-white">
            Update
          </button>
        ) : (
          <>
            <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white">
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEdit(false);
                setDraft({
                  name: doc.name || "",
                  email: doc.email || "",
                  phone: doc.phone || "",
                  inquiryType: doc.inquiryType || "",
                  subject: doc.subject || "",
                  message: doc.message || "",
                });
              }}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
          </>
        )}

        <button onClick={onDelete} className="px-4 py-2 rounded bg-red-600 text-white ml-auto">
          Delete
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SupportReview;
