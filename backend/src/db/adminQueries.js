const pool = require('../config/db');

/**
 * Find an admin by email (for login).
 */
async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash, created_at FROM admins WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return rows[0] || null;
}

/**
 * Find an admin by ID.
 */
async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, created_at FROM admins WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Create an admin (used by seed script only — no public endpoint).
 */
async function createAdmin({ name, email, password_hash }) {
  const { rows } = await pool.query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, password_hash]
  );
  return rows[0];
}

module.exports = {
  findByEmail,
  findById,
  createAdmin,
};
