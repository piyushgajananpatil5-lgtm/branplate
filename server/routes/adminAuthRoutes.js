const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const { protectAdmin } = require('../middleware/auth');

const signAdminToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// POST /api/admin/auth/signup
// Only works if the email was already added to the whitelist (by seed script or an existing admin).
// Sets the password for that whitelist entry the first time.
router.post('/signup', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email.endsWith('@gmail.com') || password.length < 6) {
      return res.status(400).json({ message: 'A valid Gmail address and password of at least 6 characters are required.' });
    }
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(403).json({ message: 'This email is not on the admin whitelist. Ask an existing admin to add it first.' });
    }
    if (admin.password) {
      return res.status(400).json({ message: 'This admin account already has a password. Please log in instead.' });
    }
    admin.password = password;
    await admin.save();
    res.status(201).json({ token: signAdminToken(admin), admin: { email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email: (email || '').toLowerCase(), isActive: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }
    res.json({ token: signAdminToken(admin), admin: { email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/auth/me
router.get('/me', protectAdmin, async (req, res) => {
  const admin = await AdminUser.findById(req.admin.id).select('-password');
  res.json(admin);
});

// GET /api/admin/auth/admins — list whitelist (admin only)
router.get('/admins', protectAdmin, async (req, res) => {
  const admins = await AdminUser.find().select('-password');
  res.json(admins);
});

// POST /api/admin/auth/admins — add a new Gmail address to the whitelist (admin only)
router.post('/admins', protectAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Please provide a valid Gmail address' });
    }
    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'This email is already an admin' });

    const newAdmin = await AdminUser.create({ email: email.toLowerCase() });
    res.status(201).json({ message: 'Admin invited. They can now sign up with this Gmail address.', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/auth/admins/:id — revoke an admin
router.delete('/admins/:id', protectAdmin, async (req, res) => {
  await AdminUser.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Admin access revoked' });
});

module.exports = router;
