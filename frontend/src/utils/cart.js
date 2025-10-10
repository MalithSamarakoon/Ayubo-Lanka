// src/utils/cart.js
// ✅ Single source of truth for cart (localStorage + tiny event bus)

const CART_KEY = "ayubo_cart_v1";

// --- Event bus (mini) ---
const listeners = new Set();
function emitCartChange() {
  for (const cb of listeners) {
    try { cb(getCart()); } catch {}
  }
}
export function onCartItemsChange(cb) {
  if (typeof cb === "function") {
    listeners.add(cb);
    // initial push
    try { cb(getCart()); } catch {}
  }
  return () => listeners.delete(cb);
}

// --- Storage helpers ---
function read() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function write(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartChange();
}

// --- Public API ---
export function getCart() {
  return read();
}
export function clearCart() {
  write([]);
}
export function removeItem(id) {
  const next = read().filter(it => it.id !== id && it._id !== id);
  write(next);
}
export function updateQty(id, qty) {
  const q = Math.max(1, Number(qty) || 1);
  const next = read().map(it => {
    const match = it.id === id || it._id === id;
    return match ? { ...it, qty: q } : it;
  });
  write(next);
}
export function addItem(product, qty = 1) {
  if (!product) return;
  const id = product._id || product.id;
  if (!id) return;

  const q = Math.max(1, Number(qty) || 1);
  const items = read();
  const idx = items.findIndex(it => (it.id === id || it._id === id));

  if (idx >= 0) {
    const prev = items[idx];
    items[idx] = { ...prev, qty: (Number(prev.qty) || 1) + q };
  } else {
    // keep minimal fields for cart row
    items.push({
      id,
      _id: id,
      name: product.name || product.title || product.productName || "Product",
      price: Number(product.price) || 0,
      image: product.image || (Array.isArray(product.images) && product.images[0]) || null,
      qty: q,
    });
  }
  write(items);
}

// Helpers often useful elsewhere
export function subtotal() {
  return read().reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
}
