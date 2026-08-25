import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { CircularStory } from './components/CircularStory.js';
import { AiTablewareAdvisor } from './components/AiTablewareAdvisor.js';
import { SampleRequestModal } from './components/SampleRequestModal.js';
import { CartDrawer } from './components/CartDrawer.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { AdminPortal } from './components/AdminPortal.js';
import { AuthModal } from './components/AuthModal.js';
import { AboutSection } from './components/AboutSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { INITIAL_PRODUCTS, SUSTAINABILITY_METRICS } from './data/products.js';
import { apiFetch, saveSession, clearSession } from './lib/api.js';
export default function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cartItems, setCartItems] = useState([
        { product: INITIAL_PRODUCTS[0], packSizeIndex: 1, quantity: 1 } // Pre-loaded 1 pack of 50 10" Dinner plates
    ]);
    const [activeSection, setActiveSection] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Modals & Drawers
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [checkoutDiscount, setCheckoutDiscount] = useState(0);
    const [checkoutPromo, setCheckoutPromo] = useState('');
    // User State & Config
    const [userEmail, setUserEmail] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [config, setConfig] = useState({
        clientUrl: 'https://branplate-q6sx.vercel.app',
        customDomain: 'thelegend5.com',
        firstAdminEmail: 'piyushgajananpatil5@gmail.com',
        mongoUri: '',
        brandName: 'BranPlate',
        region: 'Central India · Circular Economy · Zero Landfill',
        contactPhone: '+91 98234 56789',
        contactEmail: 'support@branplate.com',
        contactAddress: 'Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India',
        contactHours: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
        gstinNumber: '27AAECB8821P1Z5'
    });
    const [impactStats, setImpactStats] = useState(SUSTAINABILITY_METRICS);
    const fetchProducts = () => {
        apiFetch('/api/products')
            .then(res => res.json())
            .then(data => {
            if (data.success && Array.isArray(data.products) && data.products.length > 0)
                setProducts(data.products);
        })
            .catch(() => { });
    };
    const restoreSession = async () => {
        try {
            const token = localStorage.getItem('branplate_token');
            if (!token)
                return;
            const res = await apiFetch('/api/auth/me');
            const data = await res.json();
            if (res.ok && data.success) {
                setAuthUser(data.user);
                setUserEmail(data.user.email);
                setIsUserAdmin(data.user.type === 'admin');
            }
            else {
                clearSession();
            }
        }
        catch {
            clearSession();
        }
    };
    // Sync with backend on load
    useEffect(() => {
        apiFetch('/api/config')
            .then(res => res.json())
            .then(data => { if (data.success && data.config)
            setConfig(prev => ({ ...prev, ...data.config })); })
            .catch(() => { });
        apiFetch('/api/impact')
            .then(res => res.json())
            .then(data => { if (data.success && data.impact)
            setImpactStats(data.impact); })
            .catch(() => { });
        fetchProducts();
        restoreSession();
    }, []);
    const handleAddToCart = (product, packSizeIndex) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(item => item.product.id === product.id && item.packSizeIndex === packSizeIndex);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }
            return [...prev, { product, packSizeIndex, quantity: 1 }];
        });
        setIsCartOpen(true);
    };
    const handleAddBundleToCart = (bundleItems) => {
        setCartItems(prev => {
            const updated = [...prev];
            bundleItems.forEach(({ product, packIndex, quantity }) => {
                const existing = updated.find(item => item.product.id === product.id && item.packSizeIndex === packIndex);
                if (existing) {
                    existing.quantity += quantity;
                }
                else {
                    updated.push({ product, packSizeIndex: packIndex, quantity });
                }
            });
            return updated;
        });
        setIsCartOpen(true);
    };
    const handleUpdateQuantity = (index, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveCartItem(index);
        }
        else {
            setCartItems(prev => {
                const updated = [...prev];
                updated[index].quantity = newQuantity;
                return updated;
            });
        }
    };
    const handleRemoveCartItem = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    };
    const handleProceedToCheckout = (appliedDiscount, promo) => {
        setCheckoutDiscount(appliedDiscount);
        setCheckoutPromo(promo);
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };
    const handleOrderSuccess = (_order) => {
        setCartItems([]);
        apiFetch('/api/impact')
            .then(res => res.json())
            .then(data => { if (data.success && data.impact)
            setImpactStats(data.impact); })
            .catch(() => { });
    };
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const elem = document.getElementById(`${sectionId}-section`);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#FAF8F5] text-[#2D2A26] flex flex-col font-sans selection:bg-[#E8C58C] selection:text-[#1C1A17]", children: [_jsx(Navbar, { cartItems: cartItems, onOpenCart: () => setIsCartOpen(true), onOpenAdmin: () => setIsAdminOpen(true), onOpenSampleModal: () => setIsSampleModalOpen(true), activeSection: activeSection, onNavigate: scrollToSection, config: config, userEmail: userEmail, onOpenAuth: () => setIsAuthOpen(true), isUserAdmin: isUserAdmin }), _jsxs("main", { className: "flex-grow", children: [_jsx(Hero, { onExplore: () => scrollToSection('shop'), onShopClick: () => scrollToSection('shop'), onAdvisorClick: () => scrollToSection('ai-advisor'), onOpenSampleModal: () => setIsSampleModalOpen(true), onSampleClick: () => setIsSampleModalOpen(true), impact: impactStats }), _jsx(ProductCatalog, { products: products, onAddToCart: handleAddToCart, onSelectProduct: (product) => setSelectedProduct(product) }), _jsx(CircularStory, { impact: impactStats, onExploreProducts: () => scrollToSection('shop') }), _jsx(AiTablewareAdvisor, { onAddBundleToCart: handleAddBundleToCart, products: products }), _jsx(AboutSection, { onOpenSampleModal: () => setIsSampleModalOpen(true) }), _jsx(ContactSection, { config: config })] }), _jsx(Footer, { config: config, onNavigate: scrollToSection, onOpenSampleModal: () => setIsSampleModalOpen(true), onOpenAdmin: () => setIsAdminOpen(true) }), _jsx(ProductDetailModal, { product: selectedProduct, onClose: () => setSelectedProduct(null), onAddToCart: handleAddToCart }), _jsx(CartDrawer, { isOpen: isCartOpen, onClose: () => setIsCartOpen(false), cartItems: cartItems, onUpdateQuantity: handleUpdateQuantity, onRemoveItem: handleRemoveCartItem, onProceedToCheckout: handleProceedToCheckout }), _jsx(CheckoutModal, { isOpen: isCheckoutOpen, onClose: () => setIsCheckoutOpen(false), cartItems: cartItems, discountAmount: checkoutDiscount, promoCode: checkoutPromo, onOrderSuccess: handleOrderSuccess, currentUserEmail: userEmail, onAutoLogin: (token, user) => { saveSession(token, user); setAuthUser(user); setUserEmail(user.email); setIsUserAdmin(user.type === 'admin'); } }), _jsx(SampleRequestModal, { isOpen: isSampleModalOpen, onClose: () => setIsSampleModalOpen(false) }), _jsx(AdminPortal, { isOpen: isAdminOpen, onClose: () => setIsAdminOpen(false), config: config, onUpdateConfig: (newConf) => setConfig(prev => ({ ...prev, ...newConf })), impact: impactStats, currentUserEmail: userEmail, onAdminsUpdated: () => { }, onProductsUpdated: fetchProducts }), _jsx(AuthModal, { isOpen: isAuthOpen, onClose: () => setIsAuthOpen(false), currentUserEmail: userEmail, onLogin: (user) => { setAuthUser(user); setUserEmail(user.email); setIsUserAdmin(user.type === 'admin'); }, onLogout: () => { clearSession(); setAuthUser(null); setUserEmail(null); setIsUserAdmin(false); }, config: config })] }));
}
