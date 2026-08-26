require('dotenv').config();
const pool = require('./src/config/db');

async function fixPaths() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("UPDATE products SET image_path = '/Rasmalai2.0.png' WHERE name = 'Rasmalai Cake'");
    await client.query("UPDATE products SET image_path = '/Masalachaicake.png' WHERE name = 'Masala Chai Cake'");
    await client.query("UPDATE products SET image_path = '/Gulabjamuncupcake.png' WHERE name = 'Gulab Jamun Cupcake'");
    await client.query('COMMIT');
    console.log('Successfully updated image paths in database!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixPaths();
