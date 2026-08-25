export type PlateCategory = 'dinner' | 'compartment' | 'snack_dessert' | 'deep_rim' | 'bulk_packs';

export interface Product {
  id: string;
  name: string;
  category: PlateCategory;
  tagline: string;
  price: number; // in USD or INR equivalent
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  packSizes: { size: number; price: number; label: string; unitPrice: number }[];
  image: string;
  secondaryImages: string[];
  diameterOrSize: string;
  shape: 'Round' | 'Square' | 'Compartment / Thali' | 'Deep Rim Oval';
  heatResistance: string;
  shelfLife: string;
  decompositionTime: string;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  bestseller?: boolean;
  description: string;
  materials: string;
  suitableFor: string[];
  dimensions: string;
}

export interface CartItem {
  product: Product;
  packSizeIndex: number;
  quantity: number;
}

export interface Order {
  id: string;
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
  createdAt: string;
  trackingNumber: string;
  notes?: string;
}

export interface SampleInquiry {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: 'restaurant' | 'catering' | 'events' | 'retailer' | 'hotel' | 'corporate' | 'individual';
  estimatedMonthlyVolume: string;
  shippingAddress: string;
  interestedPlates?: string[];
  interestedProducts?: string[];
  message: string;
  status: 'new' | 'reviewed' | 'sample_dispatched' | 'closed';
  createdAt: string;
}

export interface ImpactStats {
  plasticPlatesReplaced: number;
  wheatBranUpcycledKg: number;
  co2SavedKg: number;
  landfillDivertedCubicMeters: number;
  farmerIncomeAugmentedINR: number;
}

export interface AppConfig {
  clientUrl: string;
  customDomain: string;
  firstAdminEmail: string;
  mongoUri: string;
  brandName: string;
  region: string;
  backendHost?: string;
  frontendHost?: string;
  databaseStatus?: 'connected' | 'connecting' | 'fallback_memory';
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactHours?: string;
  gstinNumber?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  totalOrdersCount: number;
  totalSpent: number;
  lastLogin?: string;
}

export type AdminRole = 'super_admin' | 'operations_admin' | 'inventory_manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  addedBy: string;
  createdAt: string;
  lastActive?: string;
  status: 'active' | 'suspended';
}
