// frontend/src/pages/OrderForm.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCart, clearCart as clearCartLS } from "../utils/cart";
import { api } from "../lib/api";

export default function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = location.state?.items?.length ? location.state.items : getCart();
  const subtotal = useMemo(
    () =>
      (location.state?.subtotal ??
        items.reduce(
          (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
          0
        )) || 0,
    [items, location.state?.subtotal]
  );

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    telephone: "",
    city: "",
    postalCode: "",
    district: "",
  });
  const [slipFile, setSlipFile] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e) =>
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));

  const requiredShippingOk =
    shipping.name?.trim() &&
    shipping.address?.trim() &&
    shipping.telephone?.trim() &&
    shipping.city?.trim() &&
    shipping.district?.trim() &&
    shipping.postalCode?.trim();

  const placeOrder = async () => {
    try {
      setErrMsg("");
      if (!items?.length) throw new Error("Your cart is empty.");
      if (!requiredShippingOk) throw new Error("Please fill all shipping fields.");

      setPlacing(true);

      const lineItems = items.map((i) => ({
        id: i.id,
        name: i.name || i.title || `Item ${i.id}`,
        image: i.image || i.img || null,
        qty: Number(i.qty) || 0,
        price: Number(i.price) || 0,
      }));

      let res;
      if (paymentMethod === "BANK_SLIP") {
        if (!slipFile) throw new Error("Please choose a bank slip file.");
        const fd = new FormData();
        fd.append("slip", slipFile);
        fd.append("items", JSON.stringify(lineItems));
        fd.append("shipping", JSON.stringify(shipping));
        fd.append("payment", JSON.stringify({ method: "BANK_SLIP" }));
        fd.append("total", String(subtotal));

        res = await api.post("/orders", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload = {
          items: lineItems,
          shipping,
          payment: { method: "COD" },
          total: subtotal,
        };
        res = await api.post("/orders", payload);
      }

      if (!res.data?.success) throw new Error(res.data?.message || "Order failed");
      const order = res.data.order;

      clearCartLS();
      toast.success("✅ Order completed!");
      // ✅ Go to the order display page WITH the created id + state
      navigate(`/orderdisplay/${order._id}`, { state: { order } });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.response?.statusText ||
        e.message ||
        "Server error";
      setErrMsg(msg);
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-8">Checkout</h1>

      {errMsg && (
        <div className="mb-6 p-3 rounded-md border border-red-300 bg-red-50 text-red-700 text-center">
          {errMsg}
        </div>
      )}

      {/* Payment */}
      <div className="mb-8 p-4 border rounded-xl bg-white">
        <h2 className="text-lg font-semibold mb-3 text-center">Payment method</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="BANK_SLIP"
              checked={paymentMethod === "BANK_SLIP"}
              onChange={() => setPaymentMethod("BANK_SLIP")}
            />
            <span>Upload Bank Slip</span>
          </label>
        </div>
      </div>

      {/* Shipping */}
      <div className="mb-8 p-4 border rounded-xl bg-white">
        <h2 className="text-lg font-semibold mb-3 text-center">Shipping details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={shipping.name}
            onChange={onChange}
            placeholder="Full name"
            className="border rounded-md px-3 py-2"
          />
          <input
            name="telephone"
            value={shipping.telephone}
            onChange={onChange}
            placeholder="Telephone"
            className="border rounded-md px-3 py-2"
          />
          <input
            name="address"
            value={shipping.address}
            onChange={onChange}
            placeholder="Address"
            className="border rounded-md px-3 py-2 sm:col-span-2"
          />
          <input
            name="city"
            value={shipping.city}
            onChange={onChange}
            placeholder="City"
            className="border rounded-md px-3 py-2"
          />
          <input
            name="district"
            value={shipping.district}
            onChange={onChange}
            placeholder="District"
            className="border rounded-md px-3 py-2"
          />
          <input
            name="postalCode"
            value={shipping.postalCode}
            onChange={onChange}
            placeholder="Postal code"
            className="border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Slip */}
      {paymentMethod === "BANK_SLIP" && (
        <div className="mb-8 p-4 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-3">Upload bank slip</h2>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
          />
          {slipFile && (
            <p className="mt-2 text-sm text-gray-600">{slipFile.name}</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="p-4 border rounded-xl bg-white">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Subtotal</span>
          <span className="font-semibold">
            Rs. {Number(subtotal).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Payment:{" "}
          <span className="font-medium">
            {paymentMethod === "COD" ? "Cash on Delivery" : "Bank Slip"}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={placeOrder}
            disabled={
              placing ||
              !items?.length ||
              !requiredShippingOk ||
              (paymentMethod === "BANK_SLIP" && !slipFile)
            }
            className="bg-gray-900 text-white px-6 py-3 rounded-md disabled:bg-gray-300"
          >
            {placing ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
