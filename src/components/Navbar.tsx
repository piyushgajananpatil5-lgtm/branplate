import React, { useState } from 'react';
import { ShoppingBag, User, Globe, Sparkles, Menu, X, ShieldCheck, Leaf } from 'lucide-react';
import { CartItem, AppConfig } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenSampleModal: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  config: AppConfig;
  userEmail: string | null;
  onOpenAuth: () => void;
  isUserAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenAdmin,
  onOpenSampleModal,
  activeSection,
  onNavigate,
  config,
  userEmail,
  onOpenAuth,
  isUserAdmin = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domainTooltip, setDomainTooltip] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = isUserAdmin || (userEmail && userEmail.toLowerCase() === config.firstAdminEmail.toLowerCase());

  const navLinks = [
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'story', label: 'Circular Story' },
    { id: 'calculator', label: 'AI Tableware Advisor' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DEC8] transition-all">
      {/* Top Notification Announcement Bar */}
      <div id="top-announcement-bar" className="bg-[#2D2A26] text-[#F3EEEA] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Central India Agro-Waste Circular Tableware</span>
            <span className="hidden md:inline text-neutral-400">|</span>
            <span className="hidden md:inline text-[#E8C58C]">100% Pure Wheat Bran · 30-Day Biodegradable</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Custom Domain Pill */}
            <div 
              className="relative cursor-pointer flex items-center gap-1.5 bg-[#3D3A35] px-2.5 py-0.5 rounded-full text-[#E8C58C] hover:bg-[#4E4A44] transition-colors"
              onMouseEnter={() => setDomainTooltip(true)}
              onMouseLeave={() => setDomainTooltip(false)}
              onClick={() => setDomainTooltip(!domainTooltip)}
            >
              <Globe className="w-3 h-3 text-[#10B981]" />
              <span className="font-mono font-semibold">{config.customDomain || 'thelegend5.com'}</span>
              <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-1 rounded">LIVE</span>

              {domainTooltip && (
                <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-[#1C1A17] text-white rounded-lg shadow-xl border border-[#443E38] z-50 text-left">
                  <div className="font-semibold text-xs text-[#E8C58C] mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Custom Domain Connected
                  </div>
                  <p className="text-[11px] text-neutral-300 mb-1">
                    Primary: <span className="text-white font-mono">{config.customDomain}</span>
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Vercel Edge: <span className="text-neutral-300 font-mono text-[10px]">{config.clientUrl}</span>
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-2 border-t border-neutral-700 pt-1.5">
                    Admin: <span className="text-[#E8C58C]">{config.firstAdminEmail}</span>
                  </p>
                </div>
              )}
            </div>

            <button 
              id="request-sample-top-btn"
              onClick={onOpenSampleModal} 
              className="text-[#E8C58C] hover:underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Free B2B Sample Kit
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button 
              id="brand-logo-btn"
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2D2A26] flex items-center justify-center text-[#E8C58C] shadow-md group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#2D2A26]">BranPlate</span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B]">Central India</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === link.id
                      ? 'text-[#2D2A26] bg-[#EBE3D3] font-semibold'
                      : 'text-[#5C5346] hover:text-[#2D2A26] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Sample Kit Button */}
            <button
              id="nav-sample-kit-btn"
              onClick={onOpenSampleModal}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-[#C7B79E] text-[#4A4031] hover:bg-[#EDE5D5] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C28236]" />
              <span>Sample Box</span>
            </button>

            {/* Admin or User Account */}
            <button
              id="user-account-btn"
              onClick={onOpenAuth}
              className={`p-2.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium ${
                userEmail 
                  ? 'bg-[#E3D9C3] text-[#2D2A26]' 
                  : 'hover:bg-[#EBE3D3] text-[#5C5346]'
              }`}
              title={userEmail ? `Logged in as ${userEmail}` : 'Login / Admin'}
            >
              <User className="w-5 h-5 text-[#2D2A26]" />
              {userEmail && (
                <span className="hidden sm:inline font-mono text-[11px] max-w-[120px] truncate">
                  {userEmail === config.firstAdminEmail ? 'Admin' : userEmail.split('@')[0]}
                </span>
              )}
            </button>

            {/* Admin Console Shortcut */}
            {isAdmin && (
              <button
                id="nav-admin-console-btn"
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 text-xs bg-[#2D2A26] text-[#E8C58C] px-3 py-1.5 rounded-full font-semibold hover:bg-black transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#2D2A26] text-white hover:bg-black transition-all flex items-center justify-center shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#E8C58C]" />
              {totalCartCount > 0 && (
                <span id="cart-badge-count" className="absolute -top-1 -right-1 bg-[#C28236] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-[#2D2A26] hover:bg-[#EBE3D3] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-t border-[#E6DEC8] bg-[#FAF8F5] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-[#2D2A26] text-[#E8C58C]'
                  : 'text-[#4A4031] hover:bg-[#EDE5D5]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E6DEC8] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSampleModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-lg bg-[#C28236] text-white font-semibold text-sm"
            >
              Request Free Sample Kit
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-lg bg-[#2D2A26] text-[#E8C58C] font-semibold text-sm"
            >
              Admin & Server Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
