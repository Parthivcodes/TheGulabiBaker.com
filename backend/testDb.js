require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./src/config/db');

pool.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.error('PostgreSQL Connection Error:', err.message);
  } else {
    console.log('PostgreSQL Connected Successfully:', res.rows[0]);
  }
  pool.end();
});
