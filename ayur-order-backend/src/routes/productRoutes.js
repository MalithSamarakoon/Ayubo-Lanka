import { Router } from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  patchProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = Router();

router.post("/", createProduct);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;
