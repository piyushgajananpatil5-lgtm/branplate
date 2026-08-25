import mongoose, { Schema } from 'mongoose';
const PlateSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    diameterOrSize: { type: String, default: '' },
    shape: { type: String, default: 'Round' },
    heatResistance: { type: String, default: '-20°C to +180°C' },
    shelfLife: { type: String, default: '24 Months' },
    decompositionTime: { type: String, default: '30 Days' },
    materials: { type: String, default: '100% Upcycled Agricultural Wheat Bran' },
    suitableFor: [{ type: String }],
    dimensions: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 1000 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    image: { type: String, required: true },
    secondaryImages: [{ type: String }],
    packSizes: [
        {
            size: { type: Number, required: true },
            price: { type: Number, required: true },
            label: { type: String, required: true },
            unitPrice: { type: Number, required: true }
        }
    ],
    description: { type: String, default: '' }
}, { timestamps: true });
const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        country: { type: String, default: 'India' }
    },
    items: [
        {
            productId: { type: String, required: true },
            productName: { type: String, required: true },
            packLabel: { type: String, required: true },
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            total: { type: Number, required: true },
            image: { type: String, default: '' }
        }
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'],
        default: 'confirmed'
    },
    paymentMethod: { type: String, default: 'UPI / Prepaid Gateway' },
    trackingNumber: { type: String, required: true },
    notes: { type: String, default: '' }
}, { timestamps: true });
const InquirySchema = new Schema({
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    businessType: { type: String, default: 'restaurant' },
    estimatedMonthlyVolume: { type: String, default: '1,000 - 5,000 plates' },
    shippingAddress: { type: String, default: '' },
    interestedPlates: [{ type: String }],
    message: { type: String, default: '' },
    status: { type: String, default: 'new' }
}, { timestamps: true });
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    shippingAddress: {
        street: String, city: String, state: String, zip: String, country: String
    },
    totalOrdersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastLogin: Date
}, { timestamps: true });
const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'operations_admin', 'inventory_manager'], default: 'operations_admin' },
    permissions: [{ type: String }],
    addedBy: { type: String, default: 'Super Administrator' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastActive: Date
}, { timestamps: true });
const ImpactSchema = new Schema({
    key: { type: String, unique: true, default: 'global' },
    plasticPlatesReplaced: { type: Number, default: 0 },
    wheatBranUpcycledKg: { type: Number, default: 0 },
    co2SavedKg: { type: Number, default: 0 },
    landfillDivertedCubicMeters: { type: Number, default: 0 },
    farmerIncomeAugmentedINR: { type: Number, default: 0 }
}, { timestamps: true });
const ConfigSchema = new Schema({
    clientUrl: { type: String, default: 'https://branplate-q6sx.vercel.app' },
    customDomain: { type: String, default: 'thelegend5.com' },
    firstAdminEmail: { type: String, default: 'piyushgajananpatil5@gmail.com' },
    mongoUri: { type: String, default: '' },
    brandName: { type: String, default: 'BranPlate' },
    region: { type: String, default: 'Central India · Circular Economy · Zero Landfill' }
}, { timestamps: true });
export const Plate = mongoose.models.Plate || mongoose.model('Plate', PlateSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', ConfigSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const Impact = mongoose.models.Impact || mongoose.model('Impact', ImpactSchema);
