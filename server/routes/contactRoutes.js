const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/ContactQuery');
const { protectAdmin } = require('../middleware/auth');

// POST /api/contact — public, customer submits a general query or refund request
router.post('/', async (req, res) => {
  try {
    const { name, email, orderId, category, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const query = await ContactQuery.create({ name, email, orderId, category, message });
    res.status(201).json({ message: 'Thanks — we received your message and will get back to you soon.', query });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/contact/admin?category=Refund Request — admin only
router.get('/admin', protectAdmin, async (req, res) => {
  const { category, status } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  const queries = await ContactQuery.find(filter).sort({ createdAt: -1 });
  res.json(queries);
});

// PUT /api/contact/admin/:id — admin updates status/notes
router.put('/admin/:id', protectAdmin, async (req, res) => {
  const { status, adminNotes } = req.body;
  const query = await ContactQuery.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
    { new: true }
  );
  if (!query) return res.status(404).json({ message: 'Query not found' });
  res.json(query);
});

module.exports = router;
