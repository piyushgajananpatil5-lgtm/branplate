import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Database, Mail, RefreshCw, Layers, CheckCircle2, Truck, AlertCircle, Save, UserPlus, Users, Trash2, Check, UserCheck, Shield, Plus, PackagePlus, Phone, MapPin, Clock, Edit2 } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
export const AdminPortal = ({ isOpen, onClose, config, onUpdateConfig, impact, currentUserEmail, onAdminsUpdated, onProductsUpdated }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [orders, setOrders] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    // New Product Form State
    const [newProdName, setNewProdName] = useState('');
    const [newProdTagline, setNewProdTagline] = useState('100% natural upcycled wheat bran from Central India');
    const [newProdCategory, setNewProdCategory] = useState('dinner');
    const [newProdPrice, setNewProdPrice] = useState(14.50);
    const [newProdStock, setNewProdStock] = useState(10000);
    const [newProdSize, setNewProdSize] = useState('10" Round (25.4 cm)');
    const [newProdImage, setNewProdImage] = useState('/images/plates/biodegradable_wheat_bran_plate.png');
    const [productActionStatus, setProductActionStatus] = useState(null);
    const [productActionError, setProductActionError] = useState(null);
    // Price Editing State
    const [editingPriceProductId, setEditingPriceProductId] = useState(null);
    const [priceForm, setPriceForm] = useState({});
    // New Admin Form State
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('operations_admin');
    const [newAdminPerms, setNewAdminPerms] = useState([
        'manage_orders',
        'manage_inquiries'
    ]);
    const [adminActionStatus, setAdminActionStatus] = useState(null);
    const [adminActionError, setAdminActionError] = useState(null);
    const [searchAdminQuery, setSearchAdminQuery] = useState('');
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
    const [savedSuccess, setSavedSuccess] = useState(false);
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
            if (dataOrders.success)
                setOrders(dataOrders.orders);
            if (dataInq.success)
                setInquiries(dataInq.inquiries);
            if (dataAdmins.success)
                setAdmins(dataAdmins.admins);
            if (dataProds.success)
                setProducts(dataProds.products);
            if (dataUsers.success)
                setUsers(dataUsers.users);
        }
        catch (err) {
            console.error('Error fetching admin data:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isOpen)
            fetchData();
    }, [isOpen]);
    // Product Actions
    const handleAddProduct = async (e) => {
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
                if (onProductsUpdated)
                    onProductsUpdated();
                setTimeout(() => setProductActionStatus(null), 3500);
            }
            else {
                setProductActionError(data.message || 'Failed to add product');
            }
        }
        catch (err) {
            setProductActionError('Network error adding product: ' + (err?.message || err));
        }
    };
    const handleStartEditPrice = (prod) => {
        setEditingPriceProductId(prod.id);
        const initialPrices = { base: prod.price };
        prod.packSizes.forEach((pack, idx) => {
            initialPrices[`pack_${idx}`] = pack.price;
        });
        setPriceForm(initialPrices);
    };
    const handleSavePrices = async (product) => {
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
                if (onProductsUpdated)
                    onProductsUpdated();
                setTimeout(() => setProductActionStatus(null), 3000);
            }
        }
        catch (err) {
            console.error('Error saving prices:', err);
        }
    };
    const handleDeleteProduct = async (product) => {
        if (products.length <= 1) {
            alert('Cannot delete the last remaining biodegradable plate product.');
            return;
        }
        if (!confirm(`Are you sure you want to remove "${product.name}" from the store catalog?`))
            return;
        try {
            const res = await apiFetch(`/api/products/${product.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProductActionStatus(`Product "${product.name}" deleted.`);
                fetchData();
                if (onProductsUpdated)
                    onProductsUpdated();
                setTimeout(() => setProductActionStatus(null), 3000);
            }
        }
        catch (err) {
            console.error('Error deleting product:', err);
        }
    };
    // Contact Info Save
    const handleSaveContactInfo = async (e) => {
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
        }
        catch (err) {
            console.error('Error saving contact info:', err);
        }
    };
    // Env Config Save
    const handleSaveEnvConfig = async (e) => {
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
        }
        catch (err) {
            console.error('Error saving env config:', err);
        }
    };
    // Admin Management Actions
    const handleRolePreset = (role) => {
        setNewAdminRole(role);
        if (role === 'super_admin') {
            setNewAdminPerms(['manage_admins', 'manage_products', 'manage_orders', 'manage_inquiries', 'edit_config', 'export_reports']);
        }
        else if (role === 'operations_admin') {
            setNewAdminPerms(['manage_products', 'manage_orders', 'manage_inquiries', 'export_reports']);
        }
        else if (role === 'inventory_manager') {
            setNewAdminPerms(['manage_products', 'manage_inquiries', 'export_reports']);
        }
    };
    const togglePermission = (permId) => {
        setNewAdminPerms(prev => prev.includes(permId)
            ? prev.filter(p => p !== permId)
            : [...prev, permId]);
    };
    const handleCreateAdmin = async (e) => {
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
                if (onAdminsUpdated)
                    onAdminsUpdated();
                setTimeout(() => setAdminActionStatus(null), 3500);
            }
            else {
                setAdminActionError(data.message || 'Failed to grant admin access.');
            }
        }
        catch (err) {
            setAdminActionError('Network error adding administrator: ' + (err?.message || err));
        }
    };
    const handleRevokeAdmin = async (admin) => {
        if (admin.email.toLowerCase() === config.firstAdminEmail.toLowerCase()) {
            alert('Cannot revoke master owner admin access.');
            return;
        }
        if (!confirm(`Are you sure you want to revoke admin access for ${admin.name} (${admin.email})?`))
            return;
        try {
            const res = await apiFetch(`/api/admins/${admin.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setAdminActionStatus(`Admin access revoked for ${admin.name}.`);
                fetchData();
                if (onAdminsUpdated)
                    onAdminsUpdated();
                setTimeout(() => setAdminActionStatus(null), 3000);
            }
        }
        catch (err) {
            console.error('Error revoking admin:', err);
        }
    };
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await apiFetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        }
        catch (err) {
            console.error('Error updating order:', err);
        }
    };
    const handleUpdateInquiryStatus = async (inqId, newStatus) => {
        try {
            const res = await apiFetch(`/api/inquiries/${inqId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setInquiries(prev => prev.map(i => i.id === inqId ? { ...i, status: newStatus } : i));
            }
        }
        catch (err) {
            console.error('Error updating inquiry status:', err);
        }
    };
    const filteredAdmins = admins.filter(a => a.name.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchAdminQuery.toLowerCase()));
    if (!isOpen)
        return null;
    return (_jsx("div", { id: "admin-portal-backdrop", className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto", children: _jsxs("div", { id: "admin-portal-modal", className: "bg-[#1C1A17] text-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-[#443E38] my-auto", children: [_jsxs("div", { className: "p-5 sm:p-6 border-b border-[#332E28] flex items-center justify-between bg-[#151311]", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-[#2D2A26] border border-[#524B42] flex items-center justify-center text-[#E8C58C] shadow-inner", children: _jsx(ShieldCheck, { className: "w-6 h-6 text-[#10B981]" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-serif font-bold text-lg sm:text-xl text-[#F3EEEA]", children: "BranPlate Management Hub" }), _jsx("span", { className: "text-[10px] bg-[#10B981]/20 text-[#10B981] font-mono px-2 py-0.5 rounded border border-[#10B981]/30", children: "Live RBAC Enabled" })] }), _jsxs("p", { className: "text-xs text-neutral-400 font-mono", children: ["Admin: ", _jsx("span", { className: "text-[#E8C58C]", children: currentUserEmail || config.firstAdminEmail }), " \u00B7 Domain: ", config.customDomain] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: fetchData, className: "p-2 rounded-xl bg-[#2D2A26] hover:bg-[#3D3832] text-neutral-300 transition-colors", title: "Refresh Data", children: _jsx(RefreshCw, { className: `w-4 h-4 ${loading ? 'animate-spin' : ''}` }) }), _jsx("button", { id: "close-admin-portal-btn", onClick: onClose, className: "p-2 rounded-xl bg-[#2D2A26] hover:bg-neutral-800 text-white transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "flex border-b border-[#332E28] bg-[#221F1B] px-4 sm:px-6 overflow-x-auto", children: [_jsxs("button", { id: "tab-products-btn", onClick: () => setActiveTab('products'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'products'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(PackagePlus, { className: "w-4 h-4 text-[#C28236]" }), _jsx("span", { children: "Products & Set Prices" }), _jsx("span", { className: "bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white", children: products.length })] }), _jsxs("button", { id: "tab-contact-btn", onClick: () => setActiveTab('contact'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'contact'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(Phone, { className: "w-4 h-4 text-[#10B981]" }), _jsx("span", { children: "Change Contact Info" })] }), _jsxs("button", { id: "tab-admins-btn", onClick: () => setActiveTab('admins'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'admins'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(Users, { className: "w-4 h-4 text-[#38BDF8]" }), _jsx("span", { children: "Grant Admin Access" }), _jsx("span", { className: "bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white", children: admins.length })] }), _jsxs("button", { id: "tab-orders-btn", onClick: () => setActiveTab('orders'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'orders'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(Truck, { className: "w-4 h-4 text-[#F59E0B]" }), _jsx("span", { children: "Orders & Dispatch" }), _jsx("span", { className: "bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white", children: orders.length })] }), _jsxs("button", { id: "tab-users-btn", onClick: () => setActiveTab('users'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'users'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(UserCheck, { className: "w-4 h-4 text-[#A78BFA]" }), _jsx("span", { children: "Customer Logins" }), _jsx("span", { className: "bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white", children: users.length })] }), _jsxs("button", { id: "tab-samples-btn", onClick: () => setActiveTab('samples'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'samples'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(Layers, { className: "w-4 h-4 text-[#34D399]" }), _jsx("span", { children: "Sample Requests" }), _jsx("span", { className: "bg-[#3D3832] text-xs px-1.5 py-0.2 rounded font-mono text-white", children: inquiries.length })] }), _jsxs("button", { id: "tab-env-btn", onClick: () => setActiveTab('env'), className: `py-3.5 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'env'
                                ? 'border-[#E8C58C] text-[#E8C58C] bg-[#2D2A26]/50'
                                : 'border-transparent text-neutral-400 hover:text-neutral-200'}`, children: [_jsx(Database, { className: "w-4 h-4 text-neutral-400" }), _jsx("span", { children: "Vercel / Render Settings" })] })] }), _jsxs("div", { className: "p-5 sm:p-7 overflow-y-auto flex-1 space-y-6", children: [activeTab === 'products' && (_jsxs("div", { className: "space-y-8", children: [productActionStatus && (_jsxs("div", { className: "p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: productActionStatus })] })), productActionError && (_jsxs("div", { className: "p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: productActionError })] })), _jsxs("div", { className: "bg-[#24211D] p-5 sm:p-6 rounded-2xl border border-[#3E3832]", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-[#E8C58C] flex items-center gap-2 mb-4", children: [_jsx(Plus, { className: "w-4 h-4 text-[#10B981]" }), " Add New Biodegradable Plate / Variant"] }), _jsxs("form", { onSubmit: handleAddProduct, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Plate Name *" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. 10\" Heavy-Duty Wheat Bran Dinner Plate", value: newProdName, onChange: (e) => setNewProdName(e.target.value), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Base Price ($) *" }), _jsx("input", { type: "number", step: "0.01", required: true, placeholder: "14.50", value: newProdPrice, onChange: (e) => setNewProdPrice(parseFloat(e.target.value)), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-[#E8C58C] focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Category" }), _jsxs("select", { value: newProdCategory, onChange: (e) => setNewProdCategory(e.target.value), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-neutral-200", children: [_jsx("option", { value: "dinner", children: "10\" Dinner Plate" }), _jsx("option", { value: "compartment", children: "3-Compartment Thali Plate" }), _jsx("option", { value: "snack_dessert", children: "8\" Snack & Dessert Plate" }), _jsx("option", { value: "deep_rim", children: "Deep Rim Bowl Plate" }), _jsx("option", { value: "bulk_packs", children: "Bulk Event Master Carton" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Diameter / Dimensions" }), _jsx("input", { type: "text", value: newProdSize, onChange: (e) => setNewProdSize(e.target.value), placeholder: "e.g. 10\" Round (25.4 cm)", className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Stock Quantity (Units)" }), _jsx("input", { type: "number", value: newProdStock, onChange: (e) => setNewProdStock(parseInt(e.target.value)), placeholder: "10000", className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Tagline & Description" }), _jsx("input", { type: "text", value: newProdTagline, onChange: (e) => setNewProdTagline(e.target.value), placeholder: "100% natural upcycled wheat bran from Central India", className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-neutral-300" })] }), _jsxs("button", { type: "submit", className: "px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2 shadow-md", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Create & Publish Biodegradable Plate" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-neutral-300 flex items-center justify-between", children: [_jsxs("span", { children: ["Active Biodegradable Plates & Set Prices (", products.length, ")"] }), _jsx("span", { className: "text-xs text-neutral-500 font-normal", children: "Click \"Set Prices\" to edit pack tiers" })] }), _jsx("div", { className: "grid grid-cols-1 gap-4", children: products.map((prod) => {
                                                const isEditing = editingPriceProductId === prod.id;
                                                return (_jsxs("div", { className: "bg-[#24211D] rounded-2xl border border-[#3E3832] p-5 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#332E28] pb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: prod.image, alt: prod.name, className: "w-14 h-14 rounded-xl object-contain bg-white/10 p-1 border border-[#443E38]", referrerPolicy: "no-referrer" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h5", { className: "font-bold text-sm text-[#F3EEEA]", children: prod.name }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#E8C58C]", children: prod.diameterOrSize })] }), _jsx("p", { className: "text-xs text-neutral-400 mt-0.5", children: prod.tagline })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [!isEditing ? (_jsxs("button", { onClick: () => handleStartEditPrice(prod), className: "px-3.5 py-1.5 rounded-xl bg-[#2D2A26] border border-[#524B42] hover:bg-[#3D3832] text-xs font-mono text-[#E8C58C] flex items-center gap-1.5 transition-colors", children: [_jsx(Edit2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Set Prices" })] })) : (_jsxs("button", { onClick: () => handleSavePrices(prod), className: "px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-colors shadow", children: [_jsx(Save, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Save Prices" })] })), _jsx("button", { onClick: () => handleDeleteProduct(prod), className: "p-1.5 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/50 hover:text-white transition-colors", title: "Delete Product", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-xs font-mono font-semibold text-neutral-400 uppercase", children: "Pack Sizes & Set Pricing:" }), isEditing ? (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1A1815] p-3.5 rounded-xl border border-[#443E38]", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-mono text-neutral-400 mb-1", children: "Base Price ($)" }), _jsx("input", { type: "number", step: "0.01", value: priceForm.base ?? prod.price, onChange: (e) => setPriceForm({ ...priceForm, base: parseFloat(e.target.value) }), className: "w-full px-2.5 py-1.5 bg-[#121110] border border-[#524B42] rounded-lg text-xs font-mono text-[#E8C58C]" })] }), prod.packSizes.map((pack, idx) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-[11px] font-mono text-neutral-400 mb-1", children: [pack.label, " ($)"] }), _jsx("input", { type: "number", step: "0.01", value: priceForm[`pack_${idx}`] ?? pack.price, onChange: (e) => setPriceForm({ ...priceForm, [`pack_${idx}`]: parseFloat(e.target.value) }), className: "w-full px-2.5 py-1.5 bg-[#121110] border border-[#524B42] rounded-lg text-xs font-mono text-[#E8C58C]" })] }, idx)))] })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5", children: prod.packSizes.map((pack, idx) => (_jsxs("div", { className: "p-2.5 rounded-xl bg-[#171513] border border-[#332E28] text-xs", children: [_jsx("div", { className: "text-neutral-400 text-[11px]", children: pack.label }), _jsxs("div", { className: "font-mono font-bold text-sm text-[#E8C58C] mt-0.5", children: ["$", pack.price.toFixed(2)] }), _jsxs("div", { className: "text-[10px] font-mono text-neutral-500", children: ["$", pack.unitPrice.toFixed(2), " / pc"] })] }, idx))) }))] })] }, prod.id));
                                            }) })] })] })), activeTab === 'contact' && (_jsxs("div", { className: "space-y-6", children: [savedSuccess && (_jsxs("div", { className: "p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: "Contact Information & Business Details Saved Successfully!" })] })), _jsxs("div", { className: "bg-[#24211D] p-6 rounded-2xl border border-[#3E3832] space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-base font-serif font-bold text-[#F3EEEA]", children: "Live Contact & Company Details" }), _jsx("p", { className: "text-xs text-neutral-400 mt-1", children: "Update phone numbers, WhatsApp contact, support emails, operational address, and tax registration. Changes reflect across the website immediately." })] }), _jsxs("form", { onSubmit: handleSaveContactInfo, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-[#10B981]" }), " Direct Phone & WhatsApp *"] }), _jsx("input", { type: "text", required: true, value: contactForm.contactPhone, onChange: (e) => setContactForm({ ...contactForm, contactPhone: e.target.value }), className: "w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-[#38BDF8]" }), " Support & Admin Email *"] }), _jsx("input", { type: "email", required: true, value: contactForm.contactEmail, onChange: (e) => setContactForm({ ...contactForm, contactEmail: e.target.value }), className: "w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-3.5 h-3.5 text-[#C28236]" }), " Manufacturing Facility & Dispatch Address"] }), _jsx("textarea", { rows: 2, value: contactForm.contactAddress, onChange: (e) => setContactForm({ ...contactForm, contactAddress: e.target.value }), className: "w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-[#F59E0B]" }), " Business & Dispatch Hours"] }), _jsx("input", { type: "text", value: contactForm.contactHours, onChange: (e) => setContactForm({ ...contactForm, contactHours: e.target.value }), className: "w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "GSTIN / Tax ID Number" }), _jsx("input", { type: "text", value: contactForm.gstinNumber, onChange: (e) => setContactForm({ ...contactForm, gstinNumber: e.target.value }), className: "w-full px-3.5 py-2.5 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white" })] })] }), _jsx("div", { className: "pt-2", children: _jsxs("button", { type: "submit", className: "px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save & Publish Contact Details" })] }) })] })] })] })), activeTab === 'admins' && (_jsxs("div", { className: "space-y-8", children: [adminActionStatus && (_jsxs("div", { className: "p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: adminActionStatus })] })), adminActionError && (_jsxs("div", { className: "p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: adminActionError })] })), _jsxs("div", { className: "bg-[#24211D] p-5 sm:p-6 rounded-2xl border border-[#3E3832]", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-[#E8C58C] flex items-center gap-2 mb-4", children: [_jsx(UserPlus, { className: "w-4 h-4 text-[#10B981]" }), " Grant Admin Access To User"] }), _jsxs("form", { onSubmit: handleCreateAdmin, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Full Name" }), _jsx("input", { type: "text", placeholder: "e.g. Rahul Sharma", value: newAdminName, onChange: (e) => setNewAdminName(e.target.value), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Admin Email Address *" }), _jsx("input", { type: "email", required: true, placeholder: "e.g. partner@branplate.com", value: newAdminEmail, onChange: (e) => setNewAdminEmail(e.target.value), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-[#E8C58C] focus:outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-2", children: "Assign Admin Role" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                                                                { id: 'super_admin', label: 'Super Administrator', desc: 'Full root access to all modules & admin management' },
                                                                { id: 'operations_admin', label: 'Operations Admin', desc: 'Can manage products, set prices, orders & B2B samples' },
                                                                { id: 'inventory_manager', label: 'Inventory & Support', desc: 'Can view orders, adjust prices & dispatch samples' }
                                                            ].map((role) => (_jsxs("button", { type: "button", onClick: () => handleRolePreset(role.id), className: `p-3 rounded-xl text-left border transition-all ${newAdminRole === role.id
                                                                    ? 'bg-[#2D2A26] border-[#E8C58C] text-white'
                                                                    : 'bg-[#171513] border-[#332E28] text-neutral-400 hover:text-white'}`, children: [_jsxs("div", { className: "font-bold text-xs flex items-center justify-between", children: [_jsx("span", { children: role.label }), newAdminRole === role.id && _jsx(Check, { className: "w-3.5 h-3.5 text-[#E8C58C]" })] }), _jsx("p", { className: "text-[10px] text-neutral-400 mt-1", children: role.desc })] }, role.id))) })] }), _jsxs("button", { type: "submit", className: "px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2 shadow-md", children: [_jsx(UserCheck, { className: "w-4 h-4" }), _jsx("span", { children: "Grant Administrator Access" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-neutral-300", children: ["Active System Administrators (", admins.length, ")"] }), _jsx("input", { type: "text", placeholder: "Search admins by name or email...", value: searchAdminQuery, onChange: (e) => setSearchAdminQuery(e.target.value), className: "px-3 py-1.5 bg-[#24211D] border border-[#3E3832] rounded-xl text-xs text-white w-full sm:w-64" })] }), _jsx("div", { className: "divide-y divide-[#332E28] bg-[#24211D] rounded-2xl border border-[#3E3832] overflow-hidden", children: filteredAdmins.map((adm) => (_jsxs("div", { className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#2A2723] transition-colors", children: [_jsxs("div", { className: "flex items-start gap-3.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-[#2D2A26] border border-[#443E38] flex items-center justify-center text-[#E8C58C] shrink-0", children: _jsx(Shield, { className: "w-4 h-4 text-[#10B981]" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-sm text-[#F3EEEA]", children: adm.name }), _jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#E8C58C] border border-[#443E38]", children: adm.role.replace('_', ' ').toUpperCase() }), adm.email.toLowerCase() === config.firstAdminEmail.toLowerCase() && (_jsx("span", { className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50", children: "Primary Master Owner" }))] }), _jsx("div", { className: "text-xs font-mono text-neutral-400 mt-0.5", children: adm.email }), _jsxs("div", { className: "text-[10px] text-neutral-500 mt-1", children: ["Added: ", new Date(adm.createdAt).toLocaleDateString(), " by ", adm.addedBy] })] })] }), adm.email.toLowerCase() !== config.firstAdminEmail.toLowerCase() && (_jsx("button", { onClick: () => handleRevokeAdmin(adm), className: "px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900 hover:text-white text-xs font-mono transition-colors self-start sm:self-auto", children: "Revoke Access" }))] }, adm.id))) })] })] })), activeTab === 'orders' && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-neutral-300", children: ["Customer Plate Orders (", orders.length, ")"] }) }), orders.length === 0 ? (_jsx("div", { className: "text-center py-12 text-neutral-500 font-mono text-xs", children: "No orders placed yet." })) : (_jsx("div", { className: "space-y-3", children: orders.map((ord) => (_jsxs("div", { className: "bg-[#24211D] p-5 rounded-2xl border border-[#3E3832] space-y-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#332E28] pb-3", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsxs("span", { className: "font-mono font-bold text-[#E8C58C] text-sm", children: ["#", ord.orderNumber] }), _jsxs("span", { className: "text-xs text-neutral-400", children: [ord.customerName, " (", ord.email, ")"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("select", { value: ord.status, onChange: (e) => handleUpdateOrderStatus(ord.id, e.target.value), className: "bg-[#171513] border border-[#443E38] text-xs font-mono px-2.5 py-1 rounded-lg text-[#10B981]", children: [_jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "confirmed", children: "Confirmed" }), _jsx("option", { value: "processing", children: "Processing" }), _jsx("option", { value: "shipped", children: "Shipped" }), _jsx("option", { value: "delivered", children: "Delivered" })] }), _jsxs("span", { className: "font-mono font-bold text-sm text-white", children: ["$", ord.total.toFixed(2)] })] })] }), _jsxs("div", { className: "text-xs text-neutral-400 space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Items:" }), " ", ord.items.map(i => `${i.quantity}x ${i.productName} (${i.packLabel})`).join(', ')] }), _jsxs("div", { children: [_jsx("strong", { children: "Destination:" }), " ", ord.address.street, ", ", ord.address.city, ", ", ord.address.state, " (", ord.address.zip, ")"] }), _jsxs("div", { className: "font-mono text-[11px] text-[#C28236]", children: ["Tracking: ", ord.trackingNumber] })] })] }, ord.id))) }))] })), activeTab === 'users' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-neutral-300", children: ["Registered Customer Accounts (", users.length, ")"] }), _jsx("span", { className: "text-xs text-neutral-500 font-mono", children: "Auto-created upon purchases & sign-ins" })] }), users.length === 0 ? (_jsx("div", { className: "text-center py-12 text-neutral-500 font-mono text-xs", children: "No customers registered yet. Customer logins are auto-created when orders are placed." })) : (_jsx("div", { className: "divide-y divide-[#332E28] bg-[#24211D] rounded-2xl border border-[#3E3832] overflow-hidden", children: users.map((usr) => (_jsxs("div", { className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#2A2723] transition-colors", children: [_jsxs("div", { className: "flex items-start gap-3.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-[#2D2A26] border border-[#443E38] flex items-center justify-center text-[#E8C58C] shrink-0", children: _jsx(UserCheck, { className: "w-4 h-4 text-[#A78BFA]" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-sm text-[#F3EEEA]", children: usr.name }), _jsxs("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D3832] text-[#A78BFA]", children: [usr.totalOrdersCount || 0, " Orders"] })] }), _jsxs("div", { className: "text-xs font-mono text-neutral-400 mt-0.5", children: [usr.email, " ", usr.phone && `· ${usr.phone}`] }), usr.shippingAddress && (_jsxs("div", { className: "text-[11px] text-neutral-500 mt-1", children: [usr.shippingAddress.street, ", ", usr.shippingAddress.city, ", ", usr.shippingAddress.state] }))] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs font-mono text-neutral-400", children: "Total Spent" }), _jsxs("div", { className: "font-mono font-bold text-sm text-[#E8C58C]", children: ["$", (usr.totalSpent || 0).toFixed(2)] }), _jsxs("div", { className: "text-[10px] text-neutral-500 font-mono mt-0.5", children: ["Active: ", new Date(usr.lastLogin || usr.createdAt).toLocaleDateString()] })] })] }, usr.id))) }))] })), activeTab === 'samples' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-sm font-mono uppercase font-bold text-neutral-300", children: ["B2B Tasting Sample Requests (", inquiries.length, ")"] }), inquiries.length === 0 ? (_jsx("div", { className: "text-center py-12 text-neutral-500 font-mono text-xs", children: "No sample requests logged yet." })) : (_jsx("div", { className: "space-y-3", children: inquiries.map((inq) => (_jsxs("div", { className: "bg-[#24211D] p-5 rounded-2xl border border-[#3E3832] space-y-3", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#332E28] pb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm text-white", children: inq.companyName || inq.contactName }), _jsxs("div", { className: "text-xs text-neutral-400 font-mono", children: [inq.email, " \u00B7 ", inq.phone] })] }), _jsxs("select", { value: inq.status, onChange: (e) => handleUpdateInquiryStatus(inq.id, e.target.value), className: "bg-[#171513] border border-[#443E38] text-xs font-mono px-2.5 py-1 rounded-lg text-[#E8C58C]", children: [_jsx("option", { value: "new", children: "New" }), _jsx("option", { value: "reviewing", children: "Reviewing" }), _jsx("option", { value: "sample_sent", children: "Sample Sent" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "closed", children: "Closed" })] })] }), _jsxs("div", { className: "text-xs text-neutral-400 space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Business Type:" }), " ", inq.businessType, " (Monthly Volume: ", inq.estimatedMonthlyVolume, ")"] }), _jsxs("div", { children: [_jsx("strong", { children: "Requested Plates:" }), " ", (inq.interestedPlates || inq.interestedProducts || []).join(', ')] }), _jsxs("div", { children: [_jsx("strong", { children: "Address:" }), " ", inq.deliveryAddress.street, ", ", inq.deliveryAddress.city, ", ", inq.deliveryAddress.state] })] })] }, inq.id))) }))] })), activeTab === 'env' && (_jsxs("div", { className: "space-y-6", children: [savedSuccess && (_jsxs("div", { className: "p-3.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-xs text-[#10B981] flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: "Deployment Configuration Saved!" })] })), _jsxs("form", { onSubmit: handleSaveEnvConfig, className: "bg-[#24211D] p-6 rounded-2xl border border-[#3E3832] space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-base font-serif font-bold text-[#F3EEEA]", children: "Vercel Frontend & Render Backend Settings" }), _jsx("p", { className: "text-xs text-neutral-400 mt-1", children: "Manage your production custom domain and MongoDB connection." })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Custom Domain" }), _jsx("input", { type: "text", value: envForm.customDomain, onChange: (e) => setEnvForm({ ...envForm, customDomain: e.target.value }), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "Vercel Deployment URL" }), _jsx("input", { type: "text", value: envForm.clientUrl, onChange: (e) => setEnvForm({ ...envForm, clientUrl: e.target.value }), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-white" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-mono text-neutral-400 mb-1", children: "MongoDB Atlas Connection String" }), _jsx("input", { type: "text", value: envForm.mongoUri, onChange: (e) => setEnvForm({ ...envForm, mongoUri: e.target.value }), className: "w-full px-3 py-2 bg-[#171513] border border-[#443E38] rounded-xl text-xs font-mono text-neutral-300" })] }), _jsxs("button", { type: "submit", className: "px-5 py-2.5 rounded-xl bg-[#E8C58C] text-[#1C1A17] font-bold text-xs hover:bg-[#F2D7AC] transition-all flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Update Deployment Settings" })] })] })] }))] })] }) }));
};
