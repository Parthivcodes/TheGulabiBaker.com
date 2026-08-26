const pool = require('../config/db');

/**
 * Get all categories.
 */
async function getAllCategories() {
  const { rows } = await pool.query(
    'SELECT id, name, description, created_at FROM categories ORDER BY name ASC'
  );
  return rows;
}

/**
 * Get a single category by ID.
 */
async function getCategoryById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, description, created_at FROM categories WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Get all products belonging to a category.
 */
async function getProductsByCategoryId(categoryId) {
  const { rows } = await pool.query(
    `SELECT id, name, description, price, image_path, tag, category_id, is_available, created_at
     FROM products
     WHERE category_id = $1 AND is_available = TRUE
     ORDER BY created_at DESC`,
    [categoryId]
  );
  return rows;
}

/**
 * Create a new category.
 */
async function createCategory(name, description) {
  const { rows } = await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null]
  );
  return rows[0];
}

/**
 * Update a category.
 */
async function updateCategory(id, name, description) {
  const { rows } = await pool.query(
    `UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description || null, id]
  );
  return rows[0] || null;
}

/**
 * Delete a category by ID.
 */
async function deleteCategory(id) {
  const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getProductsByCategoryId,
  createCategory,
  updateCategory,
  deleteCategory,
};
