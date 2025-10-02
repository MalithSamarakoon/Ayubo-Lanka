import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);

  // Billing / primary address
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    country: "",
  });

  // Payment method + optional slip
  const [payment, setPayment] = useState({
    method: "COD", // "COD" | "SLIP"
    slip: null,    // File | null
  });

  // Extra shipping + notes
  const [shipDiff, setShipDiff] = useState(false);
  const [ship, setShip] = useState({ line1: "", city: "", country: "" });
  const [notes, setNotes] = useState("");

  const upd = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.line1 || !form.city || !form.country) {
      alert("Please fill all required fields.");
      return;
    }
    if (payment.method === "SLIP" && !payment.slip) {
      alert("Please attach your payment slip.");
      return;
    }
    if (shipDiff && (!ship.line1 || !ship.city || !ship.country)) {
      alert("Please fill the shipping address or uncheck 'Ship to a different address'.");
      return;
    }

    const address = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
    };
    if (notes.trim()) address.notes = notes.trim();

    const body = {
      address,
      ...(shipDiff
        ? { shippingAddress: {
            line1: ship.line1.trim(),
            city: ship.city.trim(),
            country: ship.country.trim(),
          } }
        : {}),
      shipping: 0,
      tax: 0,
    };

    try {
      setSaving(true);

      // 1) create order
      const res = await api.post("/orders/checkout", body);
      const orderId = res.data?._id;
      if (!orderId) throw new Error("Missing order id");

      // 2) optional slip upload
      if (payment.method === "SLIP" && payment.slip) {
        const fd = new FormData();
        fd.append("method", "SLIP");
        fd.append("slip", payment.slip);
        try {
          await api.post(`/orders/${orderId}/payment`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (err) {
          console.warn("Slip upload failed:", err?.response?.data || err.message);
          alert("Order created. Slip upload failed—please try again from Orders page.");
        }
      }

      alert(`Order placed: ${orderId}`);
      nav("/orders");
    } catch (err) {
      console.error("Checkout error:", err?.response?.status, err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="narrow">
      {/* Local overrides & CTA color */}
      <style>{`
        .pay-box input[type="radio"],
        .ship-box input[type="checkbox"] { width:auto !important; height:auto !important; }
        .pay-options { display:grid; gap:8px; }
        .pay-option { display:inline-flex; align-items:center; gap:8px; }
        .legend-strong { padding:0 6px; font-weight:600; }
        .cardish { margin-top:16px; padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); }

        /* Full-width, big CTA with emerald tones (good for dark UIs) */
        .cta-btn {
          display:block;
          width:100%;
          margin:16px 0 0;
          padding:16px 22px;
          border:none;
          border-radius:8px;
          font-size:1rem;
          line-height:1;
          font-weight:800;
          letter-spacing:.3px;
          text-transform:uppercase;
          color:#fff;
          background:#10b981;      /* Emerald 500 */
          cursor:pointer;
          transition:background .15s ease, transform .05s ease;
        }
        .cta-btn:hover { background:#34d399; }  /* Emerald 400 */
        .cta-btn:active { background:#059669; } /* Emerald 600 */
        .cta-btn:disabled { opacity:.65; cursor:not-allowed; }
      `}</style>

      <h2>Checkout</h2>

      <form onSubmit={submit} className="form">
        {/* Billing / primary address */}
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => upd("name", e.target.value)}
            placeholder="Full name"
            required
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => upd("phone", e.target.value)}
            placeholder="07xxxxxxxx"
            required
          />
        </label>

        <label>
          Address line
          <input
            value={form.line1}
            onChange={(e) => upd("line1", e.target.value)}
            placeholder="123 Main Rd"
            required
          />
        </label>

        <div className="row">
          <label style={{ flex: 1 }}>
            City
            <input
              value={form.city}
              onChange={(e) => upd("city", e.target.value)}
              placeholder="Colombo"
              required
            />
          </label>
          <label style={{ flex: 1 }}>
            Country
            <input
              value={form.country}
              onChange={(e) => upd("country", e.target.value)}
              placeholder="LK"
              required
            />
          </label>
        </div>

        {/* Payment Method */}
        <fieldset className="pay-box cardish">
          <legend className="legend-strong">Payment Method</legend>

          <div className="pay-options">
            <label className="pay-option">
              <input
                type="radio"
                name="paymethod"
                value="COD"
                checked={payment.method === "COD"}
                onChange={() => setPayment((p) => ({ ...p, method: "COD", slip: null }))}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="pay-option">
              <input
                type="radio"
                name="paymethod"
                value="SLIP"
                checked={payment.method === "SLIP"}
                onChange={() => setPayment((p) => ({ ...p, method: "SLIP" }))}
              />
              <span>Upload bank slip</span>
            </label>
          </div>

          {payment.method === "SLIP" && (
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setPayment((p) => ({ ...p, slip: e.target.files?.[0] || null }))
                }
              />
            </div>
          )}
        </fieldset>

        {/* Shipping Address + Order notes */}
        <fieldset className="ship-box cardish">
          <legend className="legend-strong">Shipping Address</legend>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={shipDiff}
              onChange={(e) => setShipDiff(e.target.checked)}
            />
            <span>Ship to a different address?</span>
          </label>

          {shipDiff && (
            <div style={{ marginTop: 12 }}>
              <label>
                Address line 1
                <input
                  value={ship.line1}
                  onChange={(e) => setShip((s) => ({ ...s, line1: e.target.value }))}
                  placeholder="Apartment, suite, etc."
                  required={shipDiff}
                />
              </label>

              <div className="row">
                <label style={{ flex: 1 }}>
                  City
                  <input
                    value={ship.city}
                    onChange={(e) => setShip((s) => ({ ...s, city: e.target.value }))}
                    placeholder="City"
                    required={shipDiff}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  Country
                  <input
                    value={ship.country}
                    onChange={(e) => setShip((s) => ({ ...s, country: e.target.value }))}
                    placeholder="Country"
                    required={shipDiff}
                  />
                </label>
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <label>
              Order notes <span style={{ opacity: 0.7 }}>(optional)</span>
              <textarea
                rows={4}
                placeholder="Notes about your order, e.g. special notes for delivery."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {/* Privacy line */}
        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 12 }}>
          Your personal data will be used to process your order, support your experience
          throughout this website, and for other purposes described in our <b>Privacy policy</b>.
        </p>

        {/* Full-width CTA */}
        <button type="submit" disabled={saving} className="cta-btn">
          {saving ? "Placing…" : "PLACE ORDER"}
        </button>
      </form>
    </section>
  );
}
