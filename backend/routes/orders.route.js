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

const orderRouter = express.Router();

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
orderRouter.get("/", listOrders);
orderRouter.get("/:id", getOrder);

// ⚙️ Use upload.single("slip") for create and update to handle file uploads
orderRouter.post("/", upload.single("slip"), createOrder);
orderRouter.patch("/:id", upload.single("slip"), updateOrder);

orderRouter.delete("/:id", deleteOrder);

// ✅ Optional: update order status only
orderRouter.patch("/:id/status", updateStatus);

export default orderRouter;
