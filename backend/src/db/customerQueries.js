const pool = require('../config/db');

/**
 * Find a customer by email (for login).
 */
async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, password_hash, address, created_at FROM customers WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return rows[0] || null;
}

/**
 * Find a customer by ID.
 */
async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, address, created_at FROM customers WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new customer.
 */
async function createCustomer({ name, email, phone, password_hash, address }) {
  const { rows } = await pool.query(
    `INSERT INTO customers (name, email, phone, password_hash, address)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, address, created_at`,
    [name, email, phone || null, password_hash, address || null]
  );
  return rows[0];
}

/**
 * Update customer profile (name, phone, address — not email or password here).
 */
async function updateCustomer(id, { name, phone, address }) {
  const { rows } = await pool.query(
    `UPDATE customers SET name = $1, phone = $2, address = $3 WHERE id = $4
     RETURNING id, name, email, phone, address, created_at`,
    [name, phone || null, address || null, id]
  );
  return rows[0] || null;
}

/**
 * Get all customers (admin view).
 */
async function getAllCustomers() {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, address, created_at FROM customers ORDER BY created_at DESC'
  );
  return rows;
}

module.exports = {
  findByEmail,
  findById,
  createCustomer,
  updateCustomer,
  getAllCustomers,
};
