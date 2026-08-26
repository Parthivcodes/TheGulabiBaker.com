const orderQueries = require('../db/orderQueries');
const productQueries = require('../db/productQueries');

/**
 * POST /api/orders — place a new order (customer).
 * Body: { items: [{ product_id, quantity }], delivery_address, notes? }
 */
async function placeOrder(req, res, next) {
  try {
    const { items, delivery_address, notes } = req.body;
    const customerId = req.customer.id;

    // Validate and look up each product to get current price
    const enrichedItems = [];
    for (const item of items) {
      const product = await productQueries.getProductById(item.product_id);
      if (!product) {
        return res.status(400).json({
          error: `Product with id ${item.product_id} not found.`,
        });
      }
      if (!product.is_available) {
        return res.status(400).json({
          error: `"${product.name}" is currently unavailable.`,
        });
      }
      enrichedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price, // snapshot the current price
      });
    }

    const order = await orderQueries.createOrder(
      customerId,
      delivery_address,
      notes,
      enrichedItems
    );

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders — list current customer's orders.
 */
async function listMyOrders(req, res, next) {
  try {
    const orders = await orderQueries.getOrdersByCustomerId(req.customer.id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id — get a specific order (customer owns it).
 */
async function getMyOrder(req, res, next) {
  try {
    const order = await orderQueries.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    // Ensure customer only sees their own orders
    if (order.customer_id !== req.customer.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/orders — list all orders (admin). Supports ?status= filter.
 */
async function listAllOrders(req, res, next) {
  try {
    const status = req.query.status || null;
    const orders = await orderQueries.getAllOrders(status);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/orders/:id — get full order details (admin).
 */
async function getOrderAdmin(req, res, next) {
  try {
    const order = await orderQueries.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/orders/:id/status — update order status (admin).
 * Body: { status: 'confirmed' | 'preparing' | ... }
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!orderQueries.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${orderQueries.VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await orderQueries.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  placeOrder,
  listMyOrders,
  getMyOrder,
  listAllOrders,
  getOrderAdmin,
  updateOrderStatus,
};
