/**
 * Centralized error-handling middleware.
 * Must be registered AFTER all routes (Express identifies error handlers by 4-arg signature).
 */
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  // Validation errors from express-validator don't reach here (handled in validate.js),
  // but if something slips through:
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body.' });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
