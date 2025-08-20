import express from 'express';
import { createProduct, getAllProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/allProducts', getAllProducts);
router.get('/featuredProducts', getFeaturedProducts);

export default router;