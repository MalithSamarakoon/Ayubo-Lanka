const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersbyid,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontroller");


router.post("/", createOrder);


router.get("/", getOrders);


router.get("/:id", getOrdersbyid);


router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;