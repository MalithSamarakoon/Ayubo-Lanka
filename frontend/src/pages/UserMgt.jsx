import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import UpdateUserModal from "../Component/UpdateUserModal";

const URL = "http://localhost:5000/api/user/users";

function UserMgt() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(URL);
        const normalized = (res.data?.users || []).map((u) => ({
          ...u,
          isApproved:
            typeof u.isApproved === "boolean"
              ? u.isApproved
              : Boolean(u.approved),
        }));
        setUsers(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHandler();
  }, []);

  const downloadUserReport = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const marginX = 48;
    const marginTop = 60;
    const lineY = marginTop + 22;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("User Management Report", marginX, marginTop);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const now = new Date();
    const dateStr = now.toLocaleString();
    doc.text(`Generated: ${dateStr}`, marginX, marginTop + 16);

    doc.setDrawColor(180);
    doc.setLineWidth(0.8);
    doc.line(marginX, lineY, doc.internal.pageSize.getWidth() - marginX, lineY);

    const head = [
      [
        "#",
        "Name",
        "Email",
        "Role",
        "Mobile",
        "Doctor License",
        "Specialization",
        "Company Address",
        "Product Category",
        "Approved",
      ],
    ];

    const body = filteredData.map((u, idx) => [
      idx + 1, 
      u.name || "-",
      u.email || "-",
      u.role || "-",
      u.mobile || "-",
      u.doctorLicenseNumber || "-",
      u.specialization || "-",
      u.companyAddress || "-",
      u.productCategory || "-",
      u.isApproved === true ? "Yes" : "No",
    ]);

    autoTable(doc, {
      head,
      body,
      startY: lineY + 16,
      margin: { left: marginX, right: marginX },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 6,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        halign: "left",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        const footerY = pageSize.getHeight() - 24;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(120);

        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          pageWidth - marginX,
          footerY,
          { align: "right" }
        );
      },
    });

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    doc.save(`User_Report_${yyyy}-${mm}-${dd}.pdf`);
  };

  //approval
  const handleApprovalChange = async (userId, approved) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isApproved: approved } : u))
    );

    try {
      await axios.patch(`http://localhost:5000/api/user/approve/${userId}`);
    } catch (err) {
      console.error("Error updating approval:", err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setUsers((prev) => prev.filter((u) => u._id !== userId));

    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdate = (user) => {
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const handleUserSaved = (updated) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u))
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter((u) => {
      const role = (u.role || "").toString().toLowerCase();
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const mobile = (u.mobile || "").toString();
      const lic = (u.doctorLicenseNumber || "").toLowerCase();
      const spec = (u.specialization || "").toLowerCase();
      const addr = (u.companyAddress || "").toLowerCase();
      const cat = (u.productCategory || "").toLowerCase();
      return (
        role.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        mobile.includes(q) ||
        lic.includes(q) ||
        spec.includes(q) ||
        addr.includes(q) ||
        cat.includes(q)
      );
    });
  }, [users, searchTerm]);

  const columns = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row, table }) =>
          row.index +
          1 +
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize,
        size: 40,
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = (row.original.role || "").toLowerCase();
          const label = row.original.role || "-";
          const pill =
            role === "admin"
              ? "bg-purple-500 text-white"
              : role === "supplier"
              ? "bg-emerald-500 text-white"
              : role === "doctor"
              ? "bg-blue-500 text-white"
              : "bg-yellow-500 text-white";
          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium shadow ${pill}`}
            >
              {label}
            </span>
          );
        },
      },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "doctorLicenseNumber", header: "Doctor License" },
      { accessorKey: "specialization", header: "Specialization" },
      { accessorKey: "companyAddress", header: "Company Address" },
      { accessorKey: "productCategory", header: "Product Category" },
      {
        id: "approval",
        header: "Approval",
        cell: ({ row }) => {
          const u = row.original;
          const role = (u.role || "").toLowerCase();
          const needsApproval = role === "doctor" || role === "supplier";
          if (!needsApproval) return <span className="text-gray-400">—</span>;

          return (
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={u.isApproved === true}
                onChange={() => handleApprovalChange(u._id, true)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
              <span>Approve</span>
            </label>
          );
        },
        size: 150,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleUpdate(u)}
                className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:shadow-lg transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="py-2 px-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow hover:shadow-lg transition"
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md">
          User Management
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search users by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl px-4 py-3 rounded-2xl shadow-lg border border-gray-200 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500 transition"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-200 bg-white/70 backdrop-blur-md">
          <table className="w-full text-left text-gray-800">
            <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-6 font-semibold select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "↑",
                          desc: "↓",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="py-6 px-6 text-center text-gray-500"
                    colSpan={columns.length}
                  >
                    Loading users...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-emerald-50/60 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-6 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="py-6 px-6 text-center text-gray-500"
                    colSpan={columns.length}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Page{" "}
            <span className="font-semibold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="font-semibold">{table.getPageCount()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              « First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next ›
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Last »
            </button>

            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="ml-2 px-3 py-2 rounded-lg border border-gray-300 bg-white"
            >
              {[5, 10, 20, 50].map((ps) => (
                <option key={ps} value={ps}>
                  Show {ps}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={downloadUserReport}
          className="mt-6 w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
        >
          Download User Report
        </button>

        <UpdateUserModal
          id={editingId}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleUserSaved}
        />
      </div>
    </div>
  );
}

export default UserMgt;
