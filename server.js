import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import mongoose2 from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import { BRANNECO_PRODUCTS } from "./client/src/catalogue-data.js";

import mongoose, { Schema } from "mongoose";
var PlateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, default: "", index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, default: "" },
    exportPrice: { type: Number, default: 0 },
    tagline: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    diameterOrSize: { type: String, default: "" },
    shape: { type: String, default: "Round" },
    heatResistance: { type: String, default: "-20\xB0C to +180\xB0C" },
    shelfLife: { type: String, default: "24 Months" },
    decompositionTime: { type: String, default: "30 Days" },
    materials: { type: String, default: "100% Upcycled Agricultural Wheat Bran" },
    suitableFor: [{ type: String }],
    dimensions: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 1e3 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    image: { type: String, required: true },
    secondaryImages: [{ type: String }],
    images: [{ type: String }],
    packSizes: [
      {
        size: { type: Number, required: true },
        price: { type: Number, required: true },
        label: { type: String, required: true },
        unitPrice: { type: Number, required: true }
      }
    ],
    description: { type: String, default: "" }
  },
  { timestamps: true }
);
var OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "India" }
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        packLabel: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
        image: { type: String, default: "" }
      }
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered"],
      default: "confirmed"
    },
    paymentMethod: { type: String, default: "UPI / Prepaid Gateway" },
    trackingNumber: { type: String, required: true },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);
var InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    businessType: { type: String, default: "restaurant" },
    estimatedMonthlyVolume: { type: String, default: "1,000 - 5,000 plates" },
    shippingAddress: { type: String, default: "" },
    interestedPlates: [{ type: String }],
    message: { type: String, default: "" },
    status: { type: String, default: "new" }
  },
  { timestamps: true }
);
var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  totalOrdersCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastLogin: Date
}, { timestamps: true });
var AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "operations_admin", "inventory_manager"], default: "operations_admin" },
  permissions: [{ type: String }],
  addedBy: { type: String, default: "Super Administrator" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  lastActive: Date
}, { timestamps: true });
var ImpactSchema = new Schema({
  key: { type: String, unique: true, default: "global" },
  plasticPlatesReplaced: { type: Number, default: 0 },
  wheatBranUpcycledKg: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  landfillDivertedCubicMeters: { type: Number, default: 0 },
  farmerIncomeAugmentedINR: { type: Number, default: 0 }
}, { timestamps: true });
var ConfigSchema = new Schema(
  {
    clientUrl: { type: String, default: "https://branplate-q6sx.vercel.app" },
    customDomain: { type: String, default: "thelegend5.com" },
    firstAdminEmail: { type: String, default: "piyushgajananpatil5@gmail.com" },
    mongoUri: { type: String, default: "" },
    brandName: { type: String, default: "BranPlate" },
    region: { type: String, default: "Central India \xB7 Circular Economy \xB7 Zero Landfill" }
  },
  { timestamps: true }
);
var Plate = mongoose.models.Plate || mongoose.model("Plate", PlateSchema);
var Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
var Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
var SystemConfig = mongoose.models.SystemConfig || mongoose.model("SystemConfig", ConfigSchema);
var User = mongoose.models.User || mongoose.model("User", UserSchema);
var Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
var Impact = mongoose.models.Impact || mongoose.model("Impact", ImpactSchema);

var INITIAL_PRODUCTS = [
  {
    id: "bp-plate-100bio",
    name: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)',
    category: "dinner",
    tagline: "Eco-certified compostable round plate crafted from 100% upcycled agro-fiber. Grease-proof, microwave-safe, zero plastic.",
    price: 18.5,
    originalPrice: 22,
    rating: 5,
    reviewsCount: 248,
    diameterOrSize: "10 inches (25.4 cm)",
    shape: "Round",
    dimensions: "254mm x 254mm x 22mm, 52g net weight",
    heatResistance: "-20\xB0C to +180\xB0C (Microwave, Freezer & Oven Safe)",
    shelfLife: "24 Months in dry storage",
    decompositionTime: "Composts completely in 30 days in soil without microplastics",
    materials: "100% Natural Biodegradable Plant Fiber / Wheat Residue, 0% Plastic Coating, 0% Chemical Binders",
    suitableFor: ["Hot gravies, curries & steaming rice", "Oily & greasy foods (100% leak resistant)", "Wedding banquets, buffets & catered events", "Everyday dining, cafes & food trucks", "Microwave reheating up to 180\xB0C"],
    inStock: true,
    stockCount: 25e3,
    featured: true,
    bestseller: true,
    image: "/plate.svg",
    secondaryImages: ["/plate.svg"],
    packSizes: [
      { size: 25, price: 18.5, label: "Pack of 25 Plates", unitPrice: 0.74 },
      { size: 50, price: 34, label: "Pack of 50 Plates (Save 8%)", unitPrice: 0.68 },
      { size: 100, price: 62, label: "Pack of 100 Plates (Save 16%)", unitPrice: 0.62 },
      { size: 500, price: 280, label: "Commercial Case of 500 Plates", unitPrice: 0.56 },
      { size: 1e3, price: 510, label: "Wholesale Master Pallet (1,000 Plates)", unitPrice: 0.51 }
    ],
    description: "Our flagship 100% biodegradable plate. Manufactured through precision high-temperature molding of natural agricultural fibers. Delivers unmatched structural rigidity that never bends or gets soggy under piping hot food, gravies, or oils."
  }
];
var INITIAL_USERS = [
  {
    name: "Piyush Patil",
    email: "piyushgajananpatil5@gmail.com",
    phone: "+91 98234 56789",
    shippingAddress: { street: "74 Green Park Avenue, Near Agro Tech Center", city: "Nagpur", state: "Maharashtra", zip: "440001", country: "India" },
    totalOrdersCount: 1,
    totalSpent: 182.4
  },
  {
    name: "Potato Bhai",
    email: "potatobhai69@gmail.com",
    phone: "+91 98990 12345",
    totalOrdersCount: 0,
    totalSpent: 0
  }
];
var INITIAL_ADMINS = [
  {
    name: "Piyush Patil",
    email: "piyushgajananpatil5@gmail.com",
    role: "super_admin",
    permissions: ["manage_admins", "manage_products", "manage_orders", "manage_inquiries", "edit_config", "export_reports"],
    addedBy: "System Primary Owner",
    status: "active"
  },
  {
    name: "Potato Bhai",
    email: "potatobhai69@gmail.com",
    role: "super_admin",
    permissions: ["manage_admins", "manage_products", "manage_orders", "manage_inquiries", "edit_config", "export_reports"],
    addedBy: "Super Administrator",
    status: "active"
  }
];
var INITIAL_IMPACT = {
  key: "global",
  plasticPlatesReplaced: 1845200,
  wheatBranUpcycledKg: 96400,
  co2SavedKg: 289200,
  landfillDivertedCubicMeters: 3680,
  farmerIncomeAugmentedINR: 425e4
};
var INITIAL_CONFIG = {
  clientUrl: "https://branplate-q6sx.vercel.app",
  customDomain: "thelegend5.com",
  firstAdminEmail: "piyushgajananpatil5@gmail.com",
  brandName: "BranPlate",
  tagline: "100% Biodegradable Wheat Bran Plates \u2014 From Field to Feast. Back to Earth.",
  region: "Central India \xB7 Circular Economy \xB7 Zero Landfill",
  contactPhone: "+91 98234 56789",
  contactEmail: "support@branplate.com",
  contactAddress: "Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India",
  contactHours: "Monday \u2013 Saturday: 9:00 AM \u2013 7:00 PM IST",
  gstinNumber: "27AAECB8821P1Z5"
};
var INITIAL_ORDERS = [
  {
    orderNumber: "BP-88219",
    customerName: "Piyush Patil",
    email: "piyushgajananpatil5@gmail.com",
    phone: "+91 98234 56789",
    address: { street: "74 Green Park Avenue, Near Agro Tech Center", city: "Nagpur", state: "Maharashtra", zip: "440001", country: "India" },
    items: [
      { productId: "bp-plate-100bio", productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: "Pack of 100 Plates (Save 16%)", quantity: 2, unitPrice: 62, total: 124, image: "/plate.svg" },
      { productId: "bp-plate-100bio", productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: "Pack of 50 Plates (Save 8%)", quantity: 2, unitPrice: 34, total: 68, image: "/plate.svg" }
    ],
    subtotal: 192,
    discount: 19.2,
    shipping: 0,
    tax: 9.6,
    total: 182.4,
    status: "shipped",
    paymentMethod: "Prepaid (Direct Gateway / UPI)",
    trackingNumber: "BP-TRK-992014-IN"
  },
  {
    orderNumber: "BP-88220",
    customerName: "EcoFest Catering Services",
    email: "events@ecofest.org",
    phone: "+91 94221 11223",
    address: { street: "Eco Plaza, Central Ring Road", city: "Bhopal", state: "Madhya Pradesh", zip: "462001", country: "India" },
    items: [{ productId: "bp-plate-100bio", productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: "Wholesale Master Pallet (1,000 Plates)", quantity: 2, unitPrice: 510, total: 1020, image: "/plate.svg" }],
    subtotal: 1020,
    discount: 102,
    shipping: 0,
    tax: 45.9,
    total: 963.9,
    status: "processing",
    paymentMethod: "Commercial Purchase Order",
    trackingNumber: "BP-TRK-992025-IN"
  }
];
var INITIAL_INQUIRIES = [
  {
    name: "Suresh Verma",
    businessName: "The Organic Kitchen Cafe",
    email: "suresh@organickitchen.in",
    phone: "+91 98811 22334",
    businessType: "restaurant",
    estimatedMonthlyVolume: "2,500 - 5,000 plates/month",
    shippingAddress: "42 Farm-to-Table Lane, Pune, MH",
    interestedPlates: ['10" 100% Biodegradable Plant-Fiber Dinner Plate (Sample Pack)'],
    message: "We are transitioning our 3 restaurant branches to 100% plastic-free biodegradable plates. Requesting sample kit for hot gravy durability test.",
    status: "sample_dispatched"
  }
];

var app = express();
var PORT = Number(process.env.PORT || 3e3);
var JWT_SECRET = process.env.JWT_SECRET || "local-development-secret-change-me";
var MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn("MONGO_URI is not set. Add it to .env to connect this MERN app to MongoDB Atlas.");
}
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "8mb" }));
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function getToken(req) {
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}
function auth(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
  try {
    res.locals.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
  }
}
async function adminAuth(req, res, next) {
  auth(req, res, async () => {
    const a = res.locals.auth;
    if (a.type !== "admin") return res.status(403).json({ success: false, message: "Administrator access required" });
    const admin = await Admin.findById(a.sub);
    if (!admin || admin.status !== "active") return res.status(403).json({ success: false, message: "Administrator access revoked" });
    res.locals.admin = admin;
    next();
  });
}
function hasPermission(permission) {
  return (req, res, next) => {
    const admin = res.locals.admin;
    if (admin?.role === "super_admin" || admin?.permissions?.includes(permission)) return next();
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
  if (!doc) return doc;
  return { ...doc, id: doc.id || String(doc._id) };
}
async function seedDatabase() {
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const customerPassword = process.env.CUSTOMER_BOOTSTRAP_PASSWORD || adminPassword;
  if (!adminPassword) throw new Error("ADMIN_BOOTSTRAP_PASSWORD is required to bootstrap administrator accounts.");
  if (!customerPassword) throw new Error("CUSTOMER_BOOTSTRAP_PASSWORD is required to bootstrap customer accounts.");
  const adminHash = await bcrypt.hash(adminPassword, 12);
  const customerHash = await bcrypt.hash(customerPassword, 12);
  for (const p of INITIAL_PRODUCTS) await Plate.updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
  for (const p of BRANNECO_PRODUCTS) await Plate.updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
  for (const a of INITIAL_ADMINS) {
    await Admin.updateOne(
      { email: a.email.toLowerCase() },
      { $setOnInsert: { ...a, email: a.email.toLowerCase(), passwordHash: adminHash } },
      { upsert: true }
    );
  }
  for (const u of INITIAL_USERS) {
    await User.updateOne(
      { email: u.email.toLowerCase() },
      { $setOnInsert: { ...u, email: u.email.toLowerCase(), passwordHash: customerHash } },
      { upsert: true }
    );
  }
  for (const o of INITIAL_ORDERS) {
    await Order.updateOne({ orderNumber: o.orderNumber }, { $setOnInsert: o }, { upsert: true });
  }
  for (const i of INITIAL_INQUIRIES) {
    const exists = await Inquiry.exists({ email: i.email, businessName: i.businessName });
    if (!exists) await Inquiry.create(i);
  }
  await Impact.updateOne({ key: "global" }, { $setOnInsert: INITIAL_IMPACT }, { upsert: true });
  await SystemConfig.updateOne({ brandName: INITIAL_CONFIG.brandName }, { $setOnInsert: INITIAL_CONFIG }, { upsert: true });
}
app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok", stack: "MERN", appName: "BranPlate", mongoConnected: mongoose2.connection.readyState === 1, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/config", async (_req, res) => {
  const config = await SystemConfig.findOne({ brandName: INITIAL_CONFIG.brandName }).lean();
  res.json({ success: true, config: { ...publicConfig(config), databaseStatus: mongoose2.connection.readyState === 1 ? "connected" : "disconnected" } });
});
app.post("/api/config", adminAuth, hasPermission("edit_config"), async (req, res) => {
  const allowed = ["customDomain", "clientUrl", "firstAdminEmail", "contactPhone", "contactEmail", "contactAddress", "contactHours", "gstinNumber", "brandName", "tagline", "region"];
  const update = {};
  for (const key of allowed) if (req.body[key] !== void 0) update[key] = req.body[key];
  const config = await SystemConfig.findOneAndUpdate({ brandName: INITIAL_CONFIG.brandName }, { $set: update }, { new: true, upsert: true }).lean();
  res.json({ success: true, config: publicConfig(config) });
});
app.get("/api/products", async (_req, res) => {
  res.json({ success: true, products: (await Plate.find({ inStock: true }).sort({ createdAt: 1 }).lean()).map(withId) });
});
app.get("/api/products/admin/all", adminAuth, hasPermission("manage_products"), async (_req, res) => {
  res.json({ success: true, products: (await Plate.find().sort({ createdAt: 1 }).lean()).map(withId) });
});
app.get("/api/products/:id", async (req, res) => {
  const productQuery = [{ id: req.params.id }, { sku: req.params.id }];
  if (mongoose2.isValidObjectId(req.params.id)) productQuery.push({ _id: req.params.id });
  const product = await Plate.findOne({ $or: productQuery }).lean();
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});
app.post("/api/products", adminAuth, hasPermission("manage_products"), async (req, res) => {
  const { name, price } = req.body;
  if (!name || !Number.isFinite(Number(price))) return res.status(400).json({ success: false, message: "Product name and valid base price are required" });
  const base = Number(price);
  const sku = String(req.body.sku || `CUSTOM-${Date.now()}`).trim().toUpperCase();
  if (await Plate.exists({ sku })) return res.status(409).json({ success: false, message: "A product with this SKU already exists." });
  const images = Array.isArray(req.body.images) ? req.body.images.filter((image) => typeof image === "string") : [];
  const product = await Plate.create({
    id: sku,
    sku,
    name: name.trim(),
    category: req.body.category || "areca-round",
    material: req.body.material || "Areca leaf",
    exportPrice: Number(req.body.exportPrice) || Number((base / 83).toFixed(3)),
    tagline: req.body.tagline || "100% Biodegradable Agro-Fiber Tableware Plate",
    price: base,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Number((base * 1.2).toFixed(2)),
    rating: 5,
    reviewsCount: 0,
    diameterOrSize: req.body.diameterOrSize || req.body.packSize || "Per piece",
    shape: req.body.shape || "Round",
    dimensions: req.body.dimensions || "",
    heatResistance: req.body.heatResistance || "-20\xB0C to +180\xB0C",
    shelfLife: req.body.shelfLife || "24 Months",
    decompositionTime: req.body.decompositionTime || "30 Days",
    materials: req.body.materials || "100% Natural Plant Fiber",
    suitableFor: Array.isArray(req.body.suitableFor) ? req.body.suitableFor : [],
    inStock: req.body.inStock !== void 0 ? Boolean(req.body.inStock) : true,
    stockCount: Number(req.body.stockCount) || 1e4,
    featured: false,
    bestseller: false,
    image: images[0] || req.body.image || "/plate.svg",
    images,
    secondaryImages: images.slice(1),
    packSizes: Array.isArray(req.body.packSizes) && req.body.packSizes.length ? req.body.packSizes : [
      { size: 1, price: base, label: "Per piece", unitPrice: base }
    ],
    description: req.body.description || "Eco-certified biodegradable plate manufactured from upcycled agricultural fibers."
  });
  res.status(201).json({ success: true, product });
});
app.put("/api/products/:id", adminAuth, hasPermission("manage_products"), async (req, res) => {
  const update = { ...req.body };
  if (update.price !== void 0) update.price = Number(update.price);
  if (update.originalPrice !== void 0) update.originalPrice = Number(update.originalPrice);
  if (update.stockCount !== void 0) update.stockCount = Number(update.stockCount);
  if (update.inStock !== void 0) update.inStock = Boolean(update.inStock);
  if (update.exportPrice !== void 0) update.exportPrice = Number(update.exportPrice);
  if (Array.isArray(update.images)) {
    update.image = update.images[0] || "";
    update.secondaryImages = update.images.slice(1);
  }
  delete update._id;
  delete update.id;
  const productQuery = [{ id: req.params.id }, { sku: req.params.id }];
  if (mongoose2.isValidObjectId(req.params.id)) productQuery.push({ _id: req.params.id });
  if (update.price !== void 0 && !Array.isArray(update.packSizes)) {
    const current = await Plate.findOne({ $or: productQuery }).select("sku").lean();
    if (current?.sku) update.packSizes = [{ size: 1, price: update.price, label: "Per piece", unitPrice: update.price }];
  }
  const product = await Plate.findOneAndUpdate({ $or: productQuery }, { $set: update }, { new: true }).lean();
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});
app.delete("/api/products/:id", adminAuth, hasPermission("manage_products"), async (req, res) => {
  const count = await Plate.countDocuments();
  if (count <= 1) return res.status(400).json({ success: false, message: "Cannot delete the only plate product." });
  const productQuery = [{ id: req.params.id }, { sku: req.params.id }];
  if (mongoose2.isValidObjectId(req.params.id)) productQuery.push({ _id: req.params.id });
  const result = await Plate.deleteOne({ $or: productQuery });
  if (!result.deletedCount) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true });
});
app.get("/api/impact", async (_req, res) => {
  const impact = await Impact.findOne({ key: "global" }).lean();
  res.json({ success: true, impact: impact || INITIAL_IMPACT });
});
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone, shippingAddress } = req.body;
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized.includes("@") || String(password || "").length < 6) return res.status(400).json({ success: false, message: "Valid email and password of at least 6 characters are required." });
  const existingAdmin = await Admin.findOne({ email: normalized });
  if (existingAdmin) return res.status(409).json({ success: false, message: "This email belongs to an administrator. Use administrator sign in." });
  const existing = await User.findOne({ email: normalized });
  if (existing) return res.status(409).json({ success: false, message: "Account already exists. Please sign in." });
  const user = await User.create({ name: String(name || normalized.split("@")[0]).trim(), email: normalized, passwordHash: await bcrypt.hash(password, 12), phone: phone || "", shippingAddress: shippingAddress || void 0 });
  const token = signToken({ sub: user.id, email: user.email, type: "user" });
  res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});
app.post("/api/auth/login", async (req, res) => {
  const normalized = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!normalized || !password) return res.status(400).json({ success: false, message: "Email and password are required." });
  const admin = await Admin.findOne({ email: normalized });
  if (admin) {
    if (admin.status !== "active") return res.status(403).json({ success: false, message: "Administrator account is suspended." });
    if (!await bcrypt.compare(password, admin.passwordHash)) return res.status(401).json({ success: false, message: "Invalid email or password." });
    admin.lastActive = /* @__PURE__ */ new Date();
    await admin.save();
    const token2 = signToken({ sub: admin.id, email: admin.email, type: "admin", role: admin.role, permissions: admin.permissions });
    return res.json({ success: true, token: token2, user: { id: admin.id, name: admin.name, email: admin.email, type: "admin", role: admin.role, permissions: admin.permissions } });
  }
  const user = await User.findOne({ email: normalized });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ success: false, message: "Invalid email or password." });
  user.lastLogin = /* @__PURE__ */ new Date();
  await user.save();
  const token = signToken({ sub: user.id, email: user.email, type: "user" });
  return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, type: "user" } });
});
app.get("/api/auth/me", auth, async (_req, res) => {
  const a = res.locals.auth;
  if (a.type === "admin") {
    const admin = await Admin.findById(a.sub).lean();
    if (!admin || admin.status !== "active") return res.status(401).json({ success: false, message: "Account is no longer active." });
    return res.json({ success: true, user: { id: admin._id, name: admin.name, email: admin.email, type: "admin", role: admin.role, permissions: admin.permissions } });
  }
  const user = await User.findById(a.sub).lean();
  if (!user) return res.status(401).json({ success: false, message: "Account not found." });
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, type: "user" } });
});
app.get("/api/orders", auth, async (req, res) => {
  const a = res.locals.auth;
  const query = a.type === "admin" ? {} : { email: a.email };
  res.json({ success: true, orders: (await Order.find(query).sort({ createdAt: -1 }).lean()).map(withId) });
});
app.get("/api/orders/:id", auth, async (req, res) => {
  const a = res.locals.auth;
  const query = mongoose2.isValidObjectId(req.params.id) ? { $or: [{ _id: req.params.id }, { orderNumber: req.params.id }] } : { orderNumber: req.params.id };
  if (a.type !== "admin") query.email = a.email;
  const order = await Order.findOne(query).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order: withId(order) });
});
async function sendOrderNotification(order) {
  const smtpUser = process.env.GMAIL_USER;
  const smtpPassword = process.env.GMAIL_APP_PASSWORD;
  if (!smtpUser || !smtpPassword) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  const lines = order.items.map((item) => `${item.productName} (${item.productId}) × ${item.quantity} · ₹${item.total}`).join("\n");
  await transporter.sendMail({
    from: `BrannEco Orders <${smtpUser}>`,
    to: process.env.ORDER_NOTIFY_EMAIL || "ritiknitw7697@gmail.com",
    replyTo: order.email,
    subject: `New BrannEco order ${order.orderNumber}`,
    text: [
      `Order: ${order.orderNumber}`,
      `Customer: ${order.customerName}`,
      `Email: ${order.email}`,
      `Phone: ${order.phone || "Not provided"}`,
      `Address: ${Object.values(order.address || {}).filter(Boolean).join(", ")}`,
      "",
      "Items:",
      lines,
      "",
      `Subtotal: ₹${order.subtotal}`,
      `Shipping: ₹${order.shipping}`,
      `Total: ₹${order.total}`
    ].join("\n")
  });
  return true;
}
app.post("/api/orders", async (req, res) => {
  const { customerName, email, phone, address, items } = req.body;
  const normalized = String(email || "").trim().toLowerCase();
  if (!customerName || !normalized.includes("@") || !Array.isArray(items) || !items.length) return res.status(400).json({ success: false, message: "Missing required order details." });
  const productIds = [...new Set(items.map((x) => String(x.productId)))];
  const products = await Plate.find({ id: { $in: productIds } }).lean();
  const byId = new Map(products.map((p) => [p.id, p]));
  const cleanItems = [];
  let subtotal = 0;
  for (const item of items) {
    const product = byId.get(String(item.productId));
    if (!product) return res.status(400).json({ success: false, message: `Product ${item.productId} not found.` });
    if (!product.inStock) return res.status(400).json({ success: false, message: `${product.name} is currently unavailable.` });
    const packIndex = product.packSizes.findIndex((p) => p.label === item.packLabel);
    if (packIndex < 0) return res.status(400).json({ success: false, message: "Invalid pack selection." });
    const pack = product.packSizes[packIndex];
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const lineTotal = Number((pack.price * quantity).toFixed(2));
    subtotal += lineTotal;
    cleanItems.push({ productId: product.id, productName: product.name, packLabel: pack.label, quantity, unitPrice: pack.price, total: lineTotal, image: product.image });
  }
  const promoCode = String(req.body.promoCode || "").trim().toUpperCase();
  const discountPercent = promoCode === "CENTRALINDIA" ? 15 : promoCode === "EARTH10" || promoCode === "THELEGEND5" ? 10 : 0;
  const discount = Number((subtotal * discountPercent / 100).toFixed(2));
  const shipping = subtotal > 50 ? 0 : 7.5;
  const tax = Number(Math.max(0, subtotal - discount) * 0.05).toFixed(2);
  const total = Number((subtotal - discount + shipping + Number(tax)).toFixed(2));
  const order = await Order.create({
    orderNumber: `BP-${Date.now().toString().slice(-7)}`,
    customerName: String(customerName).trim(),
    email: normalized,
    phone: phone || "",
    address: address || { street: "", city: "", state: "", zip: "", country: "India" },
    items: cleanItems,
    subtotal,
    discount,
    shipping,
    tax: Number(tax),
    total,
    status: "confirmed",
    paymentMethod: req.body.paymentMethod || "Standard Gateway",
    trackingNumber: `BP-TRK-${Date.now().toString().slice(-9)}-IN`,
    notes: req.body.notes || ""
  });
  const user = await User.findOneAndUpdate(
    { email: normalized },
    { $set: { name: String(customerName).trim(), phone: phone || "", shippingAddress: address || void 0 }, $inc: { totalOrdersCount: 1, totalSpent: total }, $setOnInsert: { passwordHash: await bcrypt.hash(cryptoRandomPassword(), 12) } },
    { new: true, upsert: true }
  );
  const impact = await Impact.findOneAndUpdate({ key: "global" }, { $inc: {
    plasticPlatesReplaced: cleanItems.reduce((n, i) => n + i.quantity * 25, 0),
    wheatBranUpcycledKg: Math.round(cleanItems.reduce((n, i) => n + i.quantity * 25, 0) * 0.05),
    co2SavedKg: Math.round(cleanItems.reduce((n, i) => n + i.quantity * 25, 0) * 0.12)
  } }, { new: true, upsert: true });
  const token = signToken({ sub: user.id, email: user.email, type: "user" });
  let emailNotificationSent = false;
  try {
    emailNotificationSent = await sendOrderNotification(order);
    if (!emailNotificationSent) console.warn("Order saved; Gmail notification not sent because GMAIL_USER or GMAIL_APP_PASSWORD is not configured.");
  } catch (error) {
    console.error("Order saved; Gmail notification failed:", error.message);
  }
  res.status(201).json({ success: true, order: { ...order.toObject(), id: order.id, createdAt: order.createdAt }, token, emailNotificationSent });
});
function cryptoRandomPassword() {
  return `${Math.random().toString(36).slice(2)}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
app.patch("/api/orders/:id/status", adminAuth, hasPermission("manage_orders"), async (req, res) => {
  const allowed = ["pending", "confirmed", "processing", "shipped", "delivered"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid order status." });
  const order = await Order.findOneAndUpdate(mongoose2.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: req.params.id }, { $set: { status: req.body.status } }, { new: true }).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order: withId(order) });
});
app.get("/api/inquiries", adminAuth, hasPermission("manage_inquiries"), async (_req, res) => {
  res.json({ success: true, inquiries: (await Inquiry.find().sort({ createdAt: -1 }).lean()).map(withId) });
});
app.post("/api/inquiries", async (req, res) => {
  const { name, businessName, email } = req.body;
  if (!name || !businessName || !email) return res.status(400).json({ success: false, message: "Name, business name, and email are required." });
  const plates = req.body.interestedPlates || req.body.interestedProducts || [];
  const inquiry = await Inquiry.create({ name, businessName, email: String(email).toLowerCase(), phone: req.body.phone || "", businessType: req.body.businessType || "restaurant", estimatedMonthlyVolume: req.body.estimatedMonthlyVolume || "1,000 - 5,000 plates", shippingAddress: req.body.shippingAddress || "", interestedPlates: plates, message: req.body.message || "", status: "new" });
  res.status(201).json({ success: true, inquiry: withId(inquiry), message: "Sample request received." });
});
app.patch("/api/inquiries/:id/status", adminAuth, hasPermission("manage_inquiries"), async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }).lean();
  if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
  res.json({ success: true, inquiry: withId(inquiry) });
});
app.post("/api/admin/auth/signup", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const bootstrapPassword = String(req.body.bootstrapPassword || "");
  const password = String(req.body.password || "");
  const admin = await Admin.findOne({ email });
  if (!admin || admin.status !== "active") return res.status(403).json({ success: false, message: "This email has not been invited as an active administrator." });
  if (password.length < 10) return res.status(400).json({ success: false, message: "Choose a password with at least 10 characters." });
  if (!await bcrypt.compare(bootstrapPassword, admin.passwordHash)) return res.status(401).json({ success: false, message: "Temporary administrator password is incorrect." });
  admin.passwordHash = await bcrypt.hash(password, 12);
  admin.lastActive = new Date();
  await admin.save();
  const token = signToken({ sub: admin.id, email: admin.email, type: "admin", role: admin.role, permissions: admin.permissions });
  res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, type: "admin", role: admin.role, permissions: admin.permissions } });
});
app.get("/api/admins", adminAuth, async (_req, res) => {
  const admins = await Admin.find().select("-passwordHash").sort({ createdAt: 1 }).lean();
  res.json({ success: true, admins: admins.map(withId), totalAdmins: admins.length });
});
app.post("/api/admins/check", auth, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const admin = await Admin.findOne({ email }).select("-passwordHash").lean();
  res.json({ success: true, isAdmin: !!admin && admin.status === "active", admin: admin || null });
});
app.post("/api/admins", adminAuth, hasPermission("manage_admins"), async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return res.status(400).json({ success: false, message: "Valid email is required." });
  const exists = await Admin.findOne({ email });
  const hash = await bcrypt.hash(process.env.ADMIN_BOOTSTRAP_PASSWORD, 12);
  if (exists) {
    exists.name = req.body.name || exists.name;
    exists.role = req.body.role || exists.role;
    exists.permissions = req.body.permissions || exists.permissions;
    exists.status = "active";
    await exists.save();
    return res.json({ success: true, admin: exists.toObject({ transform: (_d, ret) => {
      delete ret.passwordHash;
      return ret;
    } }) });
  }
  const admin = await Admin.create({ name: req.body.name || email.split("@")[0], email, passwordHash: hash, role: req.body.role || "operations_admin", permissions: req.body.permissions || ["manage_orders", "manage_inquiries"], addedBy: res.locals.admin.email, status: "active" });
  const out = admin.toObject();
  delete out.passwordHash;
  res.status(201).json({ success: true, admin: out });
});
app.put("/api/admins/:id", adminAuth, hasPermission("manage_admins"), async (req, res) => {
  const update = { ...req.body };
  delete update.passwordHash;
  delete update.email;
  const admin = await Admin.findOneAndUpdate(mongoose2.isValidObjectId(req.params.id) ? { _id: req.params.id } : { email: req.params.id.toLowerCase() }, { $set: update }, { new: true }).select("-passwordHash").lean();
  if (!admin) return res.status(404).json({ success: false, message: "Administrator not found" });
  res.json({ success: true, admin: withId(admin) });
});
app.delete("/api/admins/:id", adminAuth, hasPermission("manage_admins"), async (req, res) => {
  const target = await Admin.findOne(mongoose2.isValidObjectId(req.params.id) ? { _id: req.params.id } : { email: req.params.id.toLowerCase() });
  if (!target) return res.status(404).json({ success: false, message: "Administrator not found" });
  const config = await SystemConfig.findOne({ brandName: INITIAL_CONFIG.brandName }).lean();
  if (target.email === config?.firstAdminEmail?.toLowerCase()) return res.status(403).json({ success: false, message: "Cannot revoke the primary system owner." });
  await target.deleteOne();
  res.json({ success: true });
});
app.get("/api/users", adminAuth, hasPermission("manage_orders"), async (_req, res) => {
  res.json({ success: true, users: (await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean()).map(withId) });
});
var aiClient = null;
function getAiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return aiClient;
}
app.post("/api/ai/calculate-event", async (req, res) => {
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
        model: "gemini-2.5-flash",
        contents: `Return JSON only for a biodegradable plate recommendation for ${count} guests, ${meals} meals, event ${req.body.eventType || "event"}, style ${req.body.plateStyle || "10 inch dinner"}. Include recommendations and impactAnalysis.`,
        config: { responseMimeType: "application/json" }
      });
      if (response.text) return res.json({ success: true, calculation: JSON.parse(response.text), isAiGenerated: true });
    } catch (e) {
      console.warn("Gemini fallback:", e);
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
  if (!MONGO_URI) {
    throw new Error("MongoDB connection unavailable. Copy .env.example to .env and set MONGO_URI before starting the server.");
  }
  await mongoose2.connect(MONGO_URI, { serverSelectionTimeoutMS: 1e4 });
  console.log("Connected to the existing MongoDB Atlas cluster.");
  await seedDatabase();
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`BranPlate MERN server running on port ${PORT}`));
}
start().catch((err) => {
  console.error("MongoDB startup failed:", err);
  process.exit(1);
});
