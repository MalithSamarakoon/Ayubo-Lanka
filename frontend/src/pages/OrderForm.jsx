import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCart, clearCart as clearCartLS } from "../utils/cart";
import { api } from "../lib/api";

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const tenDigits = /^\d{10}$/;
const lettersOnly = /^[A-Za-z\s]+$/;      
const lettersCount = (s = "") => (s.match(/[A-Za-z]/g) || []).length;

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


  const [touched, setTouched] = useState({
    name: false,
    telephone: false,
    address: false,
    city: false,
    district: false,
    postalCode: false,
    slip: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const onChange = (e) =>
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));

  // keep only digits for telephone, cap at 10
  const onChangeTelephone = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setShipping((s) => ({ ...s, telephone: digitsOnly }));
  };

  // ---------- Validation ----------
  const errors = (() => {
    const e = {};

    if (!shipping.name?.trim()) {
      e.name = "Full name is required.";
    } else if (!lettersOnly.test(shipping.name.trim())) {
      e.name = "Full name must contain letters only (A–Z).";
    }

    if (!shipping.telephone?.trim()) e.telephone = "Telephone is required.";
    else if (!tenDigits.test(shipping.telephone.trim()))
      e.telephone = "Telephone must be exactly 10 digits.";

    if (!shipping.address?.trim()) e.address = "Address is required.";
    else if (lettersCount(shipping.address) <= 15)
      e.address = "Address must contain more than 15 letters.";

    if (!shipping.city?.trim()) e.city = "City is required.";
    if (!shipping.district?.trim()) e.district = "District is required.";
    if (!shipping.postalCode?.trim()) e.postalCode = "Postal code is required.";

    if (paymentMethod === "BANK_SLIP" && !slipFile)
      e.slip = "Please upload your bank slip.";

    return e;
  })();

  const showErr = (field) => (submitted || touched[field]) && errors[field];

  const placeOrder = async () => {
    try {
      setErrMsg("");
      setSubmitted(true);

      if (!items?.length) throw new Error("Your cart is empty.");
      const errorList = Object.values(errors).filter(Boolean);
      if (errorList.length) throw new Error(errorList[0]);

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
          {/* Full name */}
          <div>
            <input
              name="name"
              value={shipping.name}
              onChange={onChange}
              onBlur={() => markTouched("name")}
              placeholder="Full name"
              autoComplete="name"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("name") ? "border-red-400" : ""
              }`}
            />
            {showErr("name") && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Telephone */}
          <div>
            <input
              name="telephone"
              value={shipping.telephone}
              onChange={onChangeTelephone}
              onBlur={() => markTouched("telephone")}
              placeholder="Telephone (10 digits)"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("telephone") ? "border-red-400" : ""
              }`}
              inputMode="numeric"
              maxLength={10}
            />
            {showErr("telephone") && (
              <p className="text-red-600 text-sm mt-1">{errors.telephone}</p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <input
              name="address"
              value={shipping.address}
              onChange={onChange}
              onBlur={() => markTouched("address")}
              placeholder="Address (≥ 16 letters)"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("address") ? "border-red-400" : ""
              }`}
            />
            <div className="flex justify-between">
              {showErr("address") ? (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  {lettersCount(shipping.address)} letters
                </p>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <input
              name="city"
              value={shipping.city}
              onChange={onChange}
              onBlur={() => markTouched("city")}
              placeholder="City"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("city") ? "border-red-400" : ""
              }`}
            />
            {showErr("city") && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* District */}
          <div>
            <input
              name="district"
              value={shipping.district}
              onChange={onChange}
              onBlur={() => markTouched("district")}
              placeholder="District"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("district") ? "border-red-400" : ""
              }`}
            />
            {showErr("district") && (
              <p className="text-red-600 text-sm mt-1">{errors.district}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <input
              name="postalCode"
              value={shipping.postalCode}
              onChange={onChange}
              onBlur={() => markTouched("postalCode")}
              placeholder="Postal code"
              className={`border rounded-md px-3 py-2 w-full ${
                showErr("postalCode") ? "border-red-400" : ""
              }`}
            />
            {showErr("postalCode") && (
              <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Slip (BANK_SLIP only) */}
      {paymentMethod === "BANK_SLIP" && (
        <div className="mb-8 p-4 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-3">Upload bank slip</h2>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              setSlipFile(e.target.files?.[0] || null);
              markTouched("slip");
            }}
            onBlur={() => markTouched("slip")}
            className={showErr("slip") ? "border border-red-400 rounded" : ""}
          />
          {showErr("slip") && (
            <p className="mt-2 text-sm text-red-600">{errors.slip}</p>
          )}
          {slipFile && (
            <p className="mt-2 text-sm text-gray-600">{slipFile.name}</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="p-4 border rounded-xl bg-white">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Subtotal</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
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
            disabled={placing || !items?.length}
            className="bg-gray-900 text-white px-6 py-3 rounded-md disabled:bg-gray-300"
          >
            {placing ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
