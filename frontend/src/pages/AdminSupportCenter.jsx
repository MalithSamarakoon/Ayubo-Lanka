// frontend/src/pages/AdminSupportCenter.jsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";

const tabs = ["Inquiries", "Tickets", "Feedbacks"];

const AdminSupportCenter = () => {
  const [active, setActive] = useState("Inquiries");
  const [inquiries, setInquiries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const base = (p) => `${api.defaults.baseURL?.replace(/\/$/, "")}${p}`;

  const load = async () => {
    const [inq, tix, fbs] = await Promise.all([
      api.get("/api/support/inquiries"),
      api.get("/api/tickets"),
      api.get("/api/feedback"),
    ]);
    setInquiries(inq.data || []);
    setTickets(tix.data || []);
    setFeedbacks(fbs.data || []);
  };

  useEffect(() => { load(); }, []);

  const approveInquiry = async (id, approved) => {
    await api.patch(`/api/support/inquiry/${id}/approve`, { approved });
    await load();
  };

  const approveTicket = async (id) => {
    await api.patch(`/api/tickets/${id}/approve`);
    await load();
  };

  const rejectTicket = async (id) => {
    await api.patch(`/api/tickets/${id}/reject`);
    await load();
  };

  const approveFeedback = async (id, isApproved) => {
    await api.patch(`/api/feedback/${id}/approve`, { isApproved });
    await load();
  };

  const downloadPdf = (type) => {
    window.open(`${api.defaults.baseURL.replace(/\/$/, "")}/api/admin/export/${type}.pdf`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Support & Inquiries</h1>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-3 py-2 rounded ${active === t ? "bg-emerald-600 text-white" : "bg-gray-100"}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto">
          {active === "Inquiries" && (
            <button className="px-3 py-2 rounded bg-emerald-700 text-white" onClick={() => downloadPdf("inquiries")}>
              Download PDF
            </button>
          )}
          {active === "Tickets" && (
            <button className="px-3 py-2 rounded bg-emerald-700 text-white" onClick={() => downloadPdf("tickets")}>
              Download PDF
            </button>
          )}
          {active === "Feedbacks" && (
            <button className="px-3 py-2 rounded bg-emerald-700 text-white" onClick={() => downloadPdf("feedbacks")}>
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* content */}
      {active === "Inquiries" && (
        <div className="space-y-3">
          {inquiries.map((q) => (
            <div key={q._id} className="p-4 bg-white rounded border">
              <div className="flex gap-4 justify-between">
                <div>
                  <div className="font-semibold">{q.subject}</div>
                  <div className="text-sm text-gray-600">{q.name} · {q.email}</div>
                  <div className="text-sm">Type: {q.inquiryType}</div>
                </div>
                <div className="text-sm">
                  Approved: <b>{q.approved ? "Yes" : "No"}</b>
                </div>
              </div>

              {/* files */}
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Files</div>
                {(!q.files || q.files.length === 0) ? (
                  <div className="text-sm text-gray-500">None</div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {q.files.map((f) => {
                      const img = /\.(png|jpe?g)$/i.test(f.originalName || f.filename);
                      return img ? (
                        <img key={f.filename} src={base(f.path)} alt={f.originalName} className="w-20 h-20 object-cover rounded" />
                      ) : (
                        <a key={f.filename} href={base(f.path)} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                          {f.originalName || f.filename}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-emerald-600 text-white"
                  onClick={() => approveInquiry(q._id, !q.approved)}
                >
                  {q.approved ? "Unapprove" : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "Tickets" && (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t._id} className="p-4 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.subject}</div>
                  <div className="text-sm text-gray-600">{t.ticketNumber} · {t.name} · {t.email}</div>
                  <div className="text-sm">Dept: {t.department} · Status: {t.status}</div>
                </div>
                <div className="text-sm">
                  Approved: <b>{t.approved ? "Yes" : "No"}</b> {t.rejected ? <span className="ml-2 text-red-600">(Rejected)</span> : null}
                </div>
              </div>

              {/* attachments */}
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Attachments</div>
                {(!t.attachments || t.attachments.length === 0) ? (
                  <div className="text-sm text-gray-500">None</div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {t.attachments.map((f) => {
                      const img = /\.(png|jpe?g)$/i.test(f.originalName || f.filename);
                      return img ? (
                        <img key={f.filename} src={base(f.path)} alt={f.originalName} className="w-20 h-20 object-cover rounded" />
                      ) : (
                        <a key={f.filename} href={base(f.path)} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                          {f.originalName || f.filename}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => approveTicket(t._id)}>
                  Approve
                </button>
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => rejectTicket(t._id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "Feedbacks" && (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f._id} className="p-4 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{f.name || "Anonymous"}</div>
                  <div className="text-sm text-gray-600">{f.email || "-"}</div>
                  <div className="text-sm">Rating: {f.rating}/5</div>
                </div>
                <div className="text-sm">Approved: <b>{f.isApproved ? "Yes" : "No"}</b></div>
              </div>
              <p className="mt-2">{f.feedback}</p>
              <div className="mt-3">
                <button
                  className="px-3 py-1 rounded bg-emerald-600 text-white"
                  onClick={() => approveFeedback(f._id, !f.isApproved)}
                >
                  {f.isApproved ? "Unapprove" : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSupportCenter;
