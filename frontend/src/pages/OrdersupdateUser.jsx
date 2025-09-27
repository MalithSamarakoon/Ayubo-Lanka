import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

export default function OrdersupdateUser() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    telephone: "",
    city: "",
    postalCode: "",
    district: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [slipFile, setSlipFile] = useState(null);

  useEffect(() => {
    if (order) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const r = await api.get(`/api/orders/${id}`);
        if (!r.data?.success) throw new Error(r.data?.message || "Load failed");
        if (mounted) setOrder(r.data.order);
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

  useEffect(() => {
    if (!order) return;
    setShipping({
      name: order.shipping?.name || "",
      address: order.shipping?.address || "",
      telephone: order.shipping?.telephone || "",
      city: order.shipping?.city || "",
      postalCode: order.shipping?.postalCode || "",
      district: order.shipping?.district || "",
    });
    setPaymentMethod(order.payment?.method || "COD");
  }, [order]);

  const total = useMemo(
    () =>
      (order?.items || []).reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [order]
  );

  const onChange = (e) =>
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));

  const requiredShippingOk =
    shipping.name?.trim() &&
    shipping.address?.trim() &&
    shipping.telephone?.trim() &&
    shipping.city?.trim() &&
    shipping.district?.trim() &&
    shipping.postalCode?.trim();

  const submit = async () => {
    try {
      if (!order?._id) {
        toast.error("Order not loaded");
        return;
      }
      if (!requiredShippingOk) {
        toast.error("Please fill all shipping fields.");
        return;
      }

      setSaving(true);

      let res;
      if (paymentMethod === "BANK_SLIP" && slipFile) {
        const fd = new FormData();
        fd.append("slip", slipFile);
        fd.append("shipping", JSON.stringify(shipping));
        fd.append("payment", JSON.stringify({ method: "BANK_SLIP" }));
        fd.append("items", JSON.stringify(order.items || []));
        res = await api.put(`/api/orders/${order._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.put(`/api/orders/${order._id}`, {
          shipping,
          payment: { method: paymentMethod },
        });
      }

      if (!res.data?.success) throw new Error(res.data?.message || "Update failed");
      const updated = res.data.order;
      toast.success("✅ Details updated");
      navigate(`/orderdisplay/${updated._id}`, { state: { order: updated }, replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Server error";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10">Loading…</div>;
  if (err) return <div className="max-w-5xl mx-auto px-4 py-10 text-red-600">{err}</div>;
  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="mb-4">Order not found.</p>
        <button onClick={() => navigate(-1)} className="px-3 py-2 rounded bg-gray-200">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Edit Order #{order?._id ? order._id.slice(-6) : ""}
        </h1>
        <button
          onClick={() =>
            order?._id
              ? navigate(`/orderdisplay/${order._id}`, { state: { order } })
              : navigate(-1)
          }
          className="px-3 py-2 rounded bg-gray-200"
        >
          Cancel
        </button>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="text-gray-600 text-sm">Current Payment</div>
            <div className="font-semibold">{order.payment?.method}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Total</div>
            <div className="text-xl font-extrabold">{fmt(total)}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Status</div>
            <div className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              {order.status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Shipping Details</h2>
          <div className="grid grid-cols-1 gap-3">
            <input name="name" value={shipping.name} onChange={onChange} placeholder="Full name" className="border rounded-md px-3 py-2" />
            <input name="telephone" value={shipping.telephone} onChange={onChange} placeholder="Telephone" className="border rounded-md px-3 py-2" />
            <input name="address" value={shipping.address} onChange={onChange} placeholder="Address" className="border rounded-md px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" value={shipping.city} onChange={onChange} placeholder="City" className="border rounded-md px-3 py-2" />
              <input name="district" value={shipping.district} onChange={onChange} placeholder="District" className="border rounded-md px-3 py-2" />
            </div>
            <input name="postalCode" value={shipping.postalCode} onChange={onChange} placeholder="Postal code" className="border rounded-md px-3 py-2" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Payment</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="BANK_SLIP" checked={paymentMethod === "BANK_SLIP"} onChange={() => setPaymentMethod("BANK_SLIP")} />
              <span>Upload Bank Slip</span>
            </label>

            {paymentMethod === "BANK_SLIP" && (
              <div className="mt-2">
                <input type="file" accept="image/*,.pdf" onChange={(e) => setSlipFile(e.target.files?.[0] || null)} />
                {slipFile && <p className="mt-2 text-sm text-gray-600">{slipFile.name}</p>}
                {!slipFile && order.payment?.slipUrl && (
                  <p className="mt-2 text-sm">
                    Current slip:{" "}
                    <a className="text-blue-600 underline" href={order.payment.slipUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() =>
            order?._id
              ? navigate(`/orderdisplay/${order._id}`, { state: { order } })
              : navigate(-1)
          }
          className="px-4 py-2 rounded border border-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!requiredShippingOk || saving}
          className="px-4 py-2 rounded bg-gray-900 text-white disabled:bg-gray-300"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
