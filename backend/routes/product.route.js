import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  toggleFeaturedProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/addProduct", createProduct);
productRouter.get("/allProducts", getAllProducts);
productRouter.get("/featuredProducts", getFeaturedProducts);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id/toggleFeatured", toggleFeaturedProduct);
productRouter.patch("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
