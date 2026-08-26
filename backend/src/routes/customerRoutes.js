const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticateCustomer = require('../middleware/authenticateCustomer');
const customerController = require('../controllers/customerController');
const orderController = require('../controllers/orderController');

const router = Router();

// ── Auth (public) ─────────────────────────────────────────
router.post(
  '/customers/signup',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
  ]),
  customerController.signup
);

router.post(
  '/customers/login',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ]),
  customerController.login
);

router.post('/customers/google-login', customerController.googleLogin);

// ── Protected (customer JWT required) ─────────────────────
router.get('/customers/me', authenticateCustomer, customerController.getProfile);

router.put(
  '/customers/me',
  authenticateCustomer,
  validate([
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
  ]),
  customerController.updateProfile
);

router.post(
  '/orders',
  authenticateCustomer,
  validate([
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required.'),
    body('items.*.product_id')
      .isInt({ min: 1 })
      .withMessage('Each item must have a valid product_id.'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Each item must have a quantity of at least 1.'),
    body('delivery_address')
      .trim()
      .notEmpty()
      .withMessage('Delivery address is required.'),
    body('notes').optional().trim(),
  ]),
  orderController.placeOrder
);

router.get('/orders', authenticateCustomer, orderController.listMyOrders);
router.get('/orders/:id', authenticateCustomer, orderController.getMyOrder);

module.exports = router;
