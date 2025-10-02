import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../lib/api.js";
import { toast } from "react-hot-toast";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState("");
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [nextStatus, setNextStatus] = useState("PENDING");
  const location = useLocation();

  const getShipping = (o) => o?.shipping || {};
  const getName = (o) => getShipping(o).name || "";
  const getTel = (o) => getShipping(o).telephone || "";
  const getCity = (o) => getShipping(o).city || "";
  const getDistrict = (o) => getShipping(o).district || "";
  const getSlipUrl = (o) => o?.payment?.slipUrl || null;
  const getStatus = (o) => o?.status || "PENDING";
  const getCreatedAt = (o) =>
    o?.createdAt ? new Date(o.createdAt).toLocaleString() : "";

  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      history.replaceState({}, "");
      const t = setTimeout(() => setFlash(""), 3000);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.get("/api/orders", { params: { q } });
      const list = r?.data?.orders ?? r?.data?.data ?? [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading orders:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load orders";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (order) => {
    setEditing(order);
    setNextStatus(getStatus(order));
  };
  const closeEdit = () => setEditing(null);

  // ✅ use PATCH /:id/status instead of PUT body {status}
  const saveEdit = async () => {
    if (!editing?._id) return;
    try {
      await api.patch(`/api/orders/${editing._id}/status`, { status: nextStatus });
      toast.success("Status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === editing._id ? { ...o, status: nextStatus } : o))
      );
      closeEdit();
    } catch (err) {
      console.error("Update status error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Update failed";
      toast.error(msg);
    }
  };

  // ✅ DELETE route matches backend
  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/api/orders/${id}`);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Delete failed";
      toast.error(msg);
    }
  };

  const filteredCount = useMemo(() => orders.length, [orders]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {flash && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-800">
          {flash}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Orders {loading ? "…" : `(${filteredCount})`}
        </h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name/city/district/tel"
            className="border p-2 rounded"
          />
          <button
            onClick={load}
            className="px-3 py-2 rounded bg-gray-900 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Loading…" : "Search"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Telephone</th>
              <th className="p-2 border text-left">City</th>
              <th className="p-2 border text-left">District</th>
              <th className="p-2 border text-left">Slip</th>
              <th className="p-2 border text-left">Status</th>
              <th className="p-2 border text-left">Created</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{getName(o)}</td>
                  <td className="p-2 border">{getTel(o)}</td>
                  <td className="p-2 border">{getCity(o)}</td>
                  <td className="p-2 border">{getDistrict(o)}</td>
                  <td className="p-2 border">
                    {getSlipUrl(o) ? (
                      <a
                        href={getSlipUrl(o)}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold " +
                        (getStatus(o) === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : getStatus(o) === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700")
                      }
                    >
                      {getStatus(o)}
                    </span>
                  </td>
                  <td className="p-2 border">{getCreatedAt(o)}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(o)}
                        className="px-3 py-1 rounded bg-indigo-600 text-white"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => remove(o._id)}
                        className="px-3 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center text-gray-500" colSpan={8}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{getName(editing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telephone</span>
                <span className="font-medium">{getTel(editing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status</span>
                <span className="font-medium">{getStatus(editing)}</span>
              </div>
            </div>

            <label className="block text-sm font-medium mb-1">New Status</label>
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-6"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={closeEdit} className="px-4 py-2 rounded border border-gray-300">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-2 rounded bg-gray-900 text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
