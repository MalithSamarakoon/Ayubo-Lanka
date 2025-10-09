import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const refresh = async () => {
    try {
      const res = await api.get("/api/carts");
      const c = res.data;
      const totalQty = (c.items || []).reduce((sum, it) => sum + (it.qty || 0), 0);
      setCount(totalQty);
      return c;
    } catch (e) {
      console.error("Cart refresh failed", e);
    }
  };

  const addItem = async (productId, qty = 1) => {
    await api.post("/api/carts/items", { productId, qty: Number(qty) || 1 });
    await refresh();
    notify("Added to cart");
  };

  useEffect(() => { refresh(); }, []);

  return (
    <CartContext.Provider value={{ count, refresh, addItem, notify }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
