// src/pages/AdminSupportCenter.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");
const BASE = (api.defaults.baseURL || "").replace(/\/$/, "");
const abs = (p) => (p?.startsWith("http") ? p : `${BASE}${p || ""}`);

// simple, static badge tones (no dynamic Tailwind)
const Badge = ({ children, tone = "green" }) => {
  const cls =
    tone === "green"
      ? "bg-green-100 text-green-700"
      : tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : tone === "blue"
      ? "bg-blue-100 text-blue-700"
      : "bg-rose-100 text-rose-700";
  return <span className={`px-2 py-0.5 text-xs rounded-full ${cls}`}>{children}</span>;
};

export default function AdminSupportCenter() {
  const [tab, setTab] = useState("inquiries");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // loaders
  const loadInquiries = async () => {
    const { data } = await api.get("/api/support/inquiries");
    setInquiries(data || []);
  };
  const loadTickets = async () => {
    const { data } = await api.get("/api/tickets");
    setTickets(data || []);
  };
  const loadFeedbacks = async () => {
    const { data } = await api.get("/api/feedback");
    setFeedbacks(data || []);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (tab === "inquiries") await loadInquiries();
        if (tab === "tickets") await loadTickets();
        if (tab === "feedbacks") await loadFeedbacks();
      } finally {
        setLoading(false);
      }
    })();
  }, [tab]);

 
  const filterByQ = (rows) => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  };
  const filtered = useMemo(() => {
    if (tab === "inquiries") return filterByQ(inquiries);
    if (tab === "tickets") return filterByQ(tickets);
    return filterByQ(feedbacks);
  }, [q, tab, inquiries, tickets, feedbacks]);

  // ==== ACTIONS ====

  // INQUIRIES
  const approveInquiry = async (id, next) => {
    setInquiries((prev) => prev.map((x) => (x._id === id ? { ...x, isApproved: next } : x)));
    try {
      await api.patch(`/api/support/inquiry/${id}/approve`, { isApproved: next });
    } catch {
      setInquiries((prev) => prev.map((x) => (x._id === id ? { ...x, isApproved: !next } : x)));
    }
  };
  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    const old = inquiries;
    setInquiries((prev) => prev.filter((x) => x._id !== id));
    try {
      await api.delete(`/api/support/inquiry/${id}`);
    } catch {
      setInquiries(old);
    }
  };

  // TICKETS
  const approveTicket = async (id) => {
    setTickets((p) => p.map((t) => (t._id === id ? { ...t, status: "in-progress" } : t)));
    try {
      await api.patch(`/api/tickets/${id}/approve`, { isApproved: true });
    } catch {
      loadTickets();
    }
  };
  const rejectTicket = async (id) => {
    if (!window.confirm("Reject (close) this ticket?")) return;
    setTickets((p) => p.map((t) => (t._id === id ? { ...t, status: "closed" } : t)));
    try {
      await api.patch(`/api/tickets/${id}/reject`);
    } catch {
      loadTickets();
    }
  };

  // FEEDBACKS
  const approveFeedback = async (id, next) => {
    setFeedbacks((prev) => prev.map((f) => (f._id === id ? { ...f, approved: next } : f)));
    try {
      await api.patch(`/api/feedback/${id}/approve`, { approved: next });
      // Support page shows approved items from /api/feedback/approved
    } catch {
      setFeedbacks((prev) => prev.map((f) => (f._id === id ? { ...f, approved: !next } : f)));
    }
  };
  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    const old = feedbacks;
    setFeedbacks((prev) => prev.filter((x) => x._id !== id));
    try {
      await api.delete(`/api/feedback/${id}`);
    } catch {
      setFeedbacks(old);
    }
  };

  // ==== PDF ====
  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const title =
      tab === "inquiries" ? "Support Inquiries" :
      tab === "tickets"   ? "Support Tickets"   :
                            "Customer Feedbacks";
    doc.setFontSize(16);
    doc.text(title, 40, 40);

    if (tab === "inquiries") {
      const body = filtered.map((x, i) => [
        i + 1, x.name || "—", x.email || "—", x.inquiryType || "—",
        x.subject || "—", (x.files?.length ?? 0), x.isApproved ? "Yes" : "No", fmt(x.createdAt)
      ]);
      doc.autoTable({ startY: 60, head: [["#", "Name", "Email", "Type", "Subject", "Files", "Approved", "Created"]], body });
    } else if (tab === "tickets") {
      const body = filtered.map((x, i) => [
        i + 1, x.ticketNumber || "—", x.name || "—", x.email || "—",
        x.department || "—", x.status || "—", (x.attachments?.length ?? 0), fmt(x.createdAt)
      ]);
      doc.autoTable({ startY: 60, head: [["#", "Ticket #", "Name", "Email", "Dept.", "Status", "Files", "Created"]], body });
    } else {
      const body = filtered.map((x, i) => [
        i + 1, x.name || "Anonymous", x.email || "—", x.rating ?? "—",
        x.approved ? "Yes" : "No", (x.feedback || "").slice(0, 60), fmt(x.createdAt)
      ]);
      doc.autoTable({ startY: 60, head: [["#", "Name", "Email", "Rating", "Approved", "Feedback (preview)", "Created"]], body });
    }
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  const tableHead = "bg-green-600 text-white text-sm font-semibold sticky top-0 z-10";
  const th = "px-4 py-3 text-left";
  const td = "px-4 py-3 border-t";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-emerald-600">
          Support & Inquiries
        </h1>

        {/* Tabs + Search */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "inquiries", label: "Inquiries" },
            { id: "tickets", label: "Tickets" },
            { id: "feedbacks", label: "Feedbacks" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                tab === t.id ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border border-emerald-200"
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by any field…"
              className="w-80 px-4 py-2 rounded-full bg-white shadow border border-emerald-100 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              {tab === "inquiries" && (
                <thead className={tableHead}>
                  <tr>
                    <th className={th}>Name / Email</th>
                    <th className={th}>Phone</th>
                    <th className={th}>Type</th>
                    <th className={th}>Subject</th>
                    <th className={th}>Files</th>
                    <th className={th}>Approved</th>
                    <th className={th}>Created</th>
                    <th className={th}>Actions</th>
                  </tr>
                </thead>
              )}
              {tab === "tickets" && (
                <thead className={tableHead}>
                  <tr>
                    <th className={th}>Ticket #</th>
                    <th className={th}>Name / Email</th>
                    <th className={th}>Department</th>
                    <th className={th}>Status</th>
                    <th className={th}>Files</th>
                    <th className={th}>Created</th>
                    <th className={th}>Actions</th>
                  </tr>
                </thead>
              )}
              {tab === "feedbacks" && (
                <thead className={tableHead}>
                  <tr>
                    <th className={th}>Name / Email</th>
                    <th className={th}>Rating</th>
                    <th className={th}>Approved</th>
                    <th className={th}>Feedback</th>
                    <th className={th}>Created</th>
                    <th className={th}>Actions</th>
                  </tr>
                </thead>
              )}

              <tbody className="text-sm">
                {loading && (
                  <tr><td className={td} colSpan={8}>Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td className={td} colSpan={8}>No records.</td></tr>
                )}

                {/* Inquiries */}
                {!loading && tab === "inquiries" && filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-emerald-50/40">
                    <td className={td}>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-gray-500">{r.email}</div>
                    </td>
                    <td className={td}>{r.phone || "—"}</td>
                    <td className={td}><Badge tone="green">{r.inquiryType}</Badge></td>
                    <td className={td}>{r.subject}</td>
                    <td className={td}>
                      {(r.files?.length ?? 0) > 0 ? (
                        <div className="flex flex-col gap-1">
                          {r.files.slice(0, 2).map((f) => (
                            <a
                              key={f.filename}
                              href={abs(f.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 underline"
                            >
                              {f.originalName || f.filename}
                            </a>
                          ))}
                          {r.files.length > 2 && (
                            <span className="text-gray-500 text-xs">+{r.files.length - 2} more…</span>
                          )}
                        </div>
                      ) : "—"}
                    </td>
                    {/* FIX 1: show Approved status in its own column */}
                    <td className={td}>
                      {r.isApproved ? <Badge tone="green">Yes</Badge> : <Badge tone="amber">No</Badge>}
                    </td>
                    {/* FIX 2: show Created column so headers and cells align */}
                    <td className={td}>{fmt(r.createdAt)}</td>
                    {/* FIX 3: actions now live in the Actions column only */}
                    <td className={`${td}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => approveInquiry(r._id, !r.isApproved)}
                          className="px-3 py-1 rounded-lg text-white bg-green-600 hover:bg-green-700"
                        >
                          {r.isApproved ? "Unapprove" : "Approve"}
                        </button>
                        {/* Delete is RED (requested) */}
                        <button
                          onClick={() => deleteInquiry(r._id)}
                          className="px-3 py-1 rounded-lg text-white hover:bg-red-700"
                          style={{ backgroundColor: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Tickets */}
                {!loading && tab === "tickets" && filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-emerald-50/40">
                    <td className={td}>{r.ticketNumber}</td>
                    <td className={td}>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-gray-500">{r.email}</div>
                    </td>
                    <td className={td}>{r.department}</td>
                    <td className={td}>
                      <Badge tone={r.status === "closed" ? "rose" : "blue"}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className={td}>
                      {(r.attachments?.length ?? 0) > 0 ? (
                        <div className="flex flex-col gap-1">
                          {r.attachments.slice(0, 2).map((f) => (
                            <a
                              key={f.filename}
                              href={abs(f.path)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 underline"
                            >
                              {f.originalName || f.filename}
                            </a>
                          ))}
                          {r.attachments.length > 2 && (
                            <span className="text-gray-500 text-xs">+{r.attachments.length - 2} more…</span>
                          )}
                        </div>
                      ) : "—"}
                    </td>
                    <td className={td}>{fmt(r.createdAt)}</td>
                    <td className={`${td}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => approveTicket(r._id)}
                          className="px-3 py-1 rounded-lg text-white bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </button>
                        {/* Reject is RED (requested) */}
                        <button
                          onClick={() => rejectTicket(r._id)}
                          className="px-3 py-1 rounded-lg text-white hover:bg-red-700"
                          style={{ backgroundColor: "#ef4444" }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Feedbacks */}
                {!loading && tab === "feedbacks" && filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-emerald-50/40">
                    <td className={td}>
                      <div className="font-medium">{r.name || "Anonymous"}</div>
                      <div className="text-gray-500">{r.email || "—"}</div>
                    </td>
                    <td className={td}>{r.rating ?? "—"}</td>
                    <td className={td}>
                      {r.approved ? <Badge tone="green">Yes</Badge> : <Badge tone="amber">No</Badge>}
                    </td>
                    <td className={td} title={r.feedback}>
                      {(r.feedback || "").slice(0, 80)}{r.feedback?.length > 80 ? "…" : ""}
                    </td>
                    <td className={td}>{fmt(r.createdAt)}</td>
                    <td className={`${td}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => approveFeedback(r._id, !r.approved)}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                          {r.approved ? "Unapprove" : "Approve"}
                        </button>
                        {/* Delete is RED (requested) */}
                         <button
                          onClick={() => rejectTicket(r._id)}
                          className="px-3 py-1 rounded-lg text-white hover:bg-red-700"
                          style={{ backgroundColor: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer with PDF only */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 border-t">
            <div className="text-sm text-emerald-700">
              Showing <b>{filtered.length}</b>{" "}
              {tab === "inquiries" ? "inquiries" : tab === "tickets" ? "tickets" : "feedbacks"}
            </div>
            <button onClick={downloadPDF} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold shadow">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
