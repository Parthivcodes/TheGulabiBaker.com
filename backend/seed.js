/**
 * Seed script — creates the 3 bakery owner admin accounts in PostgreSQL.
 *
 * Usage:
 *   node seed.js
 */

require('dotenv').config();

const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const SALT_ROUNDS = 12;

const OWNERS = [
  {
    name: 'Parthiv Nanavati',
    email: 'parthivnanavati7@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'GulabiOwner@2026',
  },
  {
    name: 'Devanshi Nanavati',
    email: 'devanshi.nanavati28@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'GulabiOwner@2026',
  },
  {
    name: 'Deep Purohit',
    email: 'deep.purohit7195@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'GulabiOwner@2026',
  },
];

async function seed() {
  try {
    console.log('--- Seeding Bakery Owner Admins ---');

    for (const owner of OWNERS) {
      const emailLower = owner.email.toLowerCase().trim();
      
      const { rows: existing } = await pool.query(
        'SELECT id, name, email FROM admins WHERE LOWER(email) = LOWER($1)',
        [emailLower]
      );

      if (existing.length > 0) {
        console.log(`✓ Admin "${owner.name}" (${emailLower}) already exists (ID: ${existing[0].id}).`);
      } else {
        const password_hash = await bcrypt.hash(owner.password, SALT_ROUNDS);
        const { rows } = await pool.query(
          `INSERT INTO admins (name, email, password_hash)
           VALUES ($1, $2, $3)
           RETURNING id, name, email, created_at`,
          [owner.name, emailLower, password_hash]
        );
        console.log(`+ Created Admin "${owner.name}" (${emailLower}) - ID: ${rows[0].id}`);
      }
    }

    console.log('--- All 3 Owners Configured Successfully! ---');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();

