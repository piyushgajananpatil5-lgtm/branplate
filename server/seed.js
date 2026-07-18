require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const AdminUser = require('./models/AdminUser');
const SiteSettings = require('./models/SiteSettings');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await Product.deleteMany();
  await Product.insertMany([
    {
      name: 'BranPlate Classic (Pack of 25)',
      description: '9-inch round wheat bran plates, everyday use. Fully biodegradable in 30–45 days.',
      price: 249,
      packSize: 'Pack of 25',
      images: [],
    },
    {
      name: 'BranPlate Classic (Pack of 50)',
      description: '9-inch round wheat bran plates. Holds hot curry & gravy for 2–3 hours.',
      price: 449,
      packSize: 'Pack of 50',
      images: [],
    },
    {
      name: 'BranPlate Bulk (Pack of 100)',
      description: 'Best value for events and caterers. Honeycomb structure for strength at low weight.',
      price: 799,
      packSize: 'Pack of 100',
      images: [],
    },
    {
      name: 'BranPlate Party Combo',
      description: 'Plates + bowls + cutlery, wheat bran, 20 sets. Everything you need in one pack.',
      price: 599,
      packSize: '20 sets',
      images: [],
    },
  ]);
  console.log('Products seeded.');

  const firstAdminEmail = (process.env.FIRST_ADMIN_EMAIL || '').toLowerCase();
  if (firstAdminEmail) {
    const exists = await AdminUser.findOne({ email: firstAdminEmail });
    if (!exists) {
      await AdminUser.create({ email: firstAdminEmail, role: 'owner' });
      console.log(`Whitelisted first admin: ${firstAdminEmail}. Visit /admin/signup to set a password.`);
    } else {
      console.log(`Admin ${firstAdminEmail} already exists.`);
    }
  } else {
    console.log('No FIRST_ADMIN_EMAIL set in .env — skipping admin whitelist seed.');
  }

  const settingsExists = await SiteSettings.findOne({ key: 'contact' });
  if (!settingsExists) {
    await SiteSettings.create({ key: 'contact' });
    console.log('Default site contact settings created.');
  }

  console.log('Seeding complete.');
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
