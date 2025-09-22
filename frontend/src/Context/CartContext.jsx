// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_items");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist in localStorage
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addItem = (productOrId, qty = 1) => {
    // supports either full product object OR just an id (but product object is better)
    const product =
      typeof productOrId === "object" && productOrId !== null
        ? productOrId
        : { _id: productOrId };

    setItems((prev) => {
      const idx = prev.findIndex((it) => it._id === product._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: (Number(next[idx].qty) || 0) + Number(qty || 1) };
        return next;
      }
      // keep basic fields for cart UI; if not provided, fallback gracefully
      const newItem = {
        _id: product._id,
        name: product.name ?? "Unknown item",
        price: Number(product.price) || 0,
        image: product.image || product.thumbnail || "",
        stock: Number(product.stock) ?? 0,
        qty: Number(qty) || 1,
      };
      return [...prev, newItem];
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, qty: Math.max(1, Number(qty) || 1) } : it))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it._id !== id));
  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  const value = { items, addItem, updateQty, removeItem, clearCart, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
