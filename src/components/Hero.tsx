import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Flame, Sprout } from 'lucide-react';
import { ImpactStats } from '../types';

interface HeroProps {
  onShopClick?: () => void;
  onAdvisorClick?: () => void;
  onSampleClick?: () => void;
  onExplore?: () => void;
  onOpenSampleModal?: () => void;
  impact?: ImpactStats;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onAdvisorClick,
  onSampleClick,
  onExplore,
  onOpenSampleModal,
  impact
}) => {
  const safeImpact: ImpactStats = impact || {
    plasticPlatesReplaced: 1845200,
    wheatBranUpcycledKg: 92260,
    co2SavedKg: 221424,
    partnerFarms: 420,
    soilDegradationDays: 30
  };

  const handleShop = onShopClick || onExplore || (() => {});
  const handleAdvisor = onAdvisorClick || (() => {});
  const handleSample = onSampleClick || onOpenSampleModal || (() => {});
  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#FAF8F5] pt-12 pb-20 border-b border-[#E6DEC8]">
      {/* Subtle organic background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EADCC8] blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#F3E7D3] blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content exactly matching user screenshot */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small pill badge matching screenshot */}
            <div id="hero-eyebrow-badge" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5D5] border border-[#D5C6AC] text-[#5A4F3D] text-xs sm:text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span className="font-semibold uppercase tracking-wider text-[11px] sm:text-xs">
                CENTRAL INDIA · CIRCULAR ECONOMY · ZERO LANDFILL
              </span>
            </div>

            {/* Main Headline matching screenshot */}
            <h1 id="hero-main-title" className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A26] leading-[1.12] tracking-tight">
              From Field to Feast.<br />
              <span className="text-[#C28236]">Back to Earth.</span>
            </h1>

            {/* Biodegradable Tagline matching screenshot */}
            <p id="hero-tagline-text" className="text-xl sm:text-2xl font-serif italic text-[#6B5E4F] font-medium">
              Biodegradable.
            </p>

            <p className="text-base sm:text-lg text-[#5A5043] leading-relaxed max-w-2xl">
              100% natural, leak-resistant biodegradable plates forged from upcycled wheat bran agricultural surplus in Central India. Oven, microwave, and hot-liquid safe — completely decomposing in soil in 30 days without toxic microplastics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={handleShop}
                className="px-8 py-4 rounded-full bg-[#2D2A26] text-[#F9F6F0] font-semibold text-base hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 group"
              >
                <span>Shop Plates</span>
                <ArrowRight className="w-4 h-4 text-[#E8C58C] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-ai-advisor-btn"
                onClick={handleAdvisor}
                className="px-6 py-4 rounded-full bg-[#EDE5D5] text-[#2D2A26] font-semibold text-base hover:bg-[#E3D7C1] border border-[#D5C6AC] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C28236]" />
                <span>AI Plates Event Planner</span>
              </button>
            </div>

            {/* Key Quality Assurances */}
            <div className="pt-6 border-t border-[#E6DEC8] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#4A4031]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="font-medium">Composts in 30 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C28236] shrink-0" />
                <span className="font-medium">Oven & Microwave 180°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="font-medium">0% Chemical Binders</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Live Impact Summary */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAF8F5] bg-[#FFFFFF] aspect-[4/3] sm:aspect-square flex items-center justify-center p-6 sm:p-10">
              <img
                src="/plate.svg"
                alt="BranPlate 100% Biodegradable Plate"
                className="w-full h-full object-contain drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Badge on image */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#2D2A26]/90 backdrop-blur-md text-white p-4 rounded-xl border border-neutral-700/60 shadow-lg">
                <div className="flex items-center justify-between text-xs text-[#E8C58C] font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-[#10B981]" />
                    Central India Agro Impact
                  </span>
                  <span className="font-mono text-[11px] text-neutral-300">Live Counters</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-neutral-700">
                  <div>
                    <div className="text-sm font-bold text-white font-mono">{((safeImpact.plasticPlatesReplaced || 1845200) / 1000000).toFixed(2)}M+</div>
                    <div className="text-[10px] text-neutral-300">Plates Saved</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#E8C58C] font-mono">{((safeImpact.wheatBranUpcycledKg || 92260) / 1000).toFixed(1)}k kg</div>
                    <div className="text-[10px] text-neutral-300">Bran Upcycled</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#10B981] font-mono">30 Days</div>
                    <div className="text-[10px] text-neutral-300">Soil Breakdown</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating pill badge */}
            <div className="absolute -top-4 -left-4 bg-[#FFFFFF] px-4 py-2.5 rounded-xl shadow-lg border border-[#E6DEC8] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#10B981] font-bold text-sm">
                🌾
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#2D2A26]">100% Wheat Bran</div>
                <div className="text-[10px] text-[#7A6E5E]">0% Plastic or Wax Coated</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
