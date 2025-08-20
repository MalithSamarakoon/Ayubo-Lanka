import express from 'express';
import { createProduct, getAllProducts, getFeaturedProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/allProducts', getAllProducts);
router.get('/featuredProducts', getFeaturedProducts);
router.patch('/:id', updateProduct)

export default router;