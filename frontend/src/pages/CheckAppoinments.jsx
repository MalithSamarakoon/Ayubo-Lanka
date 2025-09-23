// src/pages/CheckAppoinments.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  RefreshCcw,
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  Check,
  X,
  Clock,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const CheckAppoinments = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [receiptsByAppt, setReceiptsByAppt] = useState(new Map());
  const [q, setQ] = useState("");
  const [sortField, setSortField] = useState("bookingId");
  const [sortDir, setSortDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const toAbs = (u) => {
    if (!u) return "";
    return /^https?:\/\//i.test(u)
      ? u
      : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
  };

  const fmtLK = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-LK", {
          timeZone: "Asia/Colombo",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "-";

  const fetchPatients = async () => {
    const r = await axios.get(`${API_BASE}/api/patients`, {
      params: { limit: 200 },
      withCredentials: true,
    });
    return r.data?.items || [];
  };

  const fetchReceiptsFor = async (appointmentId) => {
    try {
      const r = await axios.get(`${API_BASE}/api/receipts`, {
        params: { appointmentId },
        withCredentials: true,
      });
      const list = r.data?.items || [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const patients = await fetchPatients();
      setAppointments(patients);

      const map = new Map();
      await Promise.all(
        patients.map(async (p) => {
          const id = p._id;
          if (!id) return;
          const recs = await fetchReceiptsFor(id);
          recs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          map.set(id, recs);
        })
      );
      setReceiptsByAppt(map);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

  }, []);


  const deleteAppointment = async (appointmentId) => {
    try {
      const ok = window.confirm(
        "Delete this appointment? This will also remove all related receipts. This cannot be undone."
      );
      if (!ok) return;

      await axios.delete(`${API_BASE}/api/patients/${appointmentId}`, {
        params: { cascade: "true" },
        withCredentials: true,
      });

      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      setReceiptsByAppt((prev) => {
        const next = new Map(prev);
        next.delete(appointmentId);
        return next;
      });

      alert("Appointment and associated receipts deleted successfully.");
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || "Failed to delete appointment";
      setErr(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };


  const approveAppointment = async (appointmentId) => {
  
    setAppointments((prev) =>
      prev.map((apt) =>
        apt._id === appointmentId ? { ...apt, status: "approved" } : apt
      )
    );

    try {
      const { data } = await axios.patch(
        `${API_BASE}/api/patients/${appointmentId}`,
        { status: "approved" },
        { withCredentials: true }
      );

    
      if (data && data._id) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt._id === data._id
              ? {
                  ...apt,
                  status: String(data.status || "approved").toLowerCase(),
                }
              : apt
          )
        );
      }
      alert("Appointment approved successfully.");
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || "Failed to approve appointment";
      setErr(errorMessage);
      alert(`Error: ${errorMessage}`);
      fetchAll();
    }
  };


  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let result = appointments || [];

    if (needle) {
      result = result.filter((a) => {
        const text = `${a.id ?? ""} ${a.name ?? ""} ${a.email ?? ""} ${
          a.phone ?? ""
        }`.toLowerCase();
        return text.includes(needle);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (a) => String(a.status || "pending").toLowerCase() === statusFilter
      );
    }
    return result;
  }, [appointments, q, statusFilter]);

  const rows = useMemo(() => {
    const mappedRows = (filtered || []).map((a) => {
      const recs = receiptsByAppt.get(a._id) || [];
      const latest = recs[0] || null;
      const method = latest?.paymentMethod || "-";
      const fileUrl = toAbs(latest?.file?.url || "");
      const fileMime = latest?.file?.mime || "";
      const status = String(a.status || "pending").toLowerCase();

      return {
        _id: a._id,
        bookingId: a.id ?? "",
        name: a.name ?? "-",
        phone: a.phone ?? "-",
        email: a.email ?? "-",
        method,
        fileUrl,
        fileMime,
        status,
        createdAt: a.createdAt,
      };
    });

    let filteredRows = mappedRows;
    if (paymentFilter !== "all") {
      filteredRows = mappedRows.filter((row) =>
        String(row.method || "")
          .toLowerCase()
          .includes(paymentFilter)
      );
    }

    return filteredRows.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [filtered, receiptsByAppt, sortField, sortDir, paymentFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };


  const StatusBadge = ({ status }) => {
    const key = String(status || "pending").toLowerCase();
    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    const icons = {
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
    };
    const label = key.charAt(0).toUpperCase() + key.slice(1);

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
          styles[key] || styles.pending
        }`}
      >
        {icons[key] || icons.pending}
        {label}
      </span>
    );
  };


  const generatePdf = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "A4",
      });

      // Header
      doc.setFontSize(16);
      doc.text("Ayurveda Medical Center — Appointments Report", 40, 40);
      doc.setFontSize(10);
      const now = new Date().toLocaleString("en-LK", {
        timeZone: "Asia/Colombo",
      });
      doc.text(`Generated: ${now} (Sri Lanka/Colombo)`, 40, 58);
    doc.text(
        `Rows: ${rows.length} (of ${appointments.length} total)`,
        40,
        86
      );

      
      const body = rows.map((r) => {
        const apt = appointments.find((a) => a._id === r._id) || {};
        const recs = receiptsByAppt.get(r._id) || [];
        const latest = recs[0] || null;

        const payMethod = latest?.paymentMethod || "-";
        const payAmount =
          latest?.amount != null && latest?.amount !== ""
            ? String(latest.amount)
            : "-";
        const payDate = latest?.paymentDate ? fmtLK(latest.paymentDate) : "-";
        const slipUrl = latest?.file?.url ? toAbs(latest.file.url) : "-";

        return [
          r.bookingId || "",
          apt.name || "",
          apt.age ?? "",
          apt.phone || "",
          apt.email || "",
          apt.address || "",
          (r.status || "").toString(),
          payMethod,
          payAmount,
          payDate,
          slipUrl,
          fmtLK(apt.createdAt),
        ];
      });

      autoTable(doc, {
        head: [
          [
            "Booking ID",
            "Name",
            "Age",
            "Phone",
            "Email",
            "Address",
            "Status",
            "Payment",
            "Amount",
            "Paid On",
            "Slip URL",
            "Created",
          ],
        ],
        body,
        startY: 110,
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [16, 185, 129] }, // emerald
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 120 },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 100 },
          4: { cellWidth: 140 },
          5: { cellWidth: 180 },
          6: { cellWidth: 70 },
          7: { cellWidth: 90 },
          8: { cellWidth: 60, halign: "right" },
          9: { cellWidth: 100 },
          10: { cellWidth: 160 },
          11: { cellWidth: 100 },
        },
      });

      // Footer page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 80,
          doc.internal.pageSize.getHeight() - 20
        );
      }

      doc.save(
        `appointments_report_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. See console for details.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Appointments Management
          </h1>
          <p className="text-gray-600">
            Manage patient appointments, payments, and approval status
          </p>
        </div>

        {err && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{err}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by booking ID, name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Payments</option>
                <option value="online">Online transfer</option>
                <option value="cash">Cash deposit</option>
                <option value="atm">ATM</option>
                <option value="cdm">CDM</option>
              </select>

              <button
                onClick={generatePdf}
                className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                title="Export current view as PDF"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>

              <button
                onClick={fetchAll}
                className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("bookingId")}
                  >
                    <div className="flex items-center gap-2">
                      Booking ID
                      <SortIcon field="bookingId" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Patient Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("method")}
                  >
                    <div className="flex items-center gap-2">
                      Payment Method
                      <SortIcon field="method" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Slip
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-12 text-center text-gray-500"
                      colSpan={7}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-gray-300" />
                        <p>No appointments found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          #{row.bookingId || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {row.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{row.phone}</div>
                        <div className="text-sm text-gray-500">{row.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {row.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {row.fileUrl ? (
                          row.fileMime === "application/pdf" ||
                          row.fileUrl.toLowerCase().endsWith(".pdf") ? (
                            <a
                              href={row.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              View PDF
                            </a>
                          ) : (
                            <a
                              href={row.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={row.fileUrl}
                                alt="Payment slip"
                                className="h-12 w-16 rounded-md border object-cover hover:shadow-lg transition-shadow cursor-pointer"
                              />
                            </a>
                          )
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No slip uploaded
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => approveAppointment(row._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Approve (set status to approved)"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAppointment(row._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Reject (delete appointment + receipts)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default CheckAppoinments;
