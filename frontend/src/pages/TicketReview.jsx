// frontend/src/pages/TicketReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const TicketReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    department: "general",
    subject: "",
    description: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get(`/api/tickets/by-id/${id}`);
      setTicket(data);
      setDraft({
        name: data.name || "",
        email: data.email || "",
        department: data.department || "general",
        subject: data.subject || "",
        description: data.description || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket");
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
      const { data } = await api.put(`/api/tickets/${id}`, draft);
      setTicket(data.ticket);
      setEdit(false);
      toast.success("Ticket updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this ticket?");
    if (!ok) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      toast.success("Ticket deleted");
      navigate("/support");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const onConfirm = () => {
    toast.success("Ticket created successfully!");
    navigate("/support");
  };

  if (!ticket) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-green-800 mb-4">
        Review Your Ticket
      </h1>

      {!edit ? (
        <div className="space-y-3 bg-green-50 p-4 rounded-xl">
          <div><b>Ticket #:</b> {ticket.ticketNumber}</div>
          <div><b>Name:</b> {ticket.name}</div>
          <div><b>Email:</b> {ticket.email}</div>
          <div><b>Department:</b> {ticket.department}</div>
          <div><b>Subject:</b> {ticket.subject}</div>
          <div><b>Description:</b> {ticket.description}</div>

          {ticket.attachments?.length > 0 && (
            <div className="pt-2">
              <b>Attachments:</b>
              <ul className="list-disc pl-6">
                {ticket.attachments.map((f, i) => (
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
            <input
              name="name"
              value={draft.name}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={draft.email}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <select
              name="department"
              value={draft.department}
              onChange={onChange}
              className="w-full border rounded p-2"
            >
              <option value="general">General Support</option>
              <option value="products">Product Inquiry</option>
              <option value="treatments">Treatments</option>
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Issues</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              name="subject"
              value={draft.subject}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={draft.description}
              onChange={onChange}
              rows={5}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-2 rounded bg-amber-500 text-white"
          >
            Update
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEdit(false);
                // reset draft to server copy
                setDraft({
                  name: ticket.name || "",
                  email: ticket.email || "",
                  department: ticket.department || "general",
                  subject: ticket.subject || "",
                  description: ticket.description || "",
                });
              }}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
          </>
        )}

        <button
          onClick={onDelete}
          className="px-4 py-2 rounded bg-red-600 text-white ml-auto"
        >
          Delete
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TicketReview;
