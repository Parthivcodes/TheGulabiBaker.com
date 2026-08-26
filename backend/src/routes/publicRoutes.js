const { Router } = require('express');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

const router = Router();

// ── Products (public browsing) ────────────────────────────
router.get('/products', productController.listProducts);
router.get('/products/:id', productController.getProduct);

// ── Categories (public browsing) ──────────────────────────
router.get('/categories', categoryController.listCategories);
router.get('/categories/:id', categoryController.getCategory);

module.exports = router;
