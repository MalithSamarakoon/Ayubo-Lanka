// frontend/src/pages/OrderDisplay.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "react-hot-toast";
import OrderViewTable from "../components/OrderViewTable";

export default function OrderDisplay() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (order) return; // already have from state
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const r = await api.get(`/orders/${id}`);
        if (!r.data?.success) throw new Error(r.data?.message || "Load failed");
        if (mounted) setOrder(r.data.data);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e.message ||
          "Server error";
        setErr(msg);
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, order]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Order Details {order?._id ? `#${order._id}` : ""}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/orders")}
            className="px-3 py-2 rounded bg-gray-200"
          >
            Back to Orders
          </button>
          {order?._id && (
            <button
              onClick={() => navigate(`/orderupdateuser/${order._id}`, { state: { order } })}
              className="px-3 py-2 rounded bg-indigo-600 text-white"
            >
              Edit details
            </button>
          )}
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading…</div>}
      {err && !loading && (
        <div className="text-red-600 border border-red-200 bg-red-50 p-3 rounded">
          {err}
        </div>
      )}
      {order && (
        <div className="bg-white rounded-2xl shadow p-6">
          <OrderViewTable order={order} onOrderChange={setOrder} />
        </div>
      )}
    </div>
  );
}
