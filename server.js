import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { Admin, Impact, Inquiry, Order, Plate, SystemConfig, User } from './src/models.js';
import { INITIAL_ADMINS, INITIAL_CONFIG, INITIAL_IMPACT, INITIAL_INQUIRIES, INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_USERS } from './server/seed.js';
const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
    throw new Error('MONGO_URI is required. Keep using your existing MongoDB Atlas cluster by setting MONGO_URI in the server environment.');
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is required.');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function getToken(req) {
    const header = req.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : null;
}
function auth(req, res, next) {
    const token = getToken(req);
    if (!token)
        return res.status(401).json({ success: false, message: 'Authentication required' });
    try {
        res.locals.auth = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch {
        return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
    }
}
async function adminAuth(req, res, next) {
    auth(req, res, async () => {
        const a = res.locals.auth;
        if (a.type !== 'admin')
            return res.status(403).json({ success: false, message: 'Administrator access required' });
        const admin = await Admin.findById(a.sub);
        if (!admin || admin.status !== 'active')
            return res.status(403).json({ success: false, message: 'Administrator access revoked' });
        res.locals.admin = admin;
        next();
    });
}
function hasPermission(permission) {
    return (req, res, next) => {
        const admin = res.locals.admin;
        if (admin?.role === 'super_admin' || admin?.permissions?.includes(permission))
            return next();
        return res.status(403).json({ success: false, message: `Missing permission: ${permission}` });
    };
}
function publicConfig(doc) {
    return {
        clientUrl: doc?.clientUrl ?? INITIAL_CONFIG.clientUrl,
        customDomain: doc?.customDomain ?? INITIAL_CONFIG.customDomain,
        firstAdminEmail: doc?.firstAdminEmail ?? INITIAL_CONFIG.firstAdminEmail,
        brandName: doc?.brandName ?? INITIAL_CONFIG.brandName,
        tagline: doc?.tagline ?? INITIAL_CONFIG.tagline,
        region: doc?.region ?? INITIAL_CONFIG.region,
        contactPhone: doc?.contactPhone ?? INITIAL_CONFIG.contactPhone,
        contactEmail: doc?.contactEmail ?? INITIAL_CONFIG.contactEmail,
        contactAddress: doc?.contactAddress ?? INITIAL_CONFIG.contactAddress,
        contactHours: doc?.contactHours ?? INITIAL_CONFIG.contactHours,
        gstinNumber: doc?.gstinNumber ?? INITIAL_CONFIG.gstinNumber
    };
}
function withId(doc) {
    if (!doc)
        return doc;
    return { ...doc, id: doc.id || String(doc._id) };
}
async function seedDatabase() {
    const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    const customerPassword = process.env.CUSTOMER_BOOTSTRAP_PASSWORD || adminPassword;
    if (!adminPassword)
        throw new Error('ADMIN_BOOTSTRAP_PASSWORD is required to bootstrap administrator accounts.');
    if (!customerPassword)
        throw new Error('CUSTOMER_BOOTSTRAP_PASSWORD is required to bootstrap customer accounts.');
    const adminHash = await bcrypt.hash(adminPassword, 12);
    const customerHash = await bcrypt.hash(customerPassword, 12);
    for (const p of INITIAL_PRODUCTS)
        await Plate.updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
    for (const a of INITIAL_ADMINS) {
        const email = a.email.toLowerCase();
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            await Admin.create({ ...a, email, passwordHash: adminHash });
        }
        else if (!existingAdmin.passwordHash) {
            existingAdmin.passwordHash = adminHash;
            await existingAdmin.save();
        }
    }
    for (const u of INITIAL_USERS) {
        await User.updateOne({ email: u.email.toLowerCase() }, { $setOnInsert: { ...u, email: u.email.toLowerCase(), passwordHash: customerHash } }, { upsert: true });
    }
    for (const o of INITIAL_ORDERS) {
        await Order.updateOne({ orderNumber: o.orderNumber }, { $setOnInsert: o }, { upsert: true });
    }
    for (const i of INITIAL_INQUIRIES) {
        const exists = await Inquiry.exists({ email: i.email, businessName: i.businessName });
        if (!exists)
            await Inquiry.create(i);
    }
    await Impact.updateOne({ key: 'global' }, { $setOnInsert: INITIAL_IMPACT }, { upsert: true });
    await SystemConfig.updateOne({ brandName: INITIAL_CONFIG.brandName }, { $setOnInsert: INITIAL_CONFIG }, { upsert: true });
}
app.get('/api/health', async (_req, res) => {
    res.json({ status: 'ok', stack: 'MERN', appName: 'BranPlate', mongoConnected: mongoose.connection.readyState === 1, timestamp: new Date().toISOString() });
});
app.get('/api/config', async (_req, res) => {
    const config = await SystemConfig.findOne({ brandName: INITIAL_CONFIG.brandName }).lean();
    res.json({ success: true, config: { ...publicConfig(config), databaseStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' } });
});
app.post('/api/config', adminAuth, hasPermission('edit_config'), async (req, res) => {
    const allowed = ['customDomain', 'clientUrl', 'firstAdminEmail', 'contactPhone', 'contactEmail', 'contactAddress', 'contactHours', 'gstinNumber', 'brandName', 'tagline', 'region'];
    const update = {};
    for (const key of allowed)
        if (req.body[key] !== undefined)
            update[key] = req.body[key];
    const config = await SystemConfig.findOneAndUpdate({ brandName: INITIAL_CONFIG.brandName }, { $set: update }, { new: true, upsert: true }).lean();
    res.json({ success: true, config: publicConfig(config) });
});
app.get('/api/products', async (_req, res) => {
    res.json({ success: true, products: (await Plate.find().sort({ createdAt: 1 }).lean()).map(withId) });
});
app.get('/api/products/:id', async (req, res) => {
    const product = await Plate.findOne({ id: req.params.id }).lean();
    if (!product)
        return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
});
app.post('/api/products', adminAuth, hasPermission('manage_products'), async (req, res) => {
    const { name, price } = req.body;
    if (!name || !Number.isFinite(Number(price)))
        return res.status(400).json({ success: false, message: 'Product name and valid base price are required' });
    const base = Number(price);
    const product = await Plate.create({
        id: `bp-plate-${Date.now()}`, name: name.trim(), category: req.body.category || 'dinner',
        tagline: req.body.tagline || '100% Biodegradable Agro-Fiber Tableware Plate', price: base,
        originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Number((base * 1.2).toFixed(2)),
        rating: 5, reviewsCount: 0, diameterOrSize: req.body.diameterOrSize || '10 inches (25.4 cm)',
        shape: req.body.shape || 'Round', dimensions: req.body.dimensions || '',
        heatResistance: req.body.heatResistance || '-20°C to +180°C', shelfLife: req.body.shelfLife || '24 Months',
        decompositionTime: req.body.decompositionTime || '30 Days', materials: req.body.materials || '100% Natural Plant Fiber',
        suitableFor: Array.isArray(req.body.suitableFor) ? req.body.suitableFor : [],
        inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : true,
        stockCount: Number(req.body.stockCount) || 10000, featured: false, bestseller: false,
        image: req.body.image || '/plate.svg', secondaryImages: [req.body.image || '/plate.svg'],
        packSizes: Array.isArray(req.body.packSizes) && req.body.packSizes.length ? req.body.packSizes : [
            { size: 25, price: base, label: 'Pack of 25 Plates', unitPrice: base / 25 },
            { size: 50, price: Number((base * 1.84).toFixed(2)), label: 'Pack of 50 Plates', unitPrice: Number((base * 1.84 / 50).toFixed(2)) },
            { size: 100, price: Number((base * 3.35).toFixed(2)), label: 'Pack of 100 Plates', unitPrice: Number((base * 3.35 / 100).toFixed(2)) }
        ],
        description: req.body.description || 'Eco-certified biodegradable plate manufactured from upcycled agricultural fibers.'
    });
    res.status(201).json({ success: true, product });
});
app.put('/api/products/:id', adminAuth, hasPermission('manage_products'), async (req, res) => {
    const update = { ...req.body };
    if (update.price !== undefined)
        update.price = Number(update.price);
    if (update.originalPrice !== undefined)
        update.originalPrice = Number(update.originalPrice);
    if (update.stockCount !== undefined)
        update.stockCount = Number(update.stockCount);
    if (update.inStock !== undefined)
        update.inStock = Boolean(update.inStock);
    delete update._id;
    delete update.id;
    const product = await Plate.findOneAndUpdate({ id: req.params.id }, { $set: update }, { new: true }).lean();
    if (!product)
        return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
});
app.delete('/api/products/:id', adminAuth, hasPermission('manage_products'), async (req, res) => {
    const count = await Plate.countDocuments();
    if (count <= 1)
        return res.status(400).json({ success: false, message: 'Cannot delete the only plate product.' });
    const result = await Plate.deleteOne({ id: req.params.id });
    if (!result.deletedCount)
        return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true });
});
app.get('/api/impact', async (_req, res) => {
    const impact = await Impact.findOne({ key: 'global' }).lean();
    res.json({ success: true, impact: impact || INITIAL_IMPACT });
});
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, shippingAddress } = req.body;
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized.includes('@') || String(password || '').length < 6)
        return res.status(400).json({ success: false, message: 'Valid email and password of at least 6 characters are required.' });
    const existingAdmin = await Admin.findOne({ email: normalized });
    if (existingAdmin)
        return res.status(409).json({ success: false, message: 'This email belongs to an administrator. Use administrator sign in.' });
    const existing = await User.findOne({ email: normalized });
    if (existing)
        return res.status(409).json({ success: false, message: 'Account already exists. Please sign in.' });
    const user = await User.create({ name: String(name || normalized.split('@')[0]).trim(), email: normalized, passwordHash: await bcrypt.hash(password, 12), phone: phone || '', shippingAddress: shippingAddress || undefined });
    const token = signToken({ sub: user.id, email: user.email, type: 'user' });
    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});
app.post('/api/auth/login', async (req, res) => {
    const normalized = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!normalized || !password)
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const admin = await Admin.findOne({ email: normalized });
    if (admin) {
        if (admin.status !== 'active')
            return res.status(403).json({ success: false, message: 'Administrator account is suspended.' });
        if (!(await bcrypt.compare(password, admin.passwordHash)))
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        admin.lastActive = new Date();
        await admin.save();
        const token = signToken({ sub: admin.id, email: admin.email, type: 'admin', role: admin.role, permissions: admin.permissions });
        return res.json({ success: true, token, user: { id: admin.id, name: admin.name, email: admin.email, type: 'admin', role: admin.role, permissions: admin.permissions } });
    }
    const user = await User.findOne({ email: normalized });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    user.lastLogin = new Date();
    await user.save();
    const token = signToken({ sub: user.id, email: user.email, type: 'user' });
    return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, type: 'user' } });
});
app.get('/api/auth/me', auth, async (_req, res) => {
    const a = res.locals.auth;
    if (a.type === 'admin') {
        const admin = await Admin.findById(a.sub).lean();
        if (!admin || admin.status !== 'active')
            return res.status(401).json({ success: false, message: 'Account is no longer active.' });
        return res.json({ success: true, user: { id: admin._id, name: admin.name, email: admin.email, type: 'admin', role: admin.role, permissions: admin.permissions } });
    }
    const user = await User.findById(a.sub).lean();
    if (!user)
        return res.status(401).json({ success: false, message: 'Account not found.' });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, type: 'user' } });
});
app.get('/api/orders', auth, async (req, res) => {
    const a = res.locals.auth;
    const query = a.type === 'admin' ? {} : { email: a.email };
    res.json({ success: true, orders: (await Order.find(query).sort({ createdAt: -1 }).lean()).map(withId) });
});
app.get('/api/orders/:id', auth, async (req, res) => {
    const a = res.locals.auth;
    const query = mongoose.isValidObjectId(req.params.id) ? { $or: [{ _id: req.params.id }, { orderNumber: req.params.id }] } : { orderNumber: req.params.id };
    if (a.type !== 'admin')
        query.email = a.email;
    const order = await Order.findOne(query).lean();
    if (!order)
        return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: withId(order) });
});
app.post('/api/orders', async (req, res) => {
    const { customerName, email, phone, address, items } = req.body;
    const normalized = String(email || '').trim().toLowerCase();
    if (!customerName || !normalized.includes('@') || !Array.isArray(items) || !items.length)
        return res.status(400).json({ success: false, message: 'Missing required order details.' });
    // Server-side pricing: never trust totals sent by the browser.
    const productIds = [...new Set(items.map((x) => String(x.productId)))];
    const products = await Plate.find({ id: { $in: productIds } }).lean();
    const byId = new Map(products.map(p => [p.id, p]));
    const cleanItems = [];
    let subtotal = 0;
    for (const item of items) {
        const product = byId.get(String(item.productId));
        if (!product)
            return res.status(400).json({ success: false, message: `Product ${item.productId} not found.` });
        const packIndex = product.packSizes.findIndex((p) => p.label === item.packLabel);
        if (packIndex < 0)
            return res.status(400).json({ success: false, message: 'Invalid pack selection.' });
        const pack = product.packSizes[packIndex];
        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
        const lineTotal = Number((pack.price * quantity).toFixed(2));
        subtotal += lineTotal;
        cleanItems.push({ productId: product.id, productName: product.name, packLabel: pack.label, quantity, unitPrice: pack.price, total: lineTotal, image: product.image });
    }
    const promoCode = String(req.body.promoCode || '').trim().toUpperCase();
    const discountPercent = promoCode === 'CENTRALINDIA' ? 15 : (promoCode === 'EARTH10' || promoCode === 'THELEGEND5' ? 10 : 0);
    const discount = Number((subtotal * discountPercent / 100).toFixed(2));
    const shipping = subtotal > 50 ? 0 : 7.5;
    const tax = Number(Math.max(0, subtotal - discount) * 0.05).toFixed(2);
    const total = Number((subtotal - discount + shipping + Number(tax)).toFixed(2));
    const order = await Order.create({
        orderNumber: `BP-${Date.now().toString().slice(-7)}`,
        customerName: String(customerName).trim(), email: normalized, phone: phone || '',
        address: address || { street: '', city: '', state: '', zip: '', country: 'India' },
        items: cleanItems, subtotal, discount, shipping, tax: Number(tax), total,
        status: 'confirmed', paymentMethod: req.body.paymentMethod || 'Standard Gateway',
        trackingNumber: `BP-TRK-${Date.now().toString().slice(-9)}-IN`, notes: req.body.notes || ''
    });
    const user = await User.findOneAndUpdate({ email: normalized }, { $set: { name: String(customerName).trim(), phone: phone || '', shippingAddress: address || undefined }, $inc: { totalOrdersCount: 1, totalSpent: total }, $setOnInsert: { passwordHash: await bcrypt.hash(cryptoRandomPassword(), 12) } }, { new: true, upsert: true });
    const impact = await Impact.findOneAndUpdate({ key: 'global' }, { $inc: {
            plasticPlatesReplaced: cleanItems.reduce((n, i) => n + i.quantity * 25, 0),
            wheatBranUpcycledKg: Math.round(cleanItems.reduce((n, i) => n + i.quantity * 25, 0) * 0.05),
            co2SavedKg: Math.round(cleanItems.reduce((n, i) => n + i.quantity * 25, 0) * 0.12)
        } }, { new: true, upsert: true });
    const token = signToken({ sub: user.id, email: user.email, type: 'user' });
    res.status(201).json({ success: true, order: { ...order.toObject(), id: order.id, createdAt: order.createdAt }, token });
});
function cryptoRandomPassword() {
    return `${Math.random().toString(36).slice(2)}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
app.patch('/api/orders/:id/status', adminAuth, hasPermission('manage_orders'), async (req, res) => {
    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    if (!allowed.includes(req.body.status))
        return res.status(400).json({ success: false, message: 'Invalid order status.' });
    const order = await Order.findOneAndUpdate(mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: req.params.id }, { $set: { status: req.body.status } }, { new: true }).lean();
    if (!order)
        return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: withId(order) });
});
app.get('/api/inquiries', adminAuth, hasPermission('manage_inquiries'), async (_req, res) => {
    res.json({ success: true, inquiries: (await Inquiry.find().sort({ createdAt: -1 }).lean()).map(withId) });
});
app.post('/api/inquiries', async (req, res) => {
    const { name, businessName, email } = req.body;
    if (!name || !businessName || !email)
        return res.status(400).json({ success: false, message: 'Name, business name, and email are required.' });
    const plates = req.body.interestedPlates || req.body.interestedProducts || [];
    const inquiry = await Inquiry.create({ name, businessName, email: String(email).toLowerCase(), phone: req.body.phone || '', businessType: req.body.businessType || 'restaurant', estimatedMonthlyVolume: req.body.estimatedMonthlyVolume || '1,000 - 5,000 plates', shippingAddress: req.body.shippingAddress || '', interestedPlates: plates, message: req.body.message || '', status: 'new' });
    res.status(201).json({ success: true, inquiry: withId(inquiry), message: 'Sample request received.' });
});
app.patch('/api/inquiries/:id/status', adminAuth, hasPermission('manage_inquiries'), async (req, res) => {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }).lean();
    if (!inquiry)
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, inquiry: withId(inquiry) });
});
app.get('/api/admins', adminAuth, async (_req, res) => {
    const admins = await Admin.find().select('-passwordHash').sort({ createdAt: 1 }).lean();
    res.json({ success: true, admins: admins.map(withId), totalAdmins: admins.length });
});
app.post('/api/admins/check', auth, async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const admin = await Admin.findOne({ email }).select('-passwordHash').lean();
    res.json({ success: true, isAdmin: !!admin && admin.status === 'active', admin: admin || null });
});
app.post('/api/admins', adminAuth, hasPermission('manage_admins'), async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email.includes('@'))
        return res.status(400).json({ success: false, message: 'Valid email is required.' });
    const exists = await Admin.findOne({ email });
    const hash = await bcrypt.hash(process.env.ADMIN_BOOTSTRAP_PASSWORD, 12);
    if (exists) {
        exists.name = req.body.name || exists.name;
        exists.role = req.body.role || exists.role;
        exists.permissions = req.body.permissions || exists.permissions;
        exists.status = 'active';
        await exists.save();
        return res.json({ success: true, admin: exists.toObject({ transform: (_d, ret) => { delete ret.passwordHash; return ret; } }) });
    }
    const admin = await Admin.create({ name: req.body.name || email.split('@')[0], email, passwordHash: hash, role: req.body.role || 'operations_admin', permissions: req.body.permissions || ['manage_orders', 'manage_inquiries'], addedBy: res.locals.admin.email, status: 'active' });
    const out = admin.toObject();
    delete out.passwordHash;
    res.status(201).json({ success: true, admin: out });
});
app.put('/api/admins/:id', adminAuth, hasPermission('manage_admins'), async (req, res) => {
    const update = { ...req.body };
    delete update.passwordHash;
    delete update.email;
    const admin = await Admin.findOneAndUpdate(mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { email: req.params.id.toLowerCase() }, { $set: update }, { new: true }).select('-passwordHash').lean();
    if (!admin)
        return res.status(404).json({ success: false, message: 'Administrator not found' });
    res.json({ success: true, admin: withId(admin) });
});
app.delete('/api/admins/:id', adminAuth, hasPermission('manage_admins'), async (req, res) => {
    const target = await Admin.findOne(mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { email: req.params.id.toLowerCase() });
    if (!target)
        return res.status(404).json({ success: false, message: 'Administrator not found' });
    const config = await SystemConfig.findOne({ brandName: INITIAL_CONFIG.brandName }).lean();
    if (target.email === config?.firstAdminEmail?.toLowerCase())
        return res.status(403).json({ success: false, message: 'Cannot revoke the primary system owner.' });
    await target.deleteOne();
    res.json({ success: true });
});
app.get('/api/users', adminAuth, hasPermission('manage_orders'), async (_req, res) => {
    res.json({ success: true, users: (await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean()).map(withId) });
});
let aiClient = null;
function getAiClient() {
    if (!aiClient && process.env.GEMINI_API_KEY)
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return aiClient;
}
app.post('/api/ai/calculate-event', async (req, res) => {
    const count = Number(req.body.guestsCount) || 100;
    const meals = Number(req.body.mealsServed) || 2;
    const dinner = Math.ceil(count * meals * 1.15);
    const snack = Math.ceil(count * Math.max(1, meals - 1) * 0.75);
    const partitions = Math.ceil(count * 0.4);
    const avoided = dinner + snack + partitions;
    const ai = getAiClient();
    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Return JSON only for a biodegradable plate recommendation for ${count} guests, ${meals} meals, event ${req.body.eventType || 'event'}, style ${req.body.plateStyle || '10 inch dinner'}. Include recommendations and impactAnalysis.`,
                config: { responseMimeType: 'application/json' }
            });
            if (response.text)
                return res.json({ success: true, calculation: JSON.parse(response.text), isAiGenerated: true });
        }
        catch (e) {
            console.warn('Gemini fallback:', e);
        }
    }
    res.json({ success: true, calculation: {
            recommendations: { dinnerPlates10Inch: dinner, buffetPlates12Inch: Math.ceil(count * 0.3), snackPlates8Inch: snack, dessertPlates6Inch: Math.ceil(count * 0.8), compartmentPlates4Section: partitions, suggestedPlatesBundle: `${Math.ceil((dinner + snack) / 100)} x BranPlate 100-Pack Assorted Plates Kit` },
            impactAnalysis: { plasticPlatesAvoidedCount: avoided, wheatBranRepurposedKg: Math.round(avoided * 0.05), co2PreventedKg: Math.round(avoided * 0.12), decompositionTimelineDays: 30 },
            cateringPlateAdvice: `For ${count} guests across ${meals} courses, use a mix of 10-inch dinner and 8-inch snack plates.`,
            farmerUpcyclingSummary: `Approximately ${Math.round(avoided * 0.05)} kg of agricultural fiber is repurposed.`
        }, isAiGenerated: false });
});
async function start() {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to the existing MongoDB Atlas cluster.');
    await seedDatabase();
    if (process.env.NODE_ENV !== 'production') {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
        app.use(vite.middlewares);
    }
    else {
        const distPath = path.resolve(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }
    app.listen(PORT, '0.0.0.0', () => console.log(`BranPlate MERN server running on port ${PORT}`));
}
start().catch(err => { console.error('MongoDB startup failed:', err); process.exit(1); });
