const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const customerQueries = require('../db/customerQueries');
const adminQueries = require('../db/adminQueries');

const SALT_ROUNDS = 12;

// Helper to check if email is an admin
async function getAdminTokenIfAdmin(email) {
  const admin = await adminQueries.findByEmail(email);
  if (!admin) return null;
  return {
    admin: { id: admin.id, name: admin.name, email: admin.email },
    adminToken: jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    ),
  };
}

/**
 * POST /api/customers/signup — register a new customer.
 */
async function signup(req, res, next) {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if email already taken
    const existing = await customerQueries.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const customer = await customerQueries.createCustomer({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password_hash,
      address,
    });

    // Check if admin
    const adminData = await getAdminTokenIfAdmin(customer.email);

    // Issue JWT
    const token = jwt.sign(
      { id: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_CUSTOMER_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      customer: {
        ...customer,
        isAdmin: !!adminData,
      },
      token,
      adminToken: adminData?.adminToken || null,
      adminInfo: adminData?.admin || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/customers/login — authenticate a customer.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const customer = await customerQueries.findByEmail(email);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_CUSTOMER_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const adminData = await getAdminTokenIfAdmin(customer.email);

    // Don't return password_hash
    const { password_hash, ...safeCustomer } = customer;
    res.json({
      customer: {
        ...safeCustomer,
        isAdmin: !!adminData,
      },
      token,
      adminToken: adminData?.adminToken || null,
      adminInfo: adminData?.admin || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/customers/me — get current customer's profile.
 */
async function getProfile(req, res, next) {
  try {
    const customer = await customerQueries.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    const adminData = await getAdminTokenIfAdmin(customer.email);
    res.json({
      customer: {
        ...customer,
        isAdmin: !!adminData,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/customers/me — update current customer's profile.
 */
async function updateProfile(req, res, next) {
  try {
    const { name, phone, address } = req.body;
    const customer = await customerQueries.updateCustomer(req.customer.id, {
      name,
      phone,
      address,
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    const adminData = await getAdminTokenIfAdmin(customer.email);
    res.json({
      customer: {
        ...customer,
        isAdmin: !!adminData,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required.' });
    }

    // Verify token with Google's endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const payload = await response.json();

    if (!response.ok || payload.error) {
      return res.status(401).json({ error: 'Invalid Google token.' });
    }

    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account does not provide an email.' });
    }

    // Check if customer already exists in PostgreSQL
    let customer = await customerQueries.findByEmail(email);
    
    if (!customer) {
      // Create new customer with a random password hash
      const randomPassword = Math.random().toString(36).slice(-10);
      const password_hash = await bcrypt.hash(randomPassword, SALT_ROUNDS);
      customer = await customerQueries.createCustomer({
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        password_hash,
        phone: null,
        address: null,
      });
    }

    // Issue JWT
    const jwtToken = jwt.sign(
      { id: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_CUSTOMER_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const adminData = await getAdminTokenIfAdmin(customer.email);

    const { password_hash, ...safeCustomer } = customer;
    res.json({
      customer: {
        ...safeCustomer,
        isAdmin: !!adminData,
      },
      token: jwtToken,
      adminToken: adminData?.adminToken || null,
      adminInfo: adminData?.admin || null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
  googleLogin,
  getProfile,
  updateProfile,
};

