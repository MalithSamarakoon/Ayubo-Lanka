// frontend/src/components/OrderViewTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "react-hot-toast";

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

export default function OrderViewTable({ order: initialOrder, onOrderChange }) {
  const navigate = useNavigate();

  const [order, setOrder] = useState(initialOrder || {});
  const [showEdit, setShowEdit] = useState(false);
  const hasId = Boolean(order?._id);

  const items = order?.items || [];
  const shipping = order?.shipping || {};
  const payment = order?.payment || {};
  const total = Number(order?.total || 0);
  const status = order?.status || "PENDING";
  const [nextStatus, setNextStatus] = useState(status);

  const applyLocal = (updated) => {
    setOrder(updated);
    onOrderChange?.(updated);
  };

  const openEdit = () => {
    setNextStatus(status);
    setShowEdit(true);
  };

  const saveStatus = async () => {
    if (!hasId) return;
    try {
      const { data } = await api.patch(`/orders/${order._id}/status`, {
        status: nextStatus,
      });
      if (!data?.success) throw new Error(data?.message || "Update failed");
      const updated = { ...order, status: data.data?.status || nextStatus };
      applyLocal(updated);
      toast.success("Status updated");
      setShowEdit(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Update failed";
      toast.error(msg);
    }
  };

  const cancelOrder = async () => {
    if (!hasId) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const { data } = await api.patch(`/orders/${order._id}/status`, {
        status: "REJECTED",
      });
      if (!data?.success) throw new Error(data?.message || "Cancel failed");
      const updated = { ...order, status: "REJECTED" };
      applyLocal(updated);
      toast.success("Order cancelled");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Cancel failed";
      toast.error(msg);
    }
  };

  // 👉 Navigate to the receipt page, passing the whole order in route state
  const goToOrderSuccess = () => {
    if (!order) return;
    navigate("/order-success", { state: { order } });
  };

  return (
    <div className="space-y-8">
      {/* Items */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-bold mb-2">Items</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left">#</th>
              <th className="p-2 border text-left">Item</th>
              <th className="p-2 border text-right">Qty</th>
              <th className="p-2 border text-right">Price</th>
              <th className="p-2 border text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((it, i) => {
                const qty = Number(it.qty) || 0;
                const price = Number(it.price) || 0;
                const sub = qty * price;
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">
                      <div className="flex items-center gap-3">
                        {it.image ? (
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded" />
                        )}
                        <div className="font-medium">{it.name}</div>
                      </div>
                    </td>
                    <td className="p-2 border text-right">{qty}</td>
                    <td className="p-2 border text-right">{fmt(price)}</td>
                    <td className="p-2 border text-right">{fmt(sub)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-4 border text-center text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Shipping */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-bold mb-2">Shipping</h3>
        <table className="min-w-full border">
          <tbody>
            <tr>
              <th className="p-2 border text-left bg-gray-50 w-48">Name</th>
              <td className="p-2 border">{shipping.name || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">Telephone</th>
              <td className="p-2 border">{shipping.telephone || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">Address</th>
              <td className="p-2 border">{shipping.address || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">City</th>
              <td className="p-2 border">{shipping.city || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">Postal Code</th>
              <td className="p-2 border">{shipping.postalCode || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">District</th>
              <td className="p-2 border">{shipping.district || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-bold mb-2">Payment</h3>
        <table className="min-w-full border">
          <tbody>
            <tr>
              <th className="p-2 border text-left bg-gray-50 w-48">Method</th>
              <td className="p-2 border">{payment.method || "—"}</td>
            </tr>
            <tr>
              <th className="p-2 border text-left bg-gray-50">Slip</th>
              <td className="p-2 border">
                {payment.slipUrl ? (
                  <a
                    href={payment.slipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View slip
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer: Total + Status + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-gray-600 mr-2">Status:</span>
          <span
            className={
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
              (status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700")
            }
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold">Total: {fmt(total)}</span>
        </div>

        <div className="flex gap-2">
          {/* NEW: Continue -> OrderSuccess */}
          <button
            onClick={goToOrderSuccess}
            disabled={!hasId && !order} // allow even without id if order object exists
            className="px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-300"
          >
            Continue
          </button>

          {/* Keep your existing actions */}
          <button
            onClick={openEdit}
            disabled={!hasId}
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:bg-gray-300"
          >
            Update
          </button>
          <button
            onClick={cancelOrder}
            disabled={!hasId || status === "REJECTED"}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Update Status Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{shipping.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current</span>
                <span className="font-medium">{status}</span>
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
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Close
              </button>
              <button
                onClick={saveStatus}
                className="px-4 py-2 rounded bg-gray-900 text-white"
                disabled={!hasId}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
