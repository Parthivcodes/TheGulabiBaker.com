/**
 * Seed script to populate initial categories and products in the database.
 * Usage: node seedProducts.js
 */

require('dotenv').config();
const pool = require('./src/config/db');

const categories = [
  { name: 'Cakes', description: 'Delicious slow-baked custom and classic cakes.' },
  { name: 'Cupcakes', description: 'Tiny bites of bliss with beautiful frosting.' },
  { name: 'Tarts', description: 'Buttery crusts filled with premium ingredients.' },
  { name: 'Buns', description: 'Warm, twisty, and fragrant morning pastries.' }
];

const products = [
  {
    name: 'Gulabi Rose Cake',
    price: 850.00,
    tag: 'Best seller',
    image_path: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85',
    description: 'Vanilla sponge, rose cream, and a little pink magic.',
    categoryName: 'Cakes'
  },
  {
    name: 'Pista Cloud Cupcake',
    price: 180.00,
    tag: 'New',
    image_path: 'https://images.unsplash.com/photo-1576618148400-a4e48c2d2f0a?auto=format&fit=crop&w=900&q=85',
    description: 'Pistachio buttercream perched on a tender crumb.',
    categoryName: 'Cupcakes'
  },
  {
    name: 'Mango Mawa Tart',
    price: 420.00,
    tag: 'Seasonal',
    image_path: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=85',
    description: 'Buttery shortcrust, saffron mawa, sunshine-ripe mango.',
    categoryName: 'Tarts'
  },
  {
    name: 'Cardamom Bun',
    price: 160.00,
    tag: 'Morning pick',
    image_path: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85',
    description: 'Twisty, gooey, and fragrant with green cardamom.',
    categoryName: 'Buns'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert categories
    const categoryIds = {};
    for (const cat of categories) {
      // Check if exists
      const { rows: existing } = await client.query(
        'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
        [cat.name]
      );
      if (existing.length > 0) {
        categoryIds[cat.name] = existing[0].id;
        console.log(`Category "${cat.name}" already exists.`);
      } else {
        const { rows } = await client.query(
          'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
          [cat.name, cat.description]
        );
        categoryIds[cat.name] = rows[0].id;
        console.log(`Created category "${cat.name}".`);
      }
    }

    // 2. Insert products
    for (const prod of products) {
      const { rows: existing } = await client.query(
        'SELECT id FROM products WHERE LOWER(name) = LOWER($1)',
        [prod.name]
      );
      if (existing.length > 0) {
        console.log(`Product "${prod.name}" already exists.`);
      } else {
        const catId = categoryIds[prod.categoryName] || null;
        await client.query(
          `INSERT INTO products (name, price, tag, image_path, description, category_id, is_available)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [prod.name, prod.price, prod.tag, prod.image_path, prod.description, catId]
        );
        console.log(`Created product "${prod.name}".`);
      }
    }

    await client.query('COMMIT');
    console.log('Product/Category seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed products/categories:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
