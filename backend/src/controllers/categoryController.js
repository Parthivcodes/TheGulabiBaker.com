const categoryQueries = require('../db/categoryQueries');

/**
 * GET /api/categories — list all categories (public).
 */
async function listCategories(req, res, next) {
  try {
    const categories = await categoryQueries.getAllCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/categories/:id — get single category with its products (public).
 */
async function getCategory(req, res, next) {
  try {
    const category = await categoryQueries.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const products = await categoryQueries.getProductsByCategoryId(req.params.id);
    res.json({ category, products });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/categories — create category (admin).
 */
async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    const category = await categoryQueries.createCategory(name, description);
    res.status(201).json({ category });
  } catch (err) {
    // Unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A category with that name already exists.' });
    }
    next(err);
  }
}

/**
 * PUT /api/admin/categories/:id — update category (admin).
 */
async function updateCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    const category = await categoryQueries.updateCategory(req.params.id, name, description);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ category });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A category with that name already exists.' });
    }
    next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id — delete category (admin).
 */
async function deleteCategory(req, res, next) {
  try {
    const deleted = await categoryQueries.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
