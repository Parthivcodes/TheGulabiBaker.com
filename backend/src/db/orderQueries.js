const pool = require('../config/db');

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

/**
 * Create an order with its items inside a transaction.
 * @param {number} customerId
 * @param {string} deliveryAddress
 * @param {string|null} notes
 * @param {{ product_id: number, quantity: number, unit_price: number }[]} items
 * @returns {object} The created order with its items
 */
async function createOrder(customerId, deliveryAddress, notes, items) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Insert order
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_id, total_amount, status, delivery_address, notes)
       VALUES ($1, $2, 'pending', $3, $4)
       RETURNING *`,
      [customerId, totalAmount.toFixed(2), deliveryAddress, notes || null]
    );
    const order = orderRows[0];

    // Insert order items
    const orderItems = [];
    for (const item of items) {
      const { rows } = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [order.id, item.product_id, item.quantity, item.unit_price]
      );
      orderItems.push(rows[0]);
    }

    await client.query('COMMIT');
    return { ...order, items: orderItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get all orders for a specific customer.
 */
async function getOrdersByCustomerId(customerId) {
  const { rows } = await pool.query(
    `SELECT id, customer_id, total_amount, status, delivery_address, notes, created_at, updated_at
     FROM orders
     WHERE customer_id = $1
     ORDER BY created_at DESC`,
    [customerId]
  );
  return rows;
}

/**
 * Get a single order by ID (with items).
 */
async function getOrderById(orderId) {
  const { rows: orderRows } = await pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  );
  if (orderRows.length === 0) return null;

  const order = orderRows[0];

  const { rows: itemRows } = await pool.query(
    `SELECT oi.id, oi.product_id, p.name AS product_name, p.image_path,
            oi.quantity, oi.unit_price
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return { ...order, items: itemRows };
}

/**
 * Get all orders (admin). Optionally filter by status.
 */
async function getAllOrders(status) {
  let query = `
    SELECT o.id, o.customer_id, c.name AS customer_name, c.email AS customer_email,
           o.total_amount, o.status, o.delivery_address, o.notes, o.created_at, o.updated_at
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
  `;
  const params = [];

  if (status) {
    params.push(status);
    query += ` WHERE o.status = $${params.length}`;
  }

  query += ' ORDER BY o.created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

/**
 * Update order status (admin).
 */
async function updateOrderStatus(orderId, status) {
  if (!VALID_STATUSES.includes(status)) {
    return null;
  }

  const { rows } = await pool.query(
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, orderId]
  );
  return rows[0] || null;
}

module.exports = {
  VALID_STATUSES,
  createOrder,
  getOrdersByCustomerId,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
