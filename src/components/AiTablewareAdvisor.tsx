import React, { useState } from 'react';
import { Sparkles, Calculator, Sprout, ShoppingBag, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface AiTablewareAdvisorProps {
  products: Product[];
  onAddBundleToCart: (items: { product: Product; packIndex: number; quantity: number }[]) => void;
  onOpenSampleModal: () => void;
}

export const AiTablewareAdvisor: React.FC<AiTablewareAdvisorProps> = ({
  products,
  onAddBundleToCart,
  onOpenSampleModal
}) => {
  const [eventType, setEventType] = useState('Wedding / Grand Banquet');
  const [guestsCount, setGuestsCount] = useState<number>(150);
  const [mealsServed, setMealsServed] = useState<number>(2);
  const [plateStyle, setPlateStyle] = useState<string>('mixed');
  const [budgetTier, setBudgetTier] = useState('Premium Organic');

  const [loading, setLoading] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<any>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const calculatePlates = async () => {
    setLoading(true);
    setAddedSuccess(false);

    try {
      const res = await fetch('/api/ai/calculate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          guestsCount,
          mealsServed,
          plateStyle,
          budgetTier
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalculation(data.calculation);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundle = () => {
    if (!calculation || !products.length) return;
    
    const plateProduct = products[0];
    const totalPlatesNeeded = (calculation.recommendations.dinnerPlates10Inch || 150) + (calculation.recommendations.snackPlates8Inch || 50);
    
    // Choose pack sizes
    const pack100Count = Math.max(1, Math.floor(totalPlatesNeeded / 100));
    const remainder = totalPlatesNeeded % 100;
    const pack50Count = remainder > 0 ? 1 : 0;

    const bundle = [
      { product: plateProduct, packIndex: 2, quantity: pack100Count } // Pack of 100
    ];

    if (pack50Count > 0) {
      bundle.push({ product: plateProduct, packIndex: 1, quantity: pack50Count }); // Pack of 50
    }

    onAddBundleToCart(bundle);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <section id="calculator-section" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5D5] text-[#C28236] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI Biodegradable Plate Planner
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]">
            Smart Biodegradable Plates Event Calculator
          </h2>
          <p className="text-[#6B5E4F] text-sm sm:text-base mt-3">
            Configure your upcoming wedding, corporate gala, cafe catering, or feast. Our AI engine computes exact plate quantities by size, course requirements, and certified zero-plastic carbon metrics.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="bg-white rounded-3xl border border-[#E6DEC8] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Form: Inputs */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF8F5] border-b lg:border-b-0 lg:border-r border-[#E6DEC8] space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#2D2A26] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C28236]" /> Event Plate Parameters
            </h3>

            {/* Event Type */}
            <div>
              <label className="block text-xs font-semibold text-[#5A4F3D] mb-1.5 uppercase tracking-wide">
                Event or Business Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-sm text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none font-medium"
              >
                <option value="Wedding / Grand Banquet">Wedding / Grand Banquet Feast</option>
                <option value="Corporate Gala / Conference">Corporate Gala / Conference Catering</option>
                <option value="Casual Birthday / House Party">Casual Birthday / House Gathering</option>
                <option value="Food Truck / Cafe Service">Food Truck / Cafe Service</option>
                <option value="Festival / Community Gathering">Festival / Community Gathering</option>
              </select>
            </div>

            {/* Guest Count Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#5A4F3D] mb-1.5">
                <span className="uppercase tracking-wide">Expected Guest Count</span>
                <span className="font-mono text-sm text-[#C28236] font-bold">{guestsCount} Guests</span>
              </div>
              <input
                type="range"
                min="25"
                max="1000"
                step="25"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full h-2 bg-[#E6DEC8] rounded-lg appearance-none cursor-pointer accent-[#2D2A26]"
              />
              <div className="flex justify-between text-[10px] text-[#8C7A6B] mt-1 font-mono">
                <span>25</span>
                <span>250</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>

            {/* Meals & Courses */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A4F3D] mb-1.5 uppercase tracking-wide">
                  Courses / Meals
                </label>
                <select
                  value={mealsServed}
                  onChange={(e) => setMealsServed(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-sm text-[#2D2A26] font-medium"
                >
                  <option value="1">1 Course (Main Meal)</option>
                  <option value="2">2 Courses (Starter + Main)</option>
                  <option value="3">3 Courses (Feast + Dessert)</option>
                  <option value="4">Multi-Course Buffet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4F3D] mb-1.5 uppercase tracking-wide">
                  Preferred Plate Style
                </label>
                <select
                  value={plateStyle}
                  onChange={(e) => setPlateStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-sm text-[#2D2A26] font-medium"
                >
                  <option value="mixed">10" Dinner + 8" Snack</option>
                  <option value="compartment">4-Compartment Thali Plates</option>
                  <option value="grand">12" Grand Buffet Plates</option>
                </select>
              </div>
            </div>

            {/* Budget / Grade */}
            <div>
              <label className="block text-xs font-semibold text-[#5A4F3D] mb-1.5 uppercase tracking-wide">
                Quality / Grade
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-sm text-[#2D2A26] font-medium"
              >
                <option value="Premium Organic">Premium Heavy-Duty (100% Wheat Bran)</option>
                <option value="Standard Banquet">Standard Banquet Packaging</option>
                <option value="Wholesale Bulk">Factory Master Pallet</option>
              </select>
            </div>

            {/* Submit Action */}
            <button
              id="run-ai-calculation-btn"
              onClick={calculatePlates}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E8C58C]" />
                  <span>Computing Plate Requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E8C58C]" />
                  <span>Calculate Biodegradable Plates Needed</span>
                </>
              )}
            </button>
          </div>

          {/* Right Area: Results Output */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            {!calculation ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-[#EDE5D5] flex items-center justify-center text-[#C28236]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h4 className="font-serif text-xl font-bold text-[#2D2A26]">
                    Ready to Calculate Plates for {guestsCount} Guests
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6E5E] mt-1">
                    Click the button on the left to receive an exact biodegradable plate inventory breakdown and certified plastic reduction report.
                  </p>
                  <button
                    onClick={calculatePlates}
                    className="mt-5 px-6 py-2.5 rounded-full bg-[#EDE5D5] text-[#2D2A26] text-xs font-semibold hover:bg-[#E3D7C1] transition-all"
                  >
                    Quick Plate Estimate Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Result Header */}
                <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#C28236] uppercase font-bold">
                      Calculated for {guestsCount} Guests · {eventType}
                    </span>
                    <h4 className="text-2xl font-serif font-bold text-[#2D2A26]">
                      Recommended Plates Inventory
                    </h4>
                  </div>
                  <span className="bg-[#EBF7EE] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Biodegradable
                  </span>
                </div>

                {/* Plates Items Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DEC8] text-center">
                    <div className="text-xl font-bold text-[#2D2A26] font-mono">
                      {calculation.recommendations.dinnerPlates10Inch}
                    </div>
                    <div className="text-[11px] text-[#7A6E5E] mt-0.5">10" Dinner Plates</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DEC8] text-center">
                    <div className="text-xl font-bold text-[#2D2A26] font-mono">
                      {calculation.recommendations.snackPlates8Inch}
                    </div>
                    <div className="text-[11px] text-[#7A6E5E] mt-0.5">8" Snack Plates</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DEC8] text-center">
                    <div className="text-xl font-bold text-[#2D2A26] font-mono">
                      {calculation.recommendations.buffetPlates12Inch || Math.ceil(guestsCount * 0.25)}
                    </div>
                    <div className="text-[11px] text-[#7A6E5E] mt-0.5">12" Grand Plates</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DEC8] text-center">
                    <div className="text-xl font-bold text-[#2D2A26] font-mono">
                      {calculation.recommendations.compartmentPlates4Section || 0}
                    </div>
                    <div className="text-[11px] text-[#7A6E5E] mt-0.5">Thali / Partition Plates</div>
                  </div>
                </div>

                {/* Environmental Impact Box */}
                <div className="p-4 rounded-2xl bg-[#2D2A26] text-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#E8C58C] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-[#10B981]" /> Event Sustainability Metric
                    </span>
                    <span className="font-mono text-[10px]">Central India Carbon Audit</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-700">
                    <div>
                      <div className="text-base font-bold text-[#10B981] font-mono">
                        {calculation.impactAnalysis.plasticPlatesAvoidedCount || calculation.impactAnalysis.plasticDivertedKg * 20}
                      </div>
                      <div className="text-[10px] text-neutral-300">Plastic Plates Avoided</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#E8C58C] font-mono">
                        {calculation.impactAnalysis.co2PreventedKg} kg
                      </div>
                      <div className="text-[10px] text-neutral-300">CO₂ Emissions Saved</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-white font-mono">
                        30 Days
                      </div>
                      <div className="text-[10px] text-neutral-300">Soil Composting</div>
                    </div>
                  </div>
                </div>

                {/* Catering Advice */}
                <div className="text-xs text-[#5A4F3D] bg-[#EDE5D5] p-3.5 rounded-xl border border-[#D5C6AC] leading-relaxed">
                  <span className="font-bold text-[#2D2A26] block mb-1">Plate Durability & Catering Note:</span>
                  {calculation.cateringPlateAdvice || calculation.cateringAdvice}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    id="add-recommended-bundle-btn"
                    onClick={handleAddBundle}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      addedSuccess
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#2D2A26] text-[#F9F6F0] hover:bg-black'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Recommended Plates Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#E8C58C]" />
                        <span>Add Event Plates Bundle to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    id="advisor-sample-btn"
                    onClick={onOpenSampleModal}
                    className="py-3.5 px-5 rounded-xl border border-[#D5C6AC] bg-white text-[#2D2A26] font-semibold text-xs hover:bg-[#FAF8F5] transition-all"
                  >
                    Request Sample Plate Kit
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
