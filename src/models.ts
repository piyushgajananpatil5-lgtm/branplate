import mongoose, { Schema, Document } from 'mongoose';

// 1. Plate Schema (MERN Product Model)
export interface IPlate extends Document {
  id: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  diameterOrSize: string;
  shape: string;
  heatResistance: string;
  shelfLife: string;
  decompositionTime: string;
  materials: string;
  suitableFor: string[];
  dimensions: string;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  bestseller: boolean;
  image: string;
  secondaryImages: string[];
  packSizes: { size: number; price: number; label: string; unitPrice: number }[];
  description: string;
}

const PlateSchema = new Schema<IPlate>(
  {
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
  },
  { timestamps: true }
);

// 2. Order Schema (MERN Order Model)
export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    productId: string;
    productName: string;
    packLabel: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  trackingNumber: string;
  notes?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
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
  },
  { timestamps: true }
);

// 3. Sample Inquiry Schema (B2B Leads Model)
export interface IInquiry extends Document {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  estimatedMonthlyVolume: string;
  shippingAddress: string;
  interestedPlates: string[];
  message: string;
  status: string;
}

const InquirySchema = new Schema<IInquiry>(
  {
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
  },
  { timestamps: true }
);

// 4. App Configuration & Settings Schema
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  shippingAddress?: {
    street: string; city: string; state: string; zip: string; country: string;
  };
  totalOrdersCount: number;
  totalSpent: number;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
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

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'operations_admin' | 'inventory_manager';
  permissions: string[];
  addedBy: string;
  status: 'active' | 'suspended';
  lastActive?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'operations_admin', 'inventory_manager'], default: 'operations_admin' },
  permissions: [{ type: String }],
  addedBy: { type: String, default: 'Super Administrator' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  lastActive: Date
}, { timestamps: true });

export interface IImpact extends Document {
  key: string;
  plasticPlatesReplaced: number;
  wheatBranUpcycledKg: number;
  co2SavedKg: number;
  landfillDivertedCubicMeters: number;
  farmerIncomeAugmentedINR: number;
}
const ImpactSchema = new Schema<IImpact>({
  key: { type: String, unique: true, default: 'global' },
  plasticPlatesReplaced: { type: Number, default: 0 },
  wheatBranUpcycledKg: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  landfillDivertedCubicMeters: { type: Number, default: 0 },
  farmerIncomeAugmentedINR: { type: Number, default: 0 }
}, { timestamps: true });

export interface IConfigDoc extends Document {
  clientUrl: string;
  customDomain: string;
  firstAdminEmail: string;
  mongoUri: string;
  brandName: string;
  region: string;
  tagline?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactHours?: string;
  gstinNumber?: string;
}

const ConfigSchema = new Schema<IConfigDoc>(
  {
    clientUrl: { type: String, default: 'https://branplate-q6sx.vercel.app' },
    customDomain: { type: String, default: 'thelegend5.com' },
    firstAdminEmail: { type: String, default: 'piyushgajananpatil5@gmail.com' },
    mongoUri: { type: String, default: '' },
    brandName: { type: String, default: 'BranPlate' },
    region: { type: String, default: 'Central India · Circular Economy · Zero Landfill' }
  },
  { timestamps: true }
);

export const Plate = mongoose.models.Plate || mongoose.model<IPlate>('Plate', PlateSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
export const SystemConfig = mongoose.models.SystemConfig || mongoose.model<IConfigDoc>('SystemConfig', ConfigSchema);
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export const Impact = mongoose.models.Impact || mongoose.model<IImpact>('Impact', ImpactSchema);
