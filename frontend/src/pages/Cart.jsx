// src/pages/Cart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getCart,
  onCartItemsChange,
  updateQty,
  removeItem,
  clearCart,
} from "../utils/cart";

export default function Cart() {
  const [items, setItems] = useState(getCart());
  const navigate = useNavigate();

  // keep in sync with any cart changes
  useEffect(() => {
    const off = onCartItemsChange(setItems);
    return off;
  }, []);

  const fmt = (n) =>
    `Rs. ${Number(n || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const subTotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [items]
  );

  const handleQty = (id, next) => {
    const q = Math.max(1, Number(next) || 1);
    updateQty(id, q);
    // optimistic update for instant UI feedback
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: q } : it))
    );
  };

  const handleRemove = (id) => {
    removeItem(id);
    toast.success("Item removed from cart");
  };

  const handleClear = () => {
    if (!items.length) return;
    clearCart();
    toast.success("Cart cleared");
  };

  const proceedToCheckout = () => {
    if (!items.length) return toast.error("Your cart is empty");
    navigate("/order-form");
  };

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Your Cart
        </h1>
        <p className="mt-10 text-gray-500">
          No items yet.{" "}
          <Link to="/collection" className="underline hover:text-gray-700">
            Continue shopping →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-12">
        {/* ===== Left: Items ===== */}
        <div className="space-y-5 min-w-0">
          {items.map((it) => {
            const line =
              (Number(it.price) || 0) * (Number(it.qty) || 0);

            return (
              <div
                key={it.id}
                className="flex items-center gap-6 p-5 border rounded-2xl overflow-hidden"
              >
                {/* image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {it.image ? (
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">
                    {it.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {fmt(it.price)}
                  </div>
                </div>

                {/* quantity controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleQty(it.id, Math.max(1, (it.qty || 1) - 1))}
                    className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>

                  <input
                    className="w-14 text-center border rounded-lg py-2"
                    value={it.qty}
                    onChange={(e) =>
                      handleQty(it.id, Math.max(1, Number(e.target.value) || 1))
                    }
                  />

                  <button
                    onClick={() => handleQty(it.id, (Number(it.qty) || 1) + 1)}
                    className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* line total */}
                <div className="w-28 text-right font-medium shrink-0">
                  {fmt(line)}
                </div>

                {/* remove */}
                <button
                  onClick={() => handleRemove(it.id)}
                  className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90 shrink-0"
                >
                  <span className="text-white">Remove</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* ===== Right: Summary ===== */}
        <aside className="border rounded-2xl p-6 h-fit lg:sticky lg:top-20">
          <h2 className="text-xl font-semibold text-center">Summary</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{fmt(subTotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={proceedToCheckout}
              className="w-full px-5 py-3 rounded-xl bg-green-300 text-black hover:opacity-90"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClear}
              className="w-full px-5 py-3 rounded-xl bg-green-300 text-black/60 hover:text-white"
            >
              Clear Cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
