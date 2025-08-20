import express from 'express';
import { createProduct, getAllProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/allproducts', getAllProducts)

export default router;