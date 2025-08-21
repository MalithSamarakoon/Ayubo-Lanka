const Order = require("../models/order");
const mongoose = require("mongoose");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { fname, lname, email, street, city, state, zipcode, tele } = req.body;

    if (!fname || !lname || !email || !street || !city || !zipcode || !tele) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const order = await Order.create({
      fname,
      lname,
      email,
      street,
      city,
      state,
      zipcode,
      tele,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
exports.getOrdersbyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order by ID
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const updatedData = req.body;

    const order = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json({ message: "Order deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
