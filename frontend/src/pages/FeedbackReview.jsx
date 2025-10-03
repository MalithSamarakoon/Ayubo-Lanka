// frontend/src/pages/FeedbackReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const FeedbackReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    rating: 0,
    feedback: "",
    consent: false,
  });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/feedback/${id}`);
      const fb = data.feedback;
      setDoc(fb);
      setDraft({
        name: fb.name || "",
        email: fb.email || "",
        rating: fb.rating || 0,
        feedback: fb.feedback || "",
        consent: !!fb.consent,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feedback");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraft((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = { ...draft };
      payload.rating = Number(payload.rating);
      const { data } = await api.put(`/api/feedback/${id}`, payload);
      setDoc(data.feedback);
      setEdit(false);
      toast.success("Feedback updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this feedback?");
    if (!ok) return;
    try {
      await api.delete(`/api/feedback/${id}`);
      toast.success("Feedback deleted");
      navigate("/support");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const onConfirm = () => {
    toast.success("Thank you! Your feedback was submitted successfully.");
    navigate("/support");
  };

  if (!doc) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-green-800 mb-4">
        Review Your Feedback
      </h1>

      {!edit ? (
        <div className="space-y-3 bg-green-50 p-4 rounded-xl">
          <div><b>Name:</b> {doc.name || "(anonymous)"}</div>
          <div><b>Email:</b> {doc.email || "(anonymous)"}</div>
          <div><b>Rating:</b> {doc.rating}</div>
          <div><b>Feedback:</b> {doc.feedback}</div>
          <div><b>Consent:</b> {doc.consent ? "Yes" : "No"}</div>
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
            <label className="block text-sm font-medium">Rating (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              name="rating"
              value={draft.rating}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Feedback</label>
            <textarea name="feedback" value={draft.feedback} onChange={onChange} rows={5} className="w-full border rounded p-2" />
          </div>
          <div className="flex items-center gap-2">
            <input id="consent" type="checkbox" name="consent" checked={draft.consent} onChange={onChange} />
            <label htmlFor="consent" className="text-sm">Consent to share anonymously</label>
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
                  rating: doc.rating || 0,
                  feedback: doc.feedback || "",
                  consent: !!doc.consent,
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

export default FeedbackReview;
