const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');

const router = Router();

// ── Admin login (public) ──────────────────────────────────
router.post(
  '/admin/login',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ]),
  adminController.login
);

router.post(
  '/admin/google-login',
  adminController.googleLogin
);

// ── All routes below require admin authentication ─────────
router.use('/admin', authenticateAdmin);

// ── Products (admin CRUD) ─────────────────────────────────
router.get('/admin/products', productController.listAllProducts);

router.post(
  '/admin/products',
  validate([
    body('name').trim().notEmpty().withMessage('Product name is required.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be a positive number.'),
    body('original_price').optional({ nullable: true }).isFloat({ gt: 0 }).withMessage('original_price must be a positive number.'),
    body('discount_percent').optional({ nullable: true }).isFloat({ min: 0, max: 100 }).withMessage('discount_percent must be between 0 and 100.'),
    body('description').optional().trim(),
    body('image_path').optional().trim(),
    body('tag').optional().trim(),
    body('category_id').optional().isInt({ min: 1 }).withMessage('category_id must be a positive integer.'),
    body('is_available').optional().isBoolean().withMessage('is_available must be a boolean.'),
  ]),
  productController.createProduct
);

router.put(
  '/admin/products/:id',
  validate([
    body('name').trim().notEmpty().withMessage('Product name is required.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be a positive number.'),
    body('original_price').optional({ nullable: true }).isFloat({ gt: 0 }).withMessage('original_price must be a positive number.'),
    body('discount_percent').optional({ nullable: true }).isFloat({ min: 0, max: 100 }).withMessage('discount_percent must be between 0 and 100.'),
    body('description').optional().trim(),
    body('image_path').optional().trim(),
    body('tag').optional().trim(),
    body('category_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('category_id must be a positive integer.'),
    body('is_available').optional().isBoolean().withMessage('is_available must be a boolean.'),
  ]),
  productController.updateProduct
);

router.delete('/admin/products/:id', productController.deleteProduct);

// ── Categories (admin CRUD) ───────────────────────────────
router.get('/admin/categories', categoryController.listCategories);

router.post(
  '/admin/categories',
  validate([
    body('name').trim().notEmpty().withMessage('Category name is required.'),
    body('description').optional().trim(),
  ]),
  categoryController.createCategory
);

router.put(
  '/admin/categories/:id',
  validate([
    body('name').trim().notEmpty().withMessage('Category name is required.'),
    body('description').optional().trim(),
  ]),
  categoryController.updateCategory
);

router.delete('/admin/categories/:id', categoryController.deleteCategory);

// ── Orders (admin view / status management) ───────────────
router.get('/admin/orders', orderController.listAllOrders);
router.get('/admin/orders/:id', orderController.getOrderAdmin);

router.patch(
  '/admin/orders/:id/status',
  validate([
    body('status').trim().notEmpty().withMessage('Status is required.'),
  ]),
  orderController.updateOrderStatus
);

// ── Customers (admin view) ────────────────────────────────
router.get('/admin/customers', adminController.listCustomers);

module.exports = router;
