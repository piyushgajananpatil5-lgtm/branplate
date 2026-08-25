import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CircularStory } from './components/CircularStory';
import { AiTablewareAdvisor } from './components/AiTablewareAdvisor';
import { SampleRequestModal } from './components/SampleRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { Product, CartItem, Order, AppConfig, ImpactStats } from './types';
import { INITIAL_PRODUCTS, SUSTAINABILITY_METRICS } from './data/products';
import { apiFetch, saveSession, clearSession } from './lib/api';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], packSizeIndex: 1, quantity: 1 } // Pre-loaded 1 pack of 50 10" Dinner plates
  ]);

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutPromo, setCheckoutPromo] = useState<string>('');

  // User State & Config
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [config, setConfig] = useState<AppConfig>({
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

  const [impactStats, setImpactStats] = useState<ImpactStats>(SUSTAINABILITY_METRICS);

  const fetchProducts = () => {
    apiFetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
      })
      .catch(() => {});
  };

  const restoreSession = async () => {
    try {
      const token = localStorage.getItem('branplate_token');
      if (!token) return;
      const res = await apiFetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthUser(data.user);
        setUserEmail(data.user.email);
        setIsUserAdmin(data.user.type === 'admin');
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  };

  // Sync with backend on load
  useEffect(() => {
    apiFetch('/api/config')
      .then(res => res.json())
      .then(data => { if (data.success && data.config) setConfig(prev => ({ ...prev, ...data.config })); })
      .catch(() => {});
    apiFetch('/api/impact')
      .then(res => res.json())
      .then(data => { if (data.success && data.impact) setImpactStats(data.impact); })
      .catch(() => {});
    fetchProducts();
    restoreSession();
  }, []);

  const handleAddToCart = (product: Product, packSizeIndex: number) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.packSizeIndex === packSizeIndex
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, packSizeIndex, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (bundleItems: { product: Product; packIndex: number; quantity: number }[]) => {
    setCartItems(prev => {
      const updated = [...prev];
      bundleItems.forEach(({ product, packIndex, quantity }) => {
        const existing = updated.find(
          item => item.product.id === product.id && item.packSizeIndex === packIndex
        );
        if (existing) {
          existing.quantity += quantity;
        } else {
          updated.push({ product, packSizeIndex: packIndex, quantity });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCartItems(prev => {
        const updated = [...prev];
        updated[index].quantity = newQuantity;
        return updated;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = (appliedDiscount: number, promo: string) => {
    setCheckoutDiscount(appliedDiscount);
    setCheckoutPromo(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (_order: Order) => {
    setCartItems([]);
    apiFetch('/api/impact')
      .then(res => res.json())
      .then(data => { if (data.success && data.impact) setImpactStats(data.impact); })
      .catch(() => {});
  };

  const scrollToSection = (sectionId: string) => {
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2A26] flex flex-col font-sans selection:bg-[#E8C58C] selection:text-[#1C1A17]">
      
      {/* Navigation Bar */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        config={config}
        userEmail={userEmail}
        onOpenAuth={() => setIsAuthOpen(true)}
        isUserAdmin={isUserAdmin}
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        
        <Hero
          onExplore={() => scrollToSection('shop')}
          onShopClick={() => scrollToSection('shop')}
          onAdvisorClick={() => scrollToSection('ai-advisor')}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onSampleClick={() => setIsSampleModalOpen(true)}
          impact={impactStats}
        />

        <ProductCatalog
          products={products}
          onAddToCart={handleAddToCart}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        <CircularStory
          impact={impactStats}
          onExploreProducts={() => scrollToSection('shop')}
        />

        <AiTablewareAdvisor
          onAddBundleToCart={handleAddBundleToCart}
          products={products}
        />

        <AboutSection
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
        />

        <ContactSection
          config={config}
        />

      </main>

      {/* Footer */}
      <Footer
        config={config}
        onNavigate={scrollToSection}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={checkoutDiscount}
        promoCode={checkoutPromo}
        onOrderSuccess={handleOrderSuccess}
        currentUserEmail={userEmail}
        onAutoLogin={(token, user) => { saveSession(token, user); setAuthUser(user); setUserEmail(user.email); setIsUserAdmin(user.type === 'admin'); }}
      />

      <SampleRequestModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />

      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={(newConf) => setConfig(prev => ({ ...prev, ...newConf }))}
        impact={impactStats}
        currentUserEmail={userEmail}
        onAdminsUpdated={() => {}}
        onProductsUpdated={fetchProducts}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUserEmail={userEmail}
        onLogin={(user) => { setAuthUser(user); setUserEmail(user.email); setIsUserAdmin(user.type === 'admin'); }}
        onLogout={() => { clearSession(); setAuthUser(null); setUserEmail(null); setIsUserAdmin(false); }}
        config={config}
      />

    </div>
  );
}
