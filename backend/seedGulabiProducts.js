/**
 * Seed script to populate The Gulabi Baker categories and exact signature creations in PostgreSQL.
 * Location: Glen Eden, Auckland, New Zealand
 * Usage: node seedGulabiProducts.js
 */

require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./src/config/db');

const categories = [
  { name: 'Signature Cakes', slug: 'cakes', description: 'Handcrafted celebration cakes available in 5", 6", 7", 9", and 11/12" sizes.' },
  { name: 'Artisanal Cupcakes', slug: 'cupcakes', description: 'Standard handcrafted cupcakes baked fresh with pure NZ grass-fed butter.' }
];

const products = [
  {
    name: 'Gulab Jamun Cake',
    price: 70.00,
    tag: 'Signature Showpiece ⭐',
    image_path: 'assets/images/card_hero_gulab_jamun_3tier.jpg',
    description: 'A magnificent centerpiece layered with cardamom sponge, rosewater syrup, slow-simmered mawa cream, halved golden gulab jamuns, and 24k gold leaf. Available in 5" ($70), 6" ($85), 7" ($110), 9" ($160), and 12" ($220).',
    categoryName: 'Signature Cakes'
  },
  {
    name: 'Kesar Pista Cake',
    price: 80.00,
    tag: 'Royal Saffron & Pistachio',
    image_path: 'assets/images/card_kesar_pista_cake.jpg',
    description: 'Saffron-infused hung curd cream mousse, golden saffron streaks, roasted Iranian pistachios, and aromatic cardamom chiffon sponge. Available in 5" ($80), 6" ($100), 7" ($120), 9" ($170), and 12" ($240).',
    categoryName: 'Signature Cakes'
  },
  {
    name: 'Biscoff Fresh Cream Cake',
    price: 70.00,
    tag: 'Lotus Caramel Crunch',
    image_path: 'assets/images/card_biscoff_fresh_cream_cake.jpg',
    description: 'Layers of light vanilla sponge, Lotus Biscoff spread drip, caramelized speculoos cookie crunch, and whipped New Zealand fresh cream. Available in 5" ($70), 6" ($85), 7" ($110), 9" ($160), and 12" ($220).',
    categoryName: 'Signature Cakes'
  },
  {
    name: 'Masala Chai Cake',
    price: 65.00,
    tag: 'Spiced Chai & Parle-G',
    image_path: 'assets/images/card_masala_chai_cake.jpg',
    description: 'Infused with freshly crushed ginger, cinnamon, green cardamom, and rich Assam tea steeped in pure New Zealand dairy with Parle-G biscuits. Available in 5" ($65), 6" ($80), 7" ($100), 9" ($145), and 12" ($200).',
    categoryName: 'Signature Cakes'
  },
  {
    name: 'Rasmalai Cake',
    price: 75.00,
    tag: 'Best Seller ⭐',
    image_path: 'assets/images/card_rasmalai_cake_real.jpg',
    description: 'Cardamom-infused soft sponge layered with saffron rabdi cream, authentic soft rasmalai dumplings, pistachio flakes, and pure NZ butter. Available in 5" ($75), 6" ($95), 7" ($115), 9" ($165), and 12" ($230).',
    categoryName: 'Signature Cakes'
  },
  {
    name: 'Gulab Jamun Cupcake ⭐',
    price: 6.99,
    tag: 'Best Seller ⭐',
    image_path: 'assets/images/card_gulab_jamun_cupcakes.jpg',
    description: 'Handcrafted vanilla crumb crowned with authentic soft gulab jamun, rosewater mawa buttercream, pistachio dust, and 24k gold leaf.',
    categoryName: 'Artisanal Cupcakes'
  },
  {
    name: 'Rasmalai Cupcake ⭐',
    price: 6.99,
    tag: 'Best Seller ⭐',
    image_path: 'assets/images/ispahan_macarons.jpg',
    description: 'Cardamom sponge soaked in saffron milk, topped with whipped rabdi cream, soft rasmalai crumble, and toasted pistachios.',
    categoryName: 'Artisanal Cupcakes'
  },
  {
    name: 'Kesar Pista Shrikhand Cupcake',
    price: 7.50,
    tag: 'Royal Fusion',
    image_path: 'assets/images/chocolate_rose_dome.jpg',
    description: 'Cardamom sponge topped with saffron-infused hung curd mousse and roasted Iranian pistachios.',
    categoryName: 'Artisanal Cupcakes'
  },
  {
    name: 'Masala Chai Cupcake',
    price: 5.99,
    tag: 'Aromatic Spice',
    image_path: 'assets/images/masala_chai_cake.jpg',
    description: 'Spiced chai-infused sponge paired with ginger-cardamom buttercream and spiced biscuit crumble.',
    categoryName: 'Artisanal Cupcakes'
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to PostgreSQL to seed official menu items...');

    // 1. Insert Categories
    const categoryMap = {};
    for (const cat of categories) {
      let res = await pool.query('SELECT id FROM categories WHERE name = $1', [cat.name]);
      if (res.rows.length === 0) {
        res = await pool.query(
          'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
          [cat.name, cat.description]
        );
        console.log(`✓ Inserted Category: "${cat.name}" (ID: ${res.rows[0].id})`);
      } else {
        console.log(`Category "${cat.name}" exists (ID: ${res.rows[0].id})`);
      }
      categoryMap[cat.name] = res.rows[0].id;
    }

    // 2. Insert Products
    for (const prod of products) {
      const catId = categoryMap[prod.categoryName];
      const checkProd = await pool.query('SELECT id FROM products WHERE name = $1', [prod.name]);
      
      if (checkProd.rows.length === 0) {
        const insertRes = await pool.query(
          `INSERT INTO products (name, description, price, category_id, image_path, is_available)
           VALUES ($1, $2, $3, $4, $5, true) RETURNING id`,
          [prod.name, prod.description, prod.price, catId, prod.image_path]
        );
        console.log(`✓ Inserted product [ID: ${insertRes.rows[0].id}] ${prod.name} ($${prod.price.toFixed(2)})`);
      } else {
        await pool.query(
          `UPDATE products SET description = $1, price = $2, category_id = $3, image_path = $4, is_available = true WHERE id = $5`,
          [prod.description, prod.price, catId, prod.image_path, checkProd.rows[0].id]
        );
        console.log(`✓ Updated product [ID: ${checkProd.rows[0].id}] ${prod.name} ($${prod.price.toFixed(2)})`);
      }
    }

    console.log('✨ The Gulabi Baker Glen Eden menu successfully synchronized with PostgreSQL!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
