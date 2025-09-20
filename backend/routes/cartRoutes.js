// routes/cartRoutes.js
import { Router } from "express";
import { getCart, addItem, updateItemQty, removeItem, clearCart } from "../controllers/cartController.js";

const router = Router();

router.get("/", getCart);               // GET    /api/carts
router.post("/items", addItem);         // POST   /api/carts/items
router.patch("/items/:productId", updateItemQty); // PATCH  /api/carts/items/:productId
router.delete("/items/:productId", removeItem);   // DELETE /api/carts/items/:productId
router.delete("/", clearCart);          // DELETE /api/carts

export default router;
