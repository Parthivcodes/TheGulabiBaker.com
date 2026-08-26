/**
 * Update products in PostgreSQL database to match current frontend products, dollar pricing, and images.
 */
require('dotenv').config();
const pool = require('./src/config/db');

const updatedProducts = [
  {
    name: 'Rasmalai Cake',
    price: 300.00,
    tag: 'Best seller',
    image_path: '/Rasmalai 2.0.png',
    description: 'Cardamom infused sponge layered with saffron cream and authentic rasmalai rabdi.',
    categoryName: 'Cakes'
  },
  {
    name: 'Masala Chai Cake',
    price: 280.00,
    tag: 'Signature',
    image_path: '/Masal chai cake.png',
    description: 'A moist and fragrant cake infused with the warm, aromatic spices of Indian chai.',
    categoryName: 'Cakes'
  },
  {
    name: 'Gulab Jamun Cupcake',
    price: 250.00,
    tag: 'New',
    image_path: '/Gulabjamuncupcake.png',
    description: 'A rich and moist cupcake infused with the irresistible flavors of Gulab Jamun.',
    categoryName: 'Cupcakes'
  },
  {
    name: 'Mango Mawa Tart',
    price: 180.00,
    tag: 'Seasonal',
    image_path: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=85',
    description: 'Buttery shortcrust pastry, slow-cooked saffron mawa, and sunshine-ripe Alphonso mangoes.',
    categoryName: 'Tarts'
  },
  {
    name: 'Cardamom Bun',
    price: 90.00,
    tag: 'Morning pick',
    image_path: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85',
    description: 'Twisty, caramelized, buttery dough fragrant with crushed green cardamom.',
    categoryName: 'Buns'
  }
];

async function updateDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Wipe and re-insert
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM products');

    for (const prod of updatedProducts) {
      // Find category
      const { rows: catRows } = await client.query(
        'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
        [prod.categoryName]
      );
      const catId = catRows.length > 0 ? catRows[0].id : null;

      await client.query(
        `INSERT INTO products (name, price, tag, image_path, description, category_id, is_available)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
        [prod.name, prod.price, prod.tag, prod.image_path, prod.description, catId]
      );
      console.log(`Synced product "${prod.name}" ($${prod.price}) with image "${prod.image_path}".`);
    }

    await client.query('COMMIT');
    console.log('Database updated successfully with dollar prices!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error syncing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

updateDb();
