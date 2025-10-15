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


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/receipts/"), 
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


orderRouter.get("/", listOrders);
orderRouter.get("/:id", getOrder);


orderRouter.post("/", upload.single("slip"), createOrder);
orderRouter.patch("/:id", upload.single("slip"), updateOrder);

orderRouter.delete("/:id", deleteOrder);


orderRouter.patch("/:id/status", updateStatus);

export default orderRouter;
