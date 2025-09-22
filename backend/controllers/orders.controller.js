import Order from "../models/Order.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    let { items, shipping, payment, total } = req.body;

    // If multipart/form-data: items/shipping/payment arrive as strings
    if (typeof items === "string") items = JSON.parse(items);
    if (typeof shipping === "string") shipping = JSON.parse(shipping);
    if (typeof payment === "string") payment = JSON.parse(payment);

    // If BANK_SLIP + file uploaded, attach file info to payment
    if (req.file) {
      payment = {
        ...(payment || {}),
        method: "BANK_SLIP",
        slipFileName: req.file.filename,
        slipUrl: `${req.protocol}://${req.get("host")}/uploads/slips/${req.file.filename}`,
      };
    }

    // Basic validation
    if (
      !shipping?.name ||
      !shipping?.address ||
      !shipping?.telephone ||
      !shipping?.city ||
      !shipping?.postalCode ||
      !shipping?.district
    ) {
      return res.status(400).json({ success: false, message: "Missing shipping fields" });
    }
    if (!payment?.method) {
      return res.status(400).json({ success: false, message: "Missing payment method" });
    }

    const order = await Order.create({
      items: items || [],
      shipping,
      payment,
      total: Number(total) || 0,
      status: "PENDING",
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW: PUT /api/orders/:id (update user-editable details)
export const updateOrder = async (req, res) => {
  try {
    let { items, shipping, payment, total } = req.body;

    // Parse JSON fields if multipart/form-data
    if (typeof items === "string") items = JSON.parse(items);
    if (typeof shipping === "string") shipping = JSON.parse(shipping);
    if (typeof payment === "string") payment = JSON.parse(payment);

    // If a new slip file provided, force method to BANK_SLIP and set slip fields
    if (req.file) {
      payment = {
        ...(payment || {}),
        method: "BANK_SLIP",
        slipFileName: req.file.filename,
        slipUrl: `${req.protocol}://${req.get("host")}/uploads/slips/${req.file.filename}`,
      };
    }

    const update = {};
    if (items) update.items = items;
    if (shipping) update.shipping = shipping;
    if (payment) update.payment = payment;

    // If total provided, use it; else if items provided, recompute
    if (typeof total !== "undefined") {
      update.total = Number(total) || 0;
    } else if (items) {
      const computed = (items || []).reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      );
      update.total = computed;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, order });
  } catch (err) {
    console.error("updateOrder error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders
export const listOrders = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = q
      ? {
          $or: [
            { "shipping.name": new RegExp(q, "i") },
            { "shipping.city": new RegExp(q, "i") },
            { "shipping.district": new RegExp(q, "i") },
            { "shipping.telephone": new RegExp(q, "i") },
          ],
        }
      : {};

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("listOrders error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:id
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("getOrder error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteOrder error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/orders/:id/status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["PENDING", "APPROVED", "REJECTED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
