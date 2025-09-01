import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/addProduct", createProduct);
productRouter.get("/allProducts", getAllProducts);
productRouter.get("/featuredProducts", getFeaturedProducts);
productRouter.patch("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
