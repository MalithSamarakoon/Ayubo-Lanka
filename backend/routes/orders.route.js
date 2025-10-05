
import express from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/", listOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);

router.patch("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;
