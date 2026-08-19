const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protectAdmin } = require('../middleware/auth');

// GET /api/settings/contact — public
router.get('/contact', async (req, res) => {
  let settings = await SiteSettings.findOne({ key: 'contact' });
  if (!settings) settings = await SiteSettings.create({ key: 'contact' });
  res.json(settings);
});

// PUT /api/settings/contact — admin only
router.put('/contact', protectAdmin, async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'contact' }, req.body, {
    new: true,
    upsert: true,
  });
  res.json(settings);
});

module.exports = router;
