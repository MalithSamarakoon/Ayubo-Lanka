// src/utils/cartCounter.js
// Small facade just for Navbar badge usage

import { getCart, onCartItemsChange } from "./cart";

export function getCartCount() {
  return getCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

// Subscribe to cart changes and feed only the count to your setter
export function onCartChange(setCount) {
  return onCartItemsChange(items => {
    const count = items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    setCount(count);
  });
}
