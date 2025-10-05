import { useEffect, useState } from "react";
import api from "../api";

export default function Purchased() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await api.get(`/api/orders/purchased`, { params: { userId: import.meta.env.VITE_USER_ID || "demo-user" } });
    setItems(res.data);
  };
  useEffect(()=>{ load(); }, []);

  return (
    <section>
      <h2>Purchased Items</h2>
      {items.length === 0 ? <p>No purchased items yet.</p> : (
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th>Order</th><th>Date</th></tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.name}</td>
                <td>{it.qty}</td>
                <td>{it.price}</td>
                <td>{it.lineTotal}</td>
                <td>{it.orderId}</td>
                <td>{new Date(it.purchasedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
