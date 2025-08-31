import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "Sathnindu",
    phone: "07xxxxxxxx",
    line1: "123 Main Rd",
    city: "Colombo",
    country: "LK",
    shipping: 0,
    tax: 0
  });

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      address: {
        name: form.name, phone: form.phone, line1: form.line1, city: form.city, country: form.country
      },
      shipping: Number(form.shipping) || 0,
      tax: Number(form.tax) || 0
    };
    const res = await api.post(`/api/orders/checkout`, body);
    alert(`Order created: ${res.data._id}`);
    nav("/orders");
  };

  const upd = (k, v) => setForm(s => ({ ...s, [k]: v }));

  return (
    <section className="narrow">
      <h2>Checkout</h2>
      <form onSubmit={submit} className="form">
        <label>Name<input value={form.name} onChange={e=>upd("name", e.target.value)} /></label>
        <label>Phone<input value={form.phone} onChange={e=>upd("phone", e.target.value)} /></label>
        <label>Address line<input value={form.line1} onChange={e=>upd("line1", e.target.value)} /></label>
        <div className="row">
          <label style={{flex:1}}>City<input value={form.city} onChange={e=>upd("city", e.target.value)} /></label>
          <label style={{flex:1}}>Country<input value={form.country} onChange={e=>upd("country", e.target.value)} /></label>
        </div>
        <div className="row">
          <label style={{flex:1}}>Shipping<input type="number" value={form.shipping} onChange={e=>upd("shipping", e.target.value)} /></label>
          <label style={{flex:1}}>Tax<input type="number" value={form.tax} onChange={e=>upd("tax", e.target.value)} /></label>
        </div>
        <button type="submit">Place Order</button>
      </form>
    </section>
  );
}
