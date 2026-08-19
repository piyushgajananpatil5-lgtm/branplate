require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = new Set([
  'https://www.thelegend5.com',
  'https://thelegend5.com',
  'https://branplate.vercel.app',
  'https://branplate-git-main-thelegend9.vercel.app'
]);
const corsOptions = {
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS')
    return res.sendStatus(204);
  next();
});
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mongoConnected: true });
});

app.get('/api/admin/auth/signup', (_req, res) => {
  res.status(405).json({ message: 'Use POST /api/admin/auth/signup to set an admin password.' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

app.use((err, _req, res, _next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

connectDB().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`BranPlate API running on port ${port}`);
  });
});
