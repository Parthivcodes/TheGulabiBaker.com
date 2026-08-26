const { validationResult } = require('express-validator');

/**
 * Middleware factory: runs express-validator checks and returns 400 on failure.
 * Usage:  router.post('/path', validate([body('email').isEmail(), ...]), controller)
 *
 * @param {import('express-validator').ValidationChain[]} validations
 */
function validate(validations) {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed.',
        details: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  };
}

module.exports = validate;
