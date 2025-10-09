import express from "express";
import multer from "multer";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  updateStatus,
} from "../controllers/orders.controller.js";

const router = express.Router();

// ✅ Setup multer for slip uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/receipts/"), // folder for bank slips
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ CRUD routes
router.get("/", listOrders);
router.get("/:id", getOrder);

// ⚙️ Use upload.single("slip") for create and update to handle file uploads
router.post("/", upload.single("slip"), createOrder);
router.patch("/:id", upload.single("slip"), updateOrder);

router.delete("/:id", deleteOrder);

// ✅ Optional: update order status only
router.patch("/:id/status", updateStatus);

export default router;
