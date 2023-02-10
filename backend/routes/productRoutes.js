import express from 'express';
import { createProduct, createProductReview, deleteProduct, getTopProducts, updateProduct } from '../controllers/productController.js';
import { getProductByID, getProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//all products
router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/top').get(getTopProducts)

//single product
//delete product -->admin
router.route('/:id').get(getProductByID).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)


//review 
router.route('/:id/reviews').post(protect, createProductReview)

export default router;