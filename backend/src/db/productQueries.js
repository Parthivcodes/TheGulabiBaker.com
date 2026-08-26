const pool = require('../config/db');

/**
 * Get all available products (public). Optionally filter by category.
 */
async function getAvailableProducts(categoryId) {
  let query = `
    SELECT p.id, p.name, p.description, p.price, p.original_price, p.discount_percent,
           p.image_path, p.tag, p.category_id, c.name AS category_name, p.is_available, p.created_at
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_available = TRUE
  `;
  const params = [];

  if (categoryId) {
    params.push(categoryId);
    query += ` AND p.category_id = $${params.length}`;
  }

  query += ' ORDER BY p.created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

/**
 * Get ALL products (admin view — includes unavailable).
 */
async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT p.id, p.name, p.description, p.price, p.original_price, p.discount_percent,
           p.image_path, p.tag, p.category_id, c.name AS category_name, p.is_available, p.created_at, p.updated_at
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC
  `);
  return rows;
}

/**
 * Get a single product by ID.
 */
async function getProductById(id) {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.original_price, p.discount_percent,
            p.image_path, p.tag, p.category_id, c.name AS category_name, p.is_available, p.created_at, p.updated_at
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new product.
 */
async function createProduct({ name, description, price, original_price, discount_percent, image_path, tag, category_id, is_available }) {
  const { rows } = await pool.query(
    `INSERT INTO products (name, description, price, original_price, discount_percent, image_path, tag, category_id, is_available)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      name,
      description || null,
      price,
      original_price || null,
      discount_percent || null,
      image_path || null,
      tag || null,
      category_id || null,
      is_available !== false,
    ]
  );
  return rows[0];
}

/**
 * Update a product.
 */
async function updateProduct(id, { name, description, price, original_price, discount_percent, image_path, tag, category_id, is_available }) {
  const { rows } = await pool.query(
    `UPDATE products
     SET name = $1, description = $2, price = $3, original_price = $4, discount_percent = $5,
         image_path = $6, tag = $7, category_id = $8, is_available = $9, updated_at = NOW()
     WHERE id = $10
     RETURNING *`,
    [
      name,
      description || null,
      price,
      original_price || null,
      discount_percent || null,
      image_path || null,
      tag || null,
      category_id || null,
      is_available,
      id,
    ]
  );
  return rows[0] || null;
}

/**
 * Delete a product.
 */
async function deleteProduct(id) {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  getAvailableProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
