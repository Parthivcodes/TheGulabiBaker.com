const jwt = require('jsonwebtoken');

/**
 * Middleware: authenticate a customer JWT.
 * Expects header: Authorization: Bearer <token>
 * Attaches req.customer = { id, email, role } on success.
 */
function authenticateCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied. Customer credentials required.' });
    }

    req.customer = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = authenticateCustomer;
