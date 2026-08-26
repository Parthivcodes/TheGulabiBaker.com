/**
 * Script to set or update any Admin / Owner password in PostgreSQL.
 *
 * Usage:
 *   node setAdminPassword.js <email> <password>
 *
 * Example:
 *   node setAdminPassword.js parthivnanavati7@gmail.com MySecretPass123
 *
 * If run without arguments, it resets all 3 owners to a clean default password:
 *   parthivnanavati7@gmail.com  -> Gulabi@123
 *   devanshi.nanavati28@gmail.com -> Gulabi@123
 *   deep.purohit7195@gmail.com  -> Gulabi@123
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const SALT_ROUNDS = 12;

async function updatePassword() {
  const args = process.argv.slice(2);
  const targetEmail = args[0]?.toLowerCase().trim();
  const targetPassword = args[1];

  try {
    if (targetEmail && targetPassword) {
      const hash = await bcrypt.hash(targetPassword, SALT_ROUNDS);
      const res = await pool.query(
        'UPDATE admins SET password_hash = $1 WHERE LOWER(email) = LOWER($2) RETURNING id, name, email',
        [hash, targetEmail]
      );
      if (res.rows.length === 0) {
        console.log(`❌ No admin found with email "${targetEmail}".`);
      } else {
        console.log(`✅ Password successfully updated for ${res.rows[0].name} (${res.rows[0].email})!`);
      }
    } else {
      // Default: set known passwords for all 3 owners
      const defaultPassword = 'GulabiOwner@123';
      const owners = [
        'parthivnanavati7@gmail.com',
        'devanshi.nanavati28@gmail.com',
        'deep.purohit7195@gmail.com',
      ];

      console.log(`Updating passwords for all 3 owners to: "${defaultPassword}"...`);
      for (const email of owners) {
        const hash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
        const res = await pool.query(
          'UPDATE admins SET password_hash = $1 WHERE LOWER(email) = LOWER($2) RETURNING id, name, email',
          [hash, email]
        );
        if (res.rows.length > 0) {
          console.log(`✅ ${res.rows[0].name} (${res.rows[0].email}) -> password updated!`);
        }
      }
    }
  } catch (err) {
    console.error('Failed to update password:', err.message);
  } finally {
    await pool.end();
  }
}

updatePassword();
