const express=require("express")
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersbyid,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontroller");

// Routes
router.post("/", createOrder)
{
    console.log("POST /api/order hit");

}
router.get("/", getOrders);
router.get("/:id", getOrdersbyid);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
