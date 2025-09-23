import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-medium border ${
      active ? "bg-emerald-600 text-white border-emerald-700"
             : "bg-white text-emerald-700 border-emerald-200"
    }`}
  >
    {children}
  </button>
);

const makeAbs = (p) =>
  `${api.defaults.baseURL?.replace(/\/$/, "")}${p || ""}`;

const downloadCSV = (rows, filename) => {
  if (!rows?.length) {
    toast.error("No data to export");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] ?? "";
          const s = String(val).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminSupportCenter = () => {
  const [tab, setTab] = useState("inquiries"); // inquiries | tickets | feedbacks
  const [loading, setLoading] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const refresh = async (which = tab) => {
    try {
      setLoading(true);
      if (which === "inquiries") {
        const { data } = await api.get("/api/support/inquiries");
        setInquiries(data || []);
      } else if (which === "tickets") {
        const { data } = await api.get("/api/tickets");
        setTickets(data || []);
      } else {
        const { data } = await api.get("/api/feedback");
        setFeedbacks(data || []);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // --- Actions ---
  const approveInquiry = async (id) => {
    try {
      await api.put(`/api/support/inquiry/${id}`, { status: "in-progress" });
      toast.success("Inquiry approved");
      refresh("inquiries");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Approve failed");
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/api/support/inquiry/${id}`);
      toast.success("Inquiry deleted");
      refresh("inquiries");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const approveTicket = async (id) => {
    try {
      await api.put(`/api/tickets/${id}/status`, { status: "in-progress" });
      toast.success("Ticket approved");
      refresh("tickets");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Approve failed");
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      toast.success("Ticket deleted");
      refresh("tickets");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const approveFeedback = async (id) => {
    try {
      // expects backend to support approval flag
      await api.patch(`/api/feedback/${id}/approve`, { approved: true });
      toast.success("Feedback approved");
      refresh("feedbacks");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Approve failed");
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await api.delete(`/api/feedback/${id}`);
      toast.success("Feedback deleted");
      refresh("feedbacks");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  // --- Export helpers ---
  const exportInquiries = () => {
    const rows = inquiries.map((q) => ({
      createdAt: new Date(q.createdAt).toLocaleString(),
      name: q.name,
      email: q.email,
      phone: q.phone,
      inquiryType: q.inquiryType,
      subject: q.subject,
      status: q.status,
      files: (q.files || []).length,
      id: q._id,
    }));
    downloadCSV(rows, "inquiries.csv");
  };

  const exportTickets = () => {
    const rows = tickets.map((t) => ({
      createdAt: new Date(t.createdAt).toLocaleString(),
      ticketNumber: t.ticketNumber,
      name: t.name,
      email: t.email,
      department: t.department,
      subject: t.subject,
      status: t.status,
      attachments: (t.attachments || []).length,
      id: t._id,
    }));
    downloadCSV(rows, "tickets.csv");
  };

  const exportFeedbacks = () => {
    const rows = feedbacks.map((f) => ({
      createdAt: new Date(f.createdAt).toLocaleString(),
      name: f.name || "",
      email: f.email || "",
      rating: f.rating,
      feedback: f.feedback,
      consent: f.consent ? "yes" : "no",
      approved: f.approved ? "yes" : "no",
      id: f._id,
    }));
    downloadCSV(rows, "feedbacks.csv");
  };

  // --- tables ---
  const InquiryTable = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-emerald-700">Inquiries</h3>
          <button onClick={exportInquiries} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-700">
                <th className="p-2">Created</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Type</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
                <th className="p-2">Files</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((q) => (
                <tr key={q._id} className="border-t">
                  <td className="p-2">{new Date(q.createdAt).toLocaleString()}</td>
                  <td className="p-2">{q.name}</td>
                  <td className="p-2">{q.email}</td>
                  <td className="p-2 capitalize">{q.inquiryType}</td>
                  <td className="p-2">{q.subject}</td>
                  <td className="p-2">{q.status}</td>
                  <td className="p-2">
                    {(q.files || []).length > 0 ? (
                      <div className="flex gap-2">
                        {(q.files || []).slice(0, 2).map((f) => (
                          <a
                            key={f.filename}
                            className="text-emerald-700 underline"
                            href={makeAbs(f.path)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f.originalName || f.filename}
                          </a>
                        ))}
                        {(q.files || []).length > 2 && <span>+{q.files.length - 2}</span>}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveInquiry(q._id)}
                        className="px-2 py-1 rounded bg-emerald-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteInquiry(q._id)}
                        className="px-2 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!inquiries.length && !loading && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={8}>No inquiries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inquiries, loading]
  );

  const TicketTable = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-emerald-700">Tickets</h3>
          <button onClick={exportTickets} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-700">
                <th className="p-2">Created</th>
                <th className="p-2">Ticket #</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Dept</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
                <th className="p-2">Files</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="p-2">{t.ticketNumber}</td>
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.email}</td>
                  <td className="p-2 capitalize">{t.department}</td>
                  <td className="p-2">{t.subject}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">
                    {(t.attachments || []).length > 0 ? (
                      <div className="flex gap-2">
                        {(t.attachments || []).slice(0, 2).map((f) => (
                          <a
                            key={f.filename}
                            className="text-emerald-700 underline"
                            href={makeAbs(f.path)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f.originalName || f.filename}
                          </a>
                        ))}
                        {(t.attachments || []).length > 2 && <span>+{t.attachments.length - 2}</span>}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveTicket(t._id)}
                        className="px-2 py-1 rounded bg-emerald-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteTicket(t._id)}
                        className="px-2 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!tickets.length && !loading && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={9}>No tickets</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets, loading]
  );

  const FeedbackTable = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-emerald-700">Feedbacks</h3>
          <button onClick={exportFeedbacks} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-700">
                <th className="p-2">Created</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Feedback</th>
                <th className="p-2">Consent</th>
                <th className="p-2">Approved</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id} className="border-t">
                  <td className="p-2">{new Date(f.createdAt).toLocaleString()}</td>
                  <td className="p-2">{f.name || "—"}</td>
                  <td className="p-2">{f.email || "—"}</td>
                  <td className="p-2">{f.rating}</td>
                  <td className="p-2 max-w-[400px] truncate">{f.feedback}</td>
                  <td className="p-2">{f.consent ? "yes" : "no"}</td>
                  <td className="p-2">{f.approved ? "yes" : "no"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      {!f.approved && (
                        <button
                          onClick={() => approveFeedback(f._id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteFeedback(f._id)}
                        className="px-2 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!feedbacks.length && !loading && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={8}>No feedbacks</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedbacks, loading]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-700">Support & Inquiry</h1>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>

        <div className="flex gap-2">
          <TabBtn active={tab === "inquiries"} onClick={() => setTab("inquiries")}>Inquiries</TabBtn>
          <TabBtn active={tab === "tickets"} onClick={() => setTab("tickets")}>Tickets</TabBtn>
          <TabBtn active={tab === "feedbacks"} onClick={() => setTab("feedbacks")}>Feedbacks</TabBtn>
        </div>

        {tab === "inquiries" && InquiryTable}
        {tab === "tickets" && TicketTable}
        {tab === "feedbacks" && FeedbackTable}
      </div>
    </div>
  );
};

export default AdminSupportCenter;
