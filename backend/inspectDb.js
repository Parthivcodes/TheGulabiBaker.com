require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./src/config/db');

async function inspect() {
  try {
    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.map(t => t.table_name));

    for (const t of tables) {
      const { rows: count } = await pool.query(`SELECT COUNT(*) FROM "${t.table_name}"`);
      console.log(`Table ${t.table_name}: ${count[0].count} rows`);
      if (t.table_name === 'products' || t.table_name === 'categories') {
        const { rows: data } = await pool.query(`SELECT * FROM "${t.table_name}" LIMIT 5`);
        console.log(`Sample data for ${t.table_name}:`, data);
      }
    }
  } catch (err) {
    console.error('Inspection error:', err);
  } finally {
    await pool.end();
  }
}

inspect();
