import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", price: 0, stock: 0, category: "", description: "", imageUrl: "", herbs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/api/products/${id}`);
      const p = res.data;
      setForm({
        name: p.name || "",
        price: p.price ?? 0,
        stock: p.stock ?? 0,
        category: p.category || "",
        description: p.description || "",
        imageUrl: p.imageUrl || "",
        herbs: p.herbs || []
      });
      setLoading(false);
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    await api.put(`/api/products/${id}`, body);
    alert("Saved");
    nav("/");
  };

  const upd = (k, v) => setForm(s => ({ ...s, [k]: v }));

  if (loading) return <p>Loading…</p>;

  return (
    <section className="narrow">
      <h2>Edit product</h2>
      <form onSubmit={save} className="form">
        <label>Name<input value={form.name} onChange={e=>upd("name", e.target.value)} /></label>
        <label>Price<input type="number" value={form.price} onChange={e=>upd("price", e.target.value)} /></label>
        <label>Stock<input type="number" value={form.stock} onChange={e=>upd("stock", e.target.value)} /></label>
        <label>Category<input value={form.category} onChange={e=>upd("category", e.target.value)} /></label>
        <label>Image URL<input value={form.imageUrl} onChange={e=>upd("imageUrl", e.target.value)} /></label>
        <label>Description<textarea value={form.description} onChange={e=>upd("description", e.target.value)} /></label>
        <button type="submit">Save</button>
      </form>
    </section>
  );
}
