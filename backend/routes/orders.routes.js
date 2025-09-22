import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  createOrder,
  listOrders,
  getOrder,
  deleteOrder,
  updateStatus,
  updateOrder, // NEW
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", listOrders);
router.get("/:id", getOrder);

// Create: JSON (COD) OR multipart (BANK_SLIP)
router.post("/", upload.single("slip"), createOrder);

// Update details: JSON OR multipart (if re-upload slip)
router.put("/:id", upload.single("slip"), updateOrder);

router.delete("/:id", deleteOrder);
router.patch("/:id/status", updateStatus);

export default router;
