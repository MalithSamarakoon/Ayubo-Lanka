import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";

const TicketReview = () => {
  const { id } = useParams(); // this is ticket _id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ticket, setTicket] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "general",
    subject: "",
    description: "",
    // priority removed in your latest version; keep if you still want it here
  });

  const [existingFiles, setExistingFiles] = useState([]);
  const [removedSet, setRemovedSet] = useState(new Set());
  const [newFiles, setNewFiles] = useState([]);

  const fileUrl = (p) => `${api.defaults.baseURL?.replace(/\/$/, "")}${p}`;

  useEffect(() => {
    (async () => {
      try {
        // we created it via POST /api/tickets which returned ticket with _id
        // read it back: if you have GET /api/tickets/:id you can use that;
        // otherwise list & find (to match your existing routes)
        const { data } = await api.get("/api/tickets");
        const doc = (data || []).find((t) => String(t._id) === String(id));
        if (!doc) {
          toast.error("Ticket not found");
          navigate("/support", { replace: true });
          return;
        }
        setTicket(doc);
        setFormData({
          name: doc.name || "",
          email: doc.email || "",
          department: doc.department || "general",
          subject: doc.subject || "",
          description: doc.description || "",
        });
        setExistingFiles(doc.attachments || []);
      } catch (e) {
        toast.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const toggleRemove = (filename) => {
    setRemovedSet((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };
  const onAddFiles = (e) => setNewFiles((p) => [...p, ...Array.from(e.target.files || [])]);

  const onDelete = async () => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/api/tickets/${ticket._id}`); // if you don't have this route, create it or skip delete here
      toast.success("Ticket deleted");
      navigate("/support");
    } catch (e) {
      // fall back: if delete route not available, show error
      toast.error(e?.response?.data?.message || "Delete failed (endpoint missing?)");
    }
  };

  const onUpdate = async () => {
    setSaving(true);
    try {
      const keep = existingFiles
        .filter((f) => !removedSet.has(f.filename))
        .map((f) => f.filename);

      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("keep", JSON.stringify(keep));
      newFiles.forEach((f) => fd.append("attachments", f));

      const { data } = await api.put(`/api/tickets/${ticket._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTicket(data.ticket);
      setExistingFiles(data.ticket.attachments || []);
      setRemovedSet(new Set());
      setNewFiles([]);
      toast.success("Ticket updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onConfirm = () => {
    toast.success("Ticket created successfully!");
    navigate("/support");
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        Review Your Ticket
      </h2>

      <div className="space-y-4">
        {["name", "email", "subject"].map((k) => (
          <div key={k}>
            <label className="block text-sm text-green-700 mb-1 capitalize">{k}</label>
            <input
              className="w-full px-4 py-2 border border-green-200 rounded-2xl"
              value={formData[k]}
              onChange={(e) => setFormData((p) => ({ ...p, [k]: e.target.value }))}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-green-700 mb-1">Department</label>
          <select
            className="w-full px-4 py-2 border border-green-200 rounded-2xl"
            value={formData.department}
            onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
          >
            <option value="general">General Support</option>
            <option value="products">Product Inquiry</option>
            <option value="treatments">Treatments</option>
            <option value="billing">Billing & Payments</option>
            <option value="technical">Technical Issues</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-green-700 mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full px-4 py-2 border border-green-200 rounded-2xl"
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        {/* existing attachments */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Existing Attachments</label>
          {existingFiles.length === 0 && <p className="text-sm text-green-600">None</p>}
          <ul className="space-y-2">
            {existingFiles.map((f) => {
              const checked = removedSet.has(f.filename);
              const isImage = /(\.png|\.jpe?g)$/i.test(f.originalName || f.filename);
              return (
                <li key={f.filename} className="flex items-center gap-3 bg-green-50 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRemove(f.filename)}
                    title="Check to remove this file"
                  />
                  {isImage ? (
                    <img
                      src={fileUrl(f.path)}
                      alt={f.originalName || f.filename}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <a className="text-green-700 underline" href={fileUrl(f.path)} target="_blank" rel="noreferrer">
                      {f.originalName || f.filename}
                    </a>
                  )}
                  <span className="text-sm text-green-700 flex-1 truncate">
                    {f.originalName || f.filename}
                  </span>
                  {checked && <span className="text-red-600 text-xs">will be removed</span>}
                </li>
              );
            })}
          </ul>
        </div>

        {/* add new attachments */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Add More Files</label>
          <input type="file" multiple onChange={onAddFiles} />
          {newFiles.length > 0 && (
            <div className="mt-2 text-sm text-green-700">
              {newFiles.length} new file(s) selected
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onUpdate}
            disabled={saving}
            className="px-4 py-2 rounded-2xl bg-emerald-600 text-white"
          >
            {saving ? "Saving…" : "Update"}
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white"
          >
            Delete
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-2xl bg-green-700 text-white ml-auto"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketReview;
