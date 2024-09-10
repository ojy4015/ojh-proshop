import express from 'express';
const router = express.Router();
// import asyncHandler from '../middleware/asyncHandler.js';
// import products from '../data/products.js';
// import Product from '../models/productModel.js';

// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     // res.status(200).json({ message: 'Welcome to the Support Desk API' });
//     const products = await Product.find({});
//     res.json(products);
//   })
// );

// router.get(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     // const product = products.find((p) => p._id === req.params.id);
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       return res.json(product);
//     } else {
//       res.status(404);
//       throw new Error('Resource not found');
//     }

//     // res.status(404).json({ message: 'Product not found' });
//   })
// );

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  createProductReview,
  getProductReviews,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
// import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id/reviews')
  .post(protect, createProductReview)
  .get(getProductReviews);
// router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  //   .get(checkObjectId, getProductById)
  //   .put(protect, admin, checkObjectId, updateProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
// .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
