import express from 'express';
import { createProduct, getAllProducts, getFeaturedProducts, updateProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/addProduct', createProduct);
router.get('/allProducts', getAllProducts);
router.get('/featuredProducts', getFeaturedProducts);
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct);

export default router;