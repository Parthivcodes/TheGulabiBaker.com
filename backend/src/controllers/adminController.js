const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminQueries = require('../db/adminQueries');
const customerQueries = require('../db/customerQueries');

/**
 * POST /api/admin/login — authenticate an admin with email & password.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await adminQueries.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password_hash, ...safeAdmin } = admin;
    res.json({ admin: safeAdmin, token });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/google-login — authenticate an admin with Google.
 */
async function googleLogin(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required.' });

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const payload = await response.json();

    if (!response.ok || payload.error) {
      return res.status(401).json({ error: 'Invalid Google token.' });
    }

    const { email } = payload;
    const admin = await adminQueries.findByEmail(email);
    if (!admin) {
      return res.status(403).json({
        error: `Access denied. "${email}" is not registered as a bakery owner/admin.`,
      });
    }

    const jwtToken = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password_hash, ...safeAdmin } = admin;
    res.json({ admin: safeAdmin, token: jwtToken });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/customers — list all registered customers (admin).
 */
async function listCustomers(req, res, next) {
  try {
    const customers = await customerQueries.getAllCustomers();
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  googleLogin,
  listCustomers,
};

