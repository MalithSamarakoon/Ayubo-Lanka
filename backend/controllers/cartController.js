// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getUserId = (req) => req.header("x-user-id") || "demo-user";

const recalc = (cart) => {
  cart.subtotal = cart.items.reduce((sum, it) => sum + it.qty * it.priceAtAdd, 0);
};

export const getCart = async (req, res) => {
  const userId = getUserId(req);
  let cart = await Cart.findOne({ userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ userId, items: [], subtotal: 0 });
  res.json(cart);
};

export const addItem = async (req, res) => {
  const userId = getUserId(req);
  const { productId, qty = 1 } = req.body;

  if (!productId || qty <= 0) {
    return res.status(400).json({ message: "productId and qty > 0 required" });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [], subtotal: 0 });

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) {
    cart.items[idx].qty += Number(qty);
  } else {
    cart.items.push({ product: product._id, qty: Number(qty), priceAtAdd: product.price });
  }
  recalc(cart);
  await cart.save();
  await cart.populate("items.product");
  res.status(201).json(cart);
};

export const updateItemQty = async (req, res) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const { qty } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx < 0) return res.status(404).json({ message: "Item not in cart" });

  if (qty <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = Number(qty);
  }
  recalc(cart);
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
};

export const removeItem = async (req, res) => {
  const userId = getUserId(req);
  const { productId } = req.params;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  recalc(cart);
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
};

export const clearCart = async (req, res) => {
  const userId = getUserId(req);
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [], subtotal: 0 });
  cart.items = [];
  cart.subtotal = 0;
  await cart.save();
  res.json(cart);
};
