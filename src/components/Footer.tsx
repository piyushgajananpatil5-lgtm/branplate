import React from 'react';
import { Leaf, Globe, ShieldCheck, Heart, ArrowUp, Sprout } from 'lucide-react';
import { AppConfig } from '../types';

interface FooterProps {
  config: AppConfig;
  onNavigate: (section: string) => void;
  onOpenSampleModal: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onNavigate,
  onOpenSampleModal,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#221F1B] text-[#EDE5D5] border-t border-[#3A352F] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#38332D]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8C58C] flex items-center justify-center text-[#221F1B] shadow-md">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">BranPlate</span>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              From Field to Feast. Back to Earth. Sustainable biodegradable wheat bran tableware made from upcycled agricultural byproduct in Central India.
            </p>

            {/* Custom Domain Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#3A352F] text-xs font-mono text-[#E8C58C]">
                <Globe className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{config.customDomain}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#3A352F] text-xs font-mono text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Zero Microplastics</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">Biodegradable Plates</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#E8C58C] transition-colors">
                  Pack of 25 Plates (Trial Kit)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#E8C58C] transition-colors">
                  Pack of 50 Plates (Popular Pack)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#E8C58C] transition-colors">
                  Pack of 100 Plates (Catering Bundle)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#E8C58C] transition-colors">
                  Master Pallet (1,000 Bulk Plates)
                </button>
              </li>
            </ul>
          </div>

          {/* Technology & Mission */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">Mission & Eco</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-[#E8C58C] transition-colors">
                  Circular Economy Process
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-[#E8C58C] transition-colors">
                  AI Waste Impact Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#E8C58C] transition-colors">
                  Central India Farmer Network
                </button>
              </li>
              <li>
                <button onClick={onOpenSampleModal} className="hover:text-[#E8C58C] transition-colors text-[#E8C58C]">
                  Request Free B2B Sample Kit
                </button>
              </li>
            </ul>
          </div>

          {/* Infrastructure & System */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">System</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={onOpenAdmin} className="hover:text-[#E8C58C] transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Admin & Environment Console</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-500 font-mono text-[11px]">Primary: {config.firstAdminEmail}</span>
              </li>
              <li>
                <span className="text-neutral-500 font-mono text-[11px]">Vercel: {config.clientUrl}</span>
              </li>
              <li>
                <span className="text-[#10B981] font-mono text-[11px]">Commit: 295393a</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} BranPlate Tableware. Central India · Circular Economy · Zero Landfill.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#2D2A26] hover:bg-[#3D3A35] text-[#E8C58C] transition-colors flex items-center gap-1.5"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
