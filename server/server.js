const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

// Accepts CLIENT_URL exactly (your custom domain / primary Vercel domain)
// plus any Vercel preview or deployment-alias URL for this project
const vercelProjectPattern = /^https:\/\/branplate-q6sx(-[a-z0-9]+)*-thelegend9\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser requests
    const allowed =
      origin === process.env.CLIENT_URL ||
      vercelProjectPattern.test(origin);
    callback(allowed ? null : new Error(`CORS blocked for origin: ${origin}`), allowed);
  }
}));
