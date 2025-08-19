const Order = require("../models/order");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { fname,lname, email,street,city,state,zipcode,tele } = req.body;
    if  (!fname || !lname || !email || !street || !city || !state || !zipcode || !tele)

      return res
        .status(400)
        .json({ message: "All required fields must be filled." });

    const order = await Patient.create({
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
    const order = await Order.find();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get order by numeric ID
exports.getOrdersbyid = async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order)
      return res.status(404).json({ message: "order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order by numeric ID
exports.updateOrder = async (req, res) => {
  try {
    const { fname,lname, email,street,city,state,zipcode,tele  } = req.body;
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { fname,lname, email,street,city,state,zipcode,tele  },
      { new: true, runValidators: true }
    );
    if (!order)
      return res.status(404).json({ message: "order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete patient by numeric ID
exports.deleteOrder= async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order)
      return res.status(404).json({ message: "order not found." });
    res.json({ message: "Order deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};