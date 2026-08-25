import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Database, Globe, Mail, Package, RefreshCw, Layers, 
  CheckCircle2, Truck, AlertCircle, Save, ExternalLink, UserPlus, Users, 
  ShieldAlert, Key, Trash2, Check, UserCheck, Shield, ChevronDown, 
  Plus, DollarSign, PackagePlus, Phone, MapPin, Clock, Edit2, ImagePlus
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { AppConfig, Order, SampleInquiry, ImpactStats, AdminUser, AdminRole, Product, CustomerUser } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
  impact: ImpactStats;
  currentUserEmail?: string | null;
  onAdminsUpdated?: () => void;
  onProductsUpdated?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  impact,
  currentUserEmail,
  onAdminsUpdated,
  onProductsUpdated
}) => {

  const [activeTab, setActiveTab] = useState<'products' | 'contact' | 'admins' | 'orders' | 'users' | 'samples' | 'env'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<SampleInquiry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdTagline, setNewProdTagline] = useState('100% natural upcycled wheat bran from Central India');
  const [newProdCategory, setNewProdCategory] = useState<'dinner' | 'compartment' | 'snack_dessert' | 'deep_rim' | 'bulk_packs'>('dinner');
  const [newProdPrice, setNewProdPrice] = useState<number>(14.50);
  const [newProdStock, setNewProdStock] = useState<number>(10000);
  const [newProdSize, setNewProdSize] = useState<string>('10" Round (25.4 cm)');
  const [newProdImage, setNewProdImage] = useState<string>('/images/plates/biodegradable_wheat_bran_plate.png');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [productActionStatus, setProductActionStatus] = useState<string | null>(null);
  const [productActionError, setProductActionError] = useState<string | null>(null);

  // Price Editing State
  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(null);
  const [priceForm, setPriceForm] = useState<{ [key: string]: number }>({});

  // New Admin Form State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('operations_admin');
  const [newAdminPerms, setNewAdminPerms] = useState<string[]>([
    'manage_orders',
    'manage_inquiries'
  ]);
  const [adminActionStatus, setAdminActionStatus] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [searchAdminQuery, setSearchAdminQuery] = useState('');

  const readImageFile = (file: File): Promise<string> => new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file.'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image must be 5 MB or smaller.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const source = new Image();
      source.onload = () => {
        const maxDimension = 1400;
        const scale = Math.min(1, maxDimension / Math.max(source.width, source.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(source.width * scale));
        canvas.height = Math.max(1, Math.round(source.height * scale));
        canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      source.onerror = () => reject(new Error('Could not process the selected image.'));
      source.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });

  const handleNewProductImage = async (file?: File) => {
    if (!file) return;
    try {
      setImageUploadError(null);
      setNewProdImage(await readImageFile(file));
    } catch (err: any) {
      setImageUploadError(err.message);
    }
  };

  const handleProductImageUpdate = async (product: Product, file?: File) => {
    if (!file) return;
    try {
      setImageUploadError(null);
      const image = await readImageFile(file);
      const res = await apiFetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, secondaryImages: [image] })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save product image.');
      setProductActionStatus(`Image updated for ${product.name}!`);
      fetchData();
      if (onProductsUpdated) onProductsUpdated();
      setTimeout(() => setProductActionStatus(null), 3000);
    } catch (err: any) {
      setImageUploadError(err.message || 'Failed to update product image.');
    }
  };

  // Contact & Settings Form State
  const [contactForm, setContactForm] = useState({
    contactPhone: config.contactPhone || '+91 98234 56789',
    contactEmail: config.contactEmail || config.firstAdminEmail || 'piyushgajananpatil5@gmail.com',
    contactAddress: config.contactAddress || 'Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India',
    contactHours: config.contactHours || 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
    gstinNumber: config.gstinNumber || '27AAECB8821P1Z5'
  });

  const [envForm, setEnvForm] = useState({
    customDomain: config.customDomain || 'thelegend5.com',
    clientUrl: config.clientUrl || 'https://branplate-q6sx.vercel.app',
    firstAdminEmail: config.firstAdminEmail || 'piyushgajananpatil5@gmail.com',
    mongoUri: ''
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const availablePermissions = [
    { id: 'manage_admins', label: 'Grant & Revoke Admin Access', desc: 'Can make other users admin and manage roles' },
    { id: 'manage_products', label: 'Manage Products & Set Prices', desc: 'Can add biodegradable plates and adjust tier pricing' },
    { id: 'manage_orders', label: 'Manage Orders & Dispatch', desc: 'Can view, update tracking and fulfill plate orders' },
    { id: 'manage_inquiries', label: 'Process B2B Sample Leads', desc: 'Can approve and dispatch free tasting sample kits' },
    { id: 'edit_config', label: 'Edit Contact & Deployment Config', desc: 'Can change phone numbers, addresses, custom domains, and database settings' },
    { id: 'export_reports', label: 'Export ESG Impact & Financials', desc: 'Download CSV reports of plate shipments and CO2 savings' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resInq, resAdmins, resProds, resUsers] = await Promise.all([
        apiFetch('/api/orders'),
        apiFetch('/api/inquiries'),
        apiFetch('/api/admins'),
        apiFetch('/api/products'),
        apiFetch('/api/users')
      ]);
      const dataOrders = await resOrders.json();
      const dataInq = await resInq.json();
      const dataAdmins = await resAdmins.json();
      const dataProds = await resProds.json();
      const dataUsers = await resUsers.json();

      if (dataOrders.success) setOrders(dataOrders.orders);
      if (dataInq.success) setInquiries(dataInq.inquiries);
      if (dataAdmins.success) setAdmins(dataAdmins.admins);
      if (dataProds.success) setProducts(dataProds.products);
      if (dataUsers.success) setUsers(dataUsers.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  // Product Actions
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductActionStatus(null);
    setProductActionError(null);

    if (!newProdName.trim()) {
      setProductActionError('Product name is required');
      return;
    }

    const price = Number(newProdPrice) || 14.50;
    const newProductPayload = {
      name: newProdName.trim(),
      tagline: newProdTagline.trim(),
      category: newProdCategory,
      price: price,
      stockCount: Number(newProdStock) || 10000,
      diameterOrSize: newProdSize,
      image: newProdImage || '/images/plates/biodegradable_wheat_bran_plate.png',
      packSizes: [
        { size: 25, label: 'Pack of 25', price: price, unitPrice: Math.round((price / 25) * 100) / 100 },
        { size: 50, label: 'Pack of 50', price: Math.round(price * 1.85 * 100) / 100, unitPrice: Math.round(((price * 1.85) / 50) * 100) / 100 },
        { size: 100, label: 'Box of 100 (Catering)', price: Math.round(price * 3.5 * 100) / 100, unitPrice: Math.round(((price * 3.5) / 100) * 100) / 100 },
        { size: 500, label: 'Master Carton (500)', price: Math.round(price * 16.0 * 100) / 100, unitPrice: Math.round(((price * 16.0) / 500) * 100) / 100 }
      ]
    };

    try {
      const res = await apiFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductPayload)
      });
      const data = await res.json();
      if (data.success) {
        setProductActionStatus(`Product "${data.product.name}" created and added to store catalog!`);
        setNewProdName('');
        fetchData();
        if (onProductsUpdated) onProductsUpdated();
        setTimeout(() => setProductActionStatus(null), 3500);
      } else {
        setProductActionError(data.message || 'Failed to add product');
      }
    } catch (err: any) {
      setProductActionError('Network error adding product: ' + (err?.message || err));
    }
  };

  const handleStartEditPrice = (prod: Product) => {
    setEditingPriceProductId(prod.id);
    const initialPrices: { [key: string]: number } = { base: prod.price };
    prod.packSizes.forEach((pack, idx) => {
      initialPrices[`pack_${idx}`] = pack.price;
    });
    setPriceForm(initialPrices);
  };

  const handleSavePrices = async (product: Product) => {
    try {
      const newBasePrice = Number(priceForm.base) || product.price;
      const updatedPackSizes = product.packSizes.map((pack, idx) => {
        const customPrice = priceForm[`pack_${idx}`] !== undefined ? Number(priceForm[`pack_${idx}`]) : pack.price;
        return {
          ...pack,
          price: customPrice,
          unitPrice: Math.round((customPrice / (pack.size || 25)) * 100) / 100
        };
      });

      const res = await apiFetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: newBasePrice,
          packSizes: updatedPackSizes
        })
      });

      const data = await res.json();
      if (data.success) {
        setEditingPriceProductId(null);
        setProductActionStatus(`Prices updated for ${product.name}!`);
        fetchData();
        if (onProductsUpdated) onProductsUpdated();
        setTimeout(() => setProductActionStatus(null), 3000);
      }
    } catch (err) {
      console.error('Error saving prices:', err);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (products.length <= 1) {
      alert('Cannot delete the last remaining biodegradable plate product.');
      return;
    }
    if (!confirm(`Are you sure you want to remove "${product.name}" from the store catalog?`)) return;

    try {
      const res = await apiFetch(`/api/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProductActionStatus(`Product "${product.name}" deleted.`);
        fetchData();
        if (onProductsUpdated) onProductsUpdated();
        setTimeout(() => setProductActionStatus(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Contact Info Save
  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateConfig(contactForm);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving contact info:', err);
    }
  };

  // Env Config Save
  const handleSaveEnvConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envForm)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateConfig(envForm);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving env config:', err);
    }
  };

  // Admin Management Actions
  const handleRolePreset = (role: AdminRole) => {
    setNewAdminRole(role);
    if (role === 'super_admin') {
      setNewAdminPerms(['manage_admins', 'manage_products', 'manage_orders', 'manage_inquiries', 'edit_config', 'export_reports']);
    } else if (role === 'operations_admin') {
      setNewAdminPerms(['manage_products', 'manage_orders', 'manage_inquiries', 'export_reports']);
    } else if (role === 'inventory_manager') {
      setNewAdminPerms(['manage_products', 'manage_inquiries', 'export_reports']);
    }
  };

  const togglePermission = (permId: string) => {
    setNewAdminPerms(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId) 
        : [...prev, permId]
    );
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionStatus(null);
    setAdminActionError(null);

    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setAdminActionError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await apiFetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName.trim() || newAdminEmail.split('@')[0],
          email: newAdminEmail.trim().toLowerCase(),
          role: newAdminRole,
          permissions: newAdminPerms,
          addedBy: currentUserEmail || config.firstAdminEmail
        })
      });

      const data = await res.json();
      if (data.success) {
        setAdminActionStatus(data.message || 'Administrator added successfully!');
        setNewAdminName('');
        setNewAdminEmail('');
        handleRolePreset('operations_admin');
        fetchData();
        if (onAdminsUpdated) onAdminsUpdated();
        setTimeout(() => setAdminActionStatus(null), 3500);
      } else {
        setAdminActionError(data.message || 'Failed to grant admin access.');
      }
    } catch (err: any) {
      setAdminActionError('Network error adding administrator: ' + (err?.message || err));
    }
  };

  const handleRevokeAdmin = async (admin: AdminUser) => {
    if (admin.email.toLowerCase() === config.firstAdminEmail.toLowerCase()) {
      alert('Cannot revoke master owner admin access.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke admin access for ${admin.name} (${admin.email})?`)) return;

    try {
      const res = await apiFetch(`/api/admins/${admin.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminActionStatus(`Admin access revoked for ${admin.name}.`);
        fetchData();
        if (onAdminsUpdated) onAdminsUpdated();
        setTimeout(() => setAdminActionStatus(null), 3000);
      }
    } catch (err) {
      console.error('Error revoking admin:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleUpdateInquiryStatus = async (inqId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/inquiries/${inqId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => i.id === inqId ? { ...i, status: newStatus as any } : i));
      }
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchAdminQuery.toLowerCase())
  );

  if (!isOpen) return null;
  return (
    <div id="admin-portal-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        id="admin-portal-modal"
        className="bg-[#1C1A17] text-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-[#443E38] my-auto"
      >
        {/* Admin Header */}
        <div className="p-5 sm:p-6 border-b border-[#332E28] flex items-center justify-between bg-[#151311]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D2A26] border border-[#524B42] flex items-center justify-center text-[#E8C58C] shadow-inner">
              <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F3EEEA]">BranPlate Management Hub</h3>
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-mono px-2 py-0.5 rounded border border-[#10B981]/30">
                  Live RBAC Enabled
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Admin: <span className="text-[#E8C58C]">{currentUserEmail || config.firstAdminEmail}</span> · Domain: {config.customDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-[#2D2A26] hover:bg-[#3D3832] text-neutral-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="close-admin-portal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#2D2A26] hover:bg-neutral-800 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#332E28] bg-[#221F1B] px-4 sm:px-6 overflow-x-auto">
          <button
            id="tab-products-btn"
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PackagePlus className="w-4 h-4 text-[#C28236]" />
            <span>Products & Set Prices</span>
            <span className="bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white">
              {products.length}
            </span>
          </button>

          <button
            id="tab-contact-btn"
            onClick={() => setActiveTab('contact')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Phone className="w-4 h-4 text-[#10B981]" />
            <span>Change Contact Info</span>
          </button>

          <button
            id="tab-admins-btn"
            onClick={() => setActiveTab('admins')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'admins'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4 text-[#38BDF8]" />
            <span>Grant Admin Access</span>
            <span className="bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white">
              {admins.length}
            </span>
          </button>

          <button
            id="tab-orders-btn"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Truck className="w-4 h-4 text-[#F59E0B]" />
            <span>Orders & Dispatch</span>
            <span className="bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white">
              {orders.length}
            </span>
          </button>

          <button
            id="tab-users-btn"
            onClick={() => setActiveTab('users')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#A78BFA]" />
            <span>Customer Logins</span>
            <span className="bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white">
              {users.length}
            </span>
          </button>

          <button
            id="tab-samples-btn"
            onClick={() => setActiveTab('samples')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'samples'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4 text-[#34D399]" />
            <span>Sample Requests</span>
            <span className="bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white">
              {inquiries.length}
            </span>
          </button>

          <button
            id="tab-env-btn"
            onClick={() => setActiveTab('env')}
            className={`py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'env'
                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-4 h-4 text-neutral-400" />
            <span>Vercel / Render Settings</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

          {/* ================= TAB 1: PRODUCTS & SET PRICES ================= */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              {productActionStatus && (
                <div className="p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{productActionStatus}</span>
                </div>
              )}
              {productActionError && (
                <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{productActionError}</span>
                </div>
              )}

              {/* Add New Product Form */}
              <div className="bg-[#24211D] p-5 sm:p-6 rounded-2xl border border-[#3E3832]">
                <h4 className="text-sm font-mono uppercase font-bold text-[#E8C58C] flex items-center gap-2 mb-4">
                  <Plus className="w-4 h-4 text-[#10B981]" /> Add New Biodegradable Plate / Variant
                </h4>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Plate Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10&quot; Heavy-Duty Wheat Bran Dinner Plate"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Base Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="14.50"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-[#E8C58C] focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-neutral-200"
                      >
                        <option value="dinner">10" Dinner Plate</option>
                        <option value="compartment">3-Compartment Thali Plate</option>
                        <option value="snack_dessert">8" Snack & Dessert Plate</option>
                        <option value="deep_rim">Deep Rim Bowl Plate</option>
                        <option value="bulk_packs">Bulk Event Master Carton</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Diameter / Dimensions</label>
                      <input
                        type="text"
                        value={newProdSize}
                        onChange={(e) => setNewProdSize(e.target.value)}
                        placeholder="e.g. 10&quot; Round (25.4 cm)"
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Stock Quantity (Units)</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value))}
                        placeholder="10000"
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Tagline & Description</label>
                    <input
                      type="text"
                      value={newProdTagline}
                      onChange={(e) => setNewProdTagline(e.target.value)}
                      placeholder="100% natural upcycled wheat bran from Central India"
                      className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Product Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <img
                        src={newProdImage}
                        alt="New product preview"
                        className="w-16 h-16 rounded-xl object-contain bg-white/10 p-1 border border-[#443E38]"
                      />
                      <label className="cursor-pointer px-3 py-2 rounded-xl border border-[#524B42] bg-[#171513] text-xs text-[#E8C58C] hover:bg-[#2D2A26] transition-colors inline-flex items-center gap-2 w-fit">
                        <ImagePlus className="w-4 h-4" />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handleNewProductImage(e.target.files?.[0])}
                        />
                      </label>
                      <span className="text-[11px] text-neutral-500">PNG, JPG, WEBP up to 5 MB</span>
                    </div>
                    {imageUploadError && <p className="mt-2 text-xs text-red-300">{imageUploadError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Publish Biodegradable Plate</span>
                  </button>
                </form>
              </div>

              {/* Existing Products & Price Setting List */}
              <div className="space-y-4">
                <h4 className="text-sm font-mono uppercase font-bold text-neutral-300 flex items-center justify-between">
                  <span>Active Biodegradable Plates & Set Prices ({products.length})</span>
                  <span className="text-xs text-neutral-500 font-normal">Click "Set Prices" to edit pack tiers</span>
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {products.map((prod) => {
                    const isEditing = editingPriceProductId === prod.id;
                    return (
                      <div 
                        key={prod.id} 
                        className="bg-[#24211D] rounded-2xl border border-[#3E3832] p-5 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#332E28] pb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-14 h-14 rounded-xl object-contain bg-white/10 p-1 border border-[#443E38]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-[#F3EEEA]">{prod.name}</h5>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#E8C58C]">
                                  {prod.diameterOrSize}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 mt-0.5">{prod.tagline}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label
                              className="cursor-pointer p-1.5 rounded-xl bg-[#2D2A26] border border-[#524B42] text-[#E8C58C] hover:bg-[#3D3832] transition-colors"
                              title="Replace Product Image"
                            >
                              <ImagePlus className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => handleProductImageUpdate(prod, e.target.files?.[0])}
                              />
                            </label>
                            {!isEditing ? (
                              <button
                                onClick={() => handleStartEditPrice(prod)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#2D2A26] border border-[#524B42] hover:bg-[#3D3832] text-xs font-mono text-[#E8C58C] flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Set Prices</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSavePrices(prod)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-colors shadow"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Prices</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteProduct(prod)}
                              className="p-1.5 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/50 hover:text-white transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price & Pack Tier Details */}
                        <div className="space-y-2">
                          <div className="text-xs font-mono font-semibold text-neutral-400 uppercase">
                            Pack Sizes & Set Pricing:
                          </div>

                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1A1815] p-3.5 rounded-xl border border-[#443E38]">
                              <div>
                                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Base Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={priceForm.base ?? prod.price}
                                  onChange={(e) => setPriceForm({ ...priceForm, base: parseFloat(e.target.value) })}
                                  className="w-full px-2.5 py-1.5 bg-[#121110] border border-[#524B42] rounded-lg text-xs font-mono text-[#E8C58C]"
                                />
                              </div>

                              {prod.packSizes.map((pack, idx) => (
                                <div key={idx}>
                                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                                    {pack.label} ($)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={priceForm[`pack_${idx}`] ?? pack.price}
                                    onChange={(e) => setPriceForm({ ...priceForm, [`pack_${idx}`]: parseFloat(e.target.value) })}
                                    className="w-full px-2.5 py-1.5 bg-[#121110] border border-[#524B42] rounded-lg text-xs font-mono text-[#E8C58C]"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {prod.packSizes.map((pack, idx) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-[#171513] border border-[#332E28] text-xs">
                                  <div className="text-neutral-400 text-[11px]">{pack.label}</div>
                                  <div className="font-mono font-bold text-sm text-[#E8C58C] mt-0.5">
                                    ${pack.price.toFixed(2)}
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500">
                                    ${pack.unitPrice.toFixed(2)} / pc
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: CHANGE CONTACT INFO ================= */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {savedSuccess && (
                <div className="p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Contact Information & Business Details Saved Successfully!</span>
                </div>
              )}

              <div className="bg-[#24211D] p-6 rounded-2xl border border-[#3E3832] space-y-6">
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F3EEEA]">
                    Live Contact & Company Details
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Update phone numbers, WhatsApp contact, support emails, operational address, and tax registration. Changes reflect across the website immediately.
                  </p>
                </div>

                <form onSubmit={handleSaveContactInfo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#10B981]" /> Direct Phone & WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.contactPhone}
                        onChange={(e) => setContactForm({ ...contactForm, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#38BDF8]" /> Support & Admin Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.contactEmail}
                        onChange={(e) => setContactForm({ ...contactForm, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C28236]" /> Manufacturing Facility & Dispatch Address
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.contactAddress}
                      onChange={(e) => setContactForm({ ...contactForm, contactAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F59E0B]" /> Business & Dispatch Hours
                      </label>
                      <input
                        type="text"
                        value={contactForm.contactHours}
                        onChange={(e) => setContactForm({ ...contactForm, contactHours: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">GSTIN / Tax ID Number</label>
                      <input
                        type="text"
                        value={contactForm.gstinNumber}
                        onChange={(e) => setContactForm({ ...contactForm, gstinNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Publish Contact Details</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 3: TEAM & ADMIN ACCESS ================= */}
          {activeTab === 'admins' && (
            <div className="space-y-8">
              {adminActionStatus && (
                <div className="p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{adminActionStatus}</span>
                </div>
              )}
              {adminActionError && (
                <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminActionError}</span>
                </div>
              )}

              {/* Add New Admin Card */}
              <div className="bg-[#24211D] p-5 sm:p-6 rounded-2xl border border-[#3E3832]">
                <h4 className="text-sm font-mono uppercase font-bold text-[#E8C58C] flex items-center gap-2 mb-4">
                  <UserPlus className="w-4 h-4 text-[#10B981]" /> Grant Admin Access To User
                </h4>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Admin Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. partner@branplate.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2">Assign Admin Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'super_admin', label: 'Super Administrator', desc: 'Full root access to all modules & admin management' },
                        { id: 'operations_admin', label: 'Operations Admin', desc: 'Can manage products, set prices, orders & B2B samples' },
                        { id: 'inventory_manager', label: 'Inventory & Support', desc: 'Can view orders, adjust prices & dispatch samples' }
                      ].map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRolePreset(role.id as AdminRole)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            newAdminRole === role.id
                              ? 'bg-[#2D2A26] border-[#E8C58C] text-white'
                              : 'bg-[#171513] border-[#332E28] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="font-bold text-xs flex items-center justify-between">
                            <span>{role.label}</span>
                            {newAdminRole === role.id && <Check className="w-3.5 h-3.5 text-[#E8C58C]" />}
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1">{role.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2 shadow-md"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Grant Administrator Access</span>
                  </button>
                </form>
              </div>

              {/* Admins List */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-sm font-mono uppercase font-bold text-neutral-300">
                    Active System Administrators ({admins.length})
                  </h4>
                  <input
                    type="text"
                    placeholder="Search admins by name or email..."
                    value={searchAdminQuery}
                    onChange={(e) => setSearchAdminQuery(e.target.value)}
                    className="px-3 py-1.5 bg-[#24211D] border border-[#3E3832] rounded-xl text-xs text-white w-full sm:w-64"
                  />
                </div>

                <div className="divide-y divide-[#332E28] bg-[#24211D] rounded-2xl border border-[#3E3832] overflow-hidden">
                  {filteredAdmins.map((adm) => (
                    <div key={adm.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#2A2723] transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#2D2A26] border border-[#443E38] flex items-center justify-center text-[#E8C58C] shrink-0">
                          <Shield className="w-4 h-4 text-[#10B981]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#F3EEEA]">{adm.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#E8C58C] border border-[#443E38]">
                              {adm.role.replace('_', ' ').toUpperCase()}
                            </span>
                            {adm.email.toLowerCase() === config.firstAdminEmail.toLowerCase() && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
                                Primary Master Owner
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-neutral-400 mt-0.5">
                            {adm.email}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-1">
                            Added: {new Date(adm.createdAt).toLocaleDateString()} by {adm.addedBy}
                          </div>
                        </div>
                      </div>

                      {adm.email.toLowerCase() !== config.firstAdminEmail.toLowerCase() && (
                        <button
                          onClick={() => handleRevokeAdmin(adm)}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900 hover:text-white text-xs font-mono transition-colors self-start sm:self-auto"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 4: ORDERS & DISPATCH ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-mono uppercase font-bold text-neutral-300">
                  Customer Plate Orders ({orders.length})
                </h4>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-[#24211D] p-5 rounded-2xl border border-[#3E3832] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#332E28] pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-[#E8C58C] text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {ord.customerName} ({ord.email})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#171513] border border-[#443E38] text-xs font-mono px-2.5 py-1 rounded-lg text-[#10B981]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <span className="font-mono font-bold text-sm text-white">
                            ${ord.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-400 space-y-1">
                        <div>
                          <strong>Items:</strong> {ord.items.map(i => `${i.quantity}x ${i.productName} (${i.packLabel})`).join(', ')}
                        </div>
                        <div>
                          <strong>Destination:</strong> {ord.address.street}, {ord.address.city}, {ord.address.state} ({ord.address.zip})
                        </div>
                        <div className="font-mono text-[11px] text-[#C28236]">
                          Tracking: {ord.trackingNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: CUSTOMER LOGINS ================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-mono uppercase font-bold text-neutral-300">
                  Registered Customer Accounts ({users.length})
                </h4>
                <span className="text-xs text-neutral-500 font-mono">
                  Auto-created upon purchases & sign-ins
                </span>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  No customers registered yet. Customer logins are auto-created when orders are placed.
                </div>
              ) : (
                <div className="divide-y divide-[#332E28] bg-[#24211D] rounded-2xl border border-[#3E3832] overflow-hidden">
                  {users.map((usr) => (
                    <div key={usr.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#2A2723] transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#2D2A26] border border-[#443E38] flex items-center justify-center text-[#E8C58C] shrink-0">
                          <UserCheck className="w-4 h-4 text-[#A78BFA]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#F3EEEA]">{usr.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#A78BFA]">
                              {usr.totalOrdersCount || 0} Orders
                            </span>
                          </div>
                          <div className="text-xs font-mono text-neutral-400 mt-0.5">
                            {usr.email} {usr.phone && `· ${usr.phone}`}
                          </div>
                          {usr.shippingAddress && (
                            <div className="text-[11px] text-neutral-500 mt-1">
                              {usr.shippingAddress.street}, {usr.shippingAddress.city}, {usr.shippingAddress.state}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono text-neutral-400">Total Spent</div>
                        <div className="font-mono font-bold text-sm text-[#E8C58C]">
                          ${(usr.totalSpent || 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          Active: {new Date(usr.lastLogin || usr.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: B2B SAMPLES ================= */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <h4 className="text-sm font-mono uppercase font-bold text-neutral-300">
                B2B Tasting Sample Requests ({inquiries.length})
              </h4>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  No sample requests logged yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-[#24211D] p-5 rounded-2xl border border-[#3E3832] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#332E28] pb-3">
                        <div>
                          <div className="font-bold text-sm text-white">
                            {inq.companyName || inq.contactName}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            {inq.email} · {inq.phone}
                          </div>
                        </div>

                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="bg-[#171513] border border-[#443E38] text-xs font-mono px-2.5 py-1 rounded-lg text-[#E8C58C]"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="sample_sent">Sample Sent</option>
                          <option value="approved">Approved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className="text-xs text-neutral-400 space-y-1">
                        <div>
                          <strong>Business Type:</strong> {inq.businessType} (Monthly Volume: {inq.estimatedMonthlyVolume})
                        </div>
                        <div>
                          <strong>Requested Plates:</strong> {(inq.interestedPlates || inq.interestedProducts || []).join(', ')}
                        </div>
                        <div>
                          <strong>Address:</strong> {inq.deliveryAddress.street}, {inq.deliveryAddress.city}, {inq.deliveryAddress.state}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 7: VERCEL & RENDER SETTINGS ================= */}
          {activeTab === 'env' && (
            <div className="space-y-6">
              {savedSuccess && (
                <div className="p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Deployment Configuration Saved!</span>
                </div>
              )}

              <form onSubmit={handleSaveEnvConfig} className="bg-[#24211D] p-6 rounded-2xl border border-[#3E3832] space-y-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F3EEEA]">
                    Vercel Frontend & Render Backend Settings
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage your production custom domain and MongoDB connection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Custom Domain</label>
                    <input
                      type="text"
                      value={envForm.customDomain}
                      onChange={(e) => setEnvForm({ ...envForm, customDomain: e.target.value })}
                      className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Vercel Deployment URL</label>
                    <input
                      type="text"
                      value={envForm.clientUrl}
                      onChange={(e) => setEnvForm({ ...envForm, clientUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">MongoDB Atlas Connection String</label>
                  <input
                    type="text"
                    value={envForm.mongoUri}
                    onChange={(e) => setEnvForm({ ...envForm, mongoUri: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-neutral-300"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Deployment Settings</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
