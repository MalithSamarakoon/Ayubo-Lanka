import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const getUserId = (req) => req.header("x-user-id") || "demo-user";

/** LIST ORDERS (for a user) */
export const listOrders = async (req, res) => {
  const userId = req.query.userId || getUserId(req);
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.json(orders);
};

/** GET SINGLE ORDER */
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

/** CHECKOUT FROM CART → creates order & clears cart */
export const checkoutFromCart = async (req, res) => {
  const userId = getUserId(req);
  const { address = {}, shipping = 0, tax = 0 } = req.body;

  const cart = await Cart.findOne({ userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const items = await Promise.all(
    cart.items.map(async (it) => {
      const p = await Product.findById(it.product._id);
      const price = p ? p.price : it.priceAtAdd;
      return {
        product: it.product._id,
        name: it.product.name,
        price,
        qty: it.qty,
        lineTotal: price * it.qty
      };
    })
  );

  const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
  const grandTotal = subtotal + Number(shipping) + Number(tax);

  const order = await Order.create({
    userId,
    items,
    totals: { subtotal, shipping: Number(shipping), tax: Number(tax), grandTotal },
    status: "pending",
    paymentStatus: "unpaid",
    address
  });

  cart.items = [];
  cart.subtotal = 0;
  await cart.save();

  res.status(201).json(order);
};

/** UPDATE ORDER STATUS/PAYMENT (admin-ish) */
export const updateOrderStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;
  const allowedStatus = ["pending", "processing", "completed", "cancelled"];
  const allowedPay = ["unpaid", "paid", "refunded"];

  const update = {};
  if (status) {
    if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Invalid status" });
    update.status = status;
  }
  if (paymentStatus) {
    if (!allowedPay.includes(paymentStatus)) return res.status(400).json({ message: "Invalid paymentStatus" });
    update.paymentStatus = paymentStatus;
  }

  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

/** DELETE ORDER */
export const deleteOrder = async (req, res) => {
  const result = await Order.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Order not found" });
  res.status(204).send();
};

/** NEW: VIEW PURCHASED PRODUCTS (flattened list) */
export const listPurchasedProducts = async (req, res) => {
  const userId = req.query.userId || getUserId(req);
  const orders = await Order.find({ userId, status: { $ne: "cancelled" } }).sort({ createdAt: -1 });

  const items = orders.flatMap((o) =>
    o.items.map((it) => ({
      orderId: o._id,
      productId: it.product,
      name: it.name,
      qty: it.qty,
      price: it.price,
      lineTotal: it.lineTotal,
      purchasedAt: o.createdAt
    }))
  );

  res.json(items);
};

/** NEW: CANCEL ORDER (customer) */
export const cancelOrder = async (req, res) => {
  const userId = getUserId(req);
  const order = await Order.findOne({ _id: req.params.id, userId });
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status === "completed") {
    return res.status(400).json({ message: "Completed orders cannot be cancelled" });
  }
  if (order.status === "cancelled") {
    return res.status(400).json({ message: "Order already cancelled" });
  }

  order.status = "cancelled";
  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded"; // logical refund marker
  }
  await order.save();
  res.json(order);
};
