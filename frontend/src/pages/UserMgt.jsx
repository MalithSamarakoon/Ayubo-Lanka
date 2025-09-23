import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import UpdateUserModal from "./UpdateUserModal";
import { ArrowLeft } from "lucide-react";

const URL = "http://localhost:5000/api/user/users";

function UserMgt() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [roleFilter, setRoleFilter] = useState("all");

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

  const downloadUserReport = (roleFilter = null) => {
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
    let title = "User Management Report";
    if (roleFilter) title = `${roleFilter} Report`;
    doc.text(title, marginX, marginTop);

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

    // filter data by role
    const dataToExport = roleFilter
      ? filteredData.filter(
          (u) => (u.role || "").toLowerCase() === roleFilter.toLowerCase()
        )
      : filteredData;

    const body = dataToExport.map((u, idx) => [
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

    const rolePart = roleFilter ? `_${roleFilter}` : "_All";
    doc.save(`User_Report${rolePart}_${yyyy}-${mm}-${dd}.pdf`);
  };

  // approval
  const handleApprovalChange = async (userId, approved) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isApproved: approved } : u))
    );

    try {
      await axios.patch(`http://localhost:5000/api/user/approve/${userId}`);
      toast.success("User approval updated");
    } catch (err) {
      console.error("Error updating approval:", err);
      toast.error("Failed to update approval. Please try again.");
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/user/${userId}`);
          Swal.fire("Deleted!", "Account deleted successfully.", "success");

          setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
          console.error("Error deleting user:", err);
          Swal.fire("Error!", "Failed to delete account. Try again.", "error");
        }
      }
    });
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

  //filteredData and roles
  const filteredData = useMemo(() => {
    const base =
      roleFilter === "all"
        ? users
        : users.filter(
            (u) => (u.role || "").toString().toLowerCase() === roleFilter
          );

    if (!searchTerm.trim()) return base;
    const q = searchTerm.toLowerCase();

    return base.filter((u) => {
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
  }, [users, searchTerm, roleFilter]);

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
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md flex-1">
            User Management
          </h1>
        </div>

        {/* Search + Role Filter side by side */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <input
            type="text"
            placeholder="Search users by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-1 px-4 py-3 rounded-2xl shadow-lg border border-gray-200 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500 transition"
          />

          {/*Role filter dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
            }}
            className="w-full md:w-60 px-4 py-3 rounded-2xl shadow-lg border border-gray-200 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="supplier">Supplier</option>
          </select>
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

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => downloadUserReport("user")}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition"
          >
            Download User Report
          </button>

          <button
            onClick={() => downloadUserReport("doctor")}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Download Doctor Report
          </button>

          <button
            onClick={() => downloadUserReport("supplier")}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
          >
            Download Supplier Report
          </button>
        </div>

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
