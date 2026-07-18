const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// ---- API Reference ----
// Auth (customer):   POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
// Admin auth:         POST /api/admin/auth/signup, POST /api/admin/auth/login,
//                      GET /api/admin/auth/admins, POST /api/admin/auth/admins, DELETE /api/admin/auth/admins/:id
// Products:           GET /api/products, GET /api/products/:id, GET /api/products/admin/all,
//                      POST /api/products, PUT /api/products/:id, DELETE /api/products/:id
// Orders:             POST /api/orders, GET /api/orders/mine, GET /api/orders/:id,
//                      GET /api/orders/admin/all?type=completed|incomplete, PUT /api/orders/admin/:id/status
// Contact/Refunds:    POST /api/contact, GET /api/contact/admin, PUT /api/contact/admin/:id
// Settings:           GET /api/settings/contact, PUT /api/settings/contact

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

app.get('/', (req, res) => res.send('BranPlate API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BranPlate server running on port ${PORT}`));
