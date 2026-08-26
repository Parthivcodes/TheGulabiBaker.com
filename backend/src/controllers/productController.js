const productQueries = require('../db/productQueries');

/**
 * GET /api/products — list available products (public). Supports ?category_id= filter.
 */
async function listProducts(req, res, next) {
  try {
    const categoryId = req.query.category_id || null;
    const products = await productQueries.getAvailableProducts(categoryId);
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id — get single product (public).
 */
async function getProduct(req, res, next) {
  try {
    const product = await productQueries.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products — list ALL products including unavailable (admin).
 */
async function listAllProducts(req, res, next) {
  try {
    const products = await productQueries.getAllProducts();
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products — create product (admin).
 */
async function createProduct(req, res, next) {
  try {
    const product = await productQueries.createProduct(req.body);
    res.status(201).json({ product });
  } catch (err) {
    // FK violation (invalid category_id)
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Invalid category_id. Category does not exist.' });
    }
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id — update product (admin).
 */
async function updateProduct(req, res, next) {
  try {
    const product = await productQueries.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Invalid category_id. Category does not exist.' });
    }
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id — delete product (admin).
 */
async function deleteProduct(req, res, next) {
  try {
    const deleted = await productQueries.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  listAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
