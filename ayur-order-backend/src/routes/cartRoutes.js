import { Router } from "express";
import { getCart, addItem, updateItemQty, removeItem, clearCart } from "../controllers/cartController.js";

const router = Router();

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:productId", updateItemQty);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

export default router;
