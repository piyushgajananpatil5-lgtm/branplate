const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, protectAdmin } = require('../middleware/auth');

// POST /api/orders — customer places an order
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Cart is empty' });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 49;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user.id,
      items,
      subtotal,
      shipping,
      total,
      address,
      paymentMethod: paymentMethod || 'COD',
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/mine — customer's own orders
router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id — a single order (owner only)
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// ----- Admin routes -----

// GET /api/orders/admin/all?type=completed|incomplete
router.get('/admin/all', protectAdmin, async (req, res) => {
  const { type } = req.query;
  let filter = {};
  if (type === 'completed') filter = { status: { $in: Order.COMPLETED_STATUSES } };
  if (type === 'incomplete') filter = { status: { $nin: Order.COMPLETED_STATUSES } };

  const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/admin/:id/status — update delivery status
router.put('/admin/:id/status', protectAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['Order Placed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

module.exports = router;
