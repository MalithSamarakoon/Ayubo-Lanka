const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersbyid,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontroller");

// Routes

// Create order
router.post("/", (req, res, next) => {
  console.log("POST /api/order hit");
  createOrder(req, res, next);
});

// Get all orders
router.get("/", getOrders);

// Get order by ID
router.get("/:id", getOrdersbyid);

// Update order by ID
router.put("/:id", updateOrder);

// Delete order by ID
router.delete("/:id", deleteOrder);

module.exports = router;
