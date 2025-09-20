import { Router } from "express";
import {
  listOrders,
  getOrder,
  checkoutFromCart,
  updateOrderStatus,
  deleteOrder,
  listPurchasedProducts,  // NEW
  cancelOrder             // NEW
} from "../controllers/orderController.js";

const router = Router();

// Checkout from cart
router.post("/checkout", checkoutFromCart);

// NEW: purchased products (flattened)
router.get("/purchased", listPurchasedProducts);

// Orders list / single
router.get("/", listOrders);
router.get("/:id", getOrder);

// Update status/payment
router.patch("/:id/status", updateOrderStatus);

// NEW: cancel order (customer)
router.post("/:id/cancel", cancelOrder);

// Delete order
router.delete("/:id", deleteOrder);

export default router;
