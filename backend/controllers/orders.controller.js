import Order from "../models/Order.js";
import ayurvedicProduct from "../models/product.model.js";
import { sendRestockNotificationEmail } from "../mailer.js";

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
        slipUrl: `${req.protocol}://${req.get("host")}/uploads/receipts/${req.file.filename}`,
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

    // Validate items exist
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    // Check stock availability for all items first (before any updates)
    for (const item of items) {
      const product = await ayurvedicProduct.findById(item.id || item._id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product "${item.name}" not found in inventory` 
        });
      }
      
      if (product.stock < item.qty) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.qty}` 
        });
      }
    }

    // If all stock checks pass, then decrement stock
    for (const item of items) {
      const updatedProduct = await ayurvedicProduct.findByIdAndUpdate(
        item.id || item._id,
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      // Check if stock has fallen to or below minimum threshold
      if (updatedProduct && updatedProduct.stock <= updatedProduct.minimumStock) {
        // Send restock notification email asynchronously (don't wait for it)
        sendRestockNotificationEmail(
          updatedProduct.name,
          updatedProduct.stock,
          updatedProduct.minimumStock,
          updatedProduct._id.toString()
        ).catch(err => {
          // Log error but don't interrupt the order process
          console.error(`Failed to send restock email for ${updatedProduct.name}:`, err.message);
        });
      }
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
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    
    // Restore stock when order is deleted/cancelled
    for (const item of order.items) {
      await ayurvedicProduct.findByIdAndUpdate(
        item.id,
        { $inc: { stock: item.qty } }, // Add back the quantity
        { new: true }
      );
    }
    
    await Order.findByIdAndDelete(req.params.id);
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

    // Get the current order first to check its current status
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // If changing to REJECTED and wasn't already REJECTED, restore stock
    if (status === "REJECTED" && order.status !== "REJECTED") {
      for (const item of order.items) {
        await ayurvedicProduct.findByIdAndUpdate(
          item.id,
          { $inc: { stock: item.qty } },  // Add back the quantity
          { new: true }
        );
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
