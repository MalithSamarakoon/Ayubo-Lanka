import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const nav = useNavigate();
  const { refresh, notify } = useCart();

  const load = async () => {
    const res = await api.get(`/api/cart`);
    setCart(res.data);
    await refresh();
  };
  useEffect(() => { load(); }, []);

  const changeQty = async (productId, qty) => {
    await api.patch(`/api/cart/items/${productId}`, { qty: Number(qty) });
    await load();
    notify("Quantity updated");
  };
  const removeItem = async (productId) => {
    await api.delete(`/api/cart/items/${productId}`);
    await load();
    notify("Item removed");
  };
  const clear = async () => {
    await api.delete(`/api/cart`);
    await load();
    notify("Cart cleared");
  };

  if (!cart) return <p>Loading…</p>;

  return (
    <section>
      <div className="row between" style={{marginBottom:10}}>
        <div>
          <div className="kicker">Your</div>
          <h2 style={{margin:"6px 0"}}>Cart</h2>
        </div>
        {cart.items.length>0 && <button className="btn btn-outline" onClick={clear}>Clear cart</button>}
      </div>

      {cart.items.length === 0 ? (
        <p>Cart is empty. <Link to="/">Browse products</Link></p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr><th>Item</th><th>Price</th><th style={{width:120}}>Qty</th><th>Total</th><th/></tr>
            </thead>
            <tbody>
              {cart.items.map(i => {
                const pid = i.product._id || i.product;
                const pname = i.product.name || pid;
                return (
                  <tr key={pid}>
                    <td><a href={`/p/${pid}`} style={{color:"#7c9fff"}}>{pname}</a></td>
                    <td>LKR {i.priceAtAdd}</td>
                    <td>
                      <input type="number" min="0" value={i.qty}
                             onChange={e=>changeQty(pid, e.target.value)} />
                    </td>
                    <td>LKR {i.qty * i.priceAtAdd}</td>
                    <td><button className="btn btn-danger" onClick={()=>removeItem(pid)}>Remove</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="row between" style={{marginTop:16}}>
            <div className="muted">Items: {cart.items.length}</div>
            <div className="row" style={{gap:12, alignItems:"center"}}>
              <strong>Total: LKR {cart.subtotal}</strong>
              <button className="btn btn-primary" onClick={()=>nav("/checkout")}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
