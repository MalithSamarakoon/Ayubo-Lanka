import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const res = await api.get(`/api/orders`, { params: { userId: import.meta.env.VITE_USER_ID || "demo-user" } });
    setOrders(res.data);
  };
  useEffect(()=>{ load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api.post(`/api/orders/${id}/cancel`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <section>
      <h2>My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th><th>Payment</th><th/></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.totals?.grandTotal}</td>
                <td>{o.status}</td>
                <td>{o.paymentStatus}</td>
                <td>
                  {(o.status === "pending" || o.status === "processing") ? (
                    <button className="danger" onClick={()=>cancel(o._id)}>Cancel</button>
                  ) : <span className="muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
