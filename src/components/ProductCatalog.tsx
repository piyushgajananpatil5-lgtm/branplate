import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, Check, ShieldCheck, Flame, Layers, Sparkles, Sprout, CheckCircle2, PackageCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, packSizeIndex: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onSelectProduct
}) => {
  const [activeProductId, setActiveProductId] = useState<string>(products[0]?.id || 'bp-plate-100bio');
  const [selectedPackIndex, setSelectedPackIndex] = useState<{ [productId: string]: number }>({});
  const [addedAnimation, setAddedAnimation] = useState<{ [productId: string]: boolean }>({});

  const currentProduct = products.find(p => p.id === activeProductId) || products[0];

  const handlePackChange = (productId: string, packIndex: number) => {
    setSelectedPackIndex((prev) => ({ ...prev, [productId]: packIndex }));
  };

  const handleAddWithFeedback = (prod: Product, pIndex?: number) => {
    const packIndex = pIndex !== undefined ? pIndex : (selectedPackIndex[prod.id] || 0);
    onAddToCart(prod, packIndex);
    setAddedAnimation((prev) => ({ ...prev, [`${prod.id}-${packIndex}`]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [`${prod.id}-${packIndex}`]: false }));
    }, 1200);
  };

  if (!currentProduct) return null;

  const currentPackIndex = selectedPackIndex[currentProduct.id] || 0;
  const currentPack = currentProduct.packSizes[currentPackIndex] || currentProduct.packSizes[0] || { price: currentProduct.price, label: 'Standard Pack', size: 25, unitPrice: currentProduct.price / 25 };

  return (
    <section id="shop-section" className="py-20 bg-[#173F35] text-[#F9F1DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono font-bold tracking-widest text-[#173F35] mb-2 px-3 py-1 bg-[#E8A83E] rounded-full">
            <Layers className="w-3.5 h-3.5" /> 100% Certified Biodegradable Tableware
          </div>
          <h2 className="text-5xl sm:text-7xl font-serif font-bold text-[#F9F1DF] leading-[.9]">
            CHOOSE YOUR STACK
          </h2>
          <p className="text-[#D8E0D2] text-sm sm:text-base mt-3">
            Engineered from natural upcycled plant fibers in Central India. Grease-proof, oven-safe to 180°C, and completely compostable in soil in 30 days.
          </p>
        </div>

        {/* Product Variant Tabs if more than 1 product exists */}
        {products.length > 1 && (
          <div className="flex items-center justify-center gap-3 mb-8 overflow-x-auto pb-2">
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setActiveProductId(prod.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeProductId === prod.id
                    ? 'bg-[#2D2A26] text-[#E8C58C] border-[#2D2A26] shadow-md'
                    : 'bg-white text-[#5A4F3D] border-[#D5C6AC] hover:bg-[#EDE5D5]'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{prod.name}</span>
                <span className="font-mono text-[11px] opacity-80">${prod.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hero Product Spotlight Card */}
        <div className="bg-[#F9F1DF] rounded-[2rem] border-4 border-[#E8A83E] shadow-[12px_12px_0_#E8A83E] overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: Plate Photo Display */}
            <div className="lg:col-span-6 p-8 sm:p-12 bg-[#E8A83E] flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r-4 border-[#173F35]">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer mix-blend-multiply"
                  onClick={() => onSelectProduct(currentProduct)}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating badges on plate */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="bg-[#2D2A26] text-[#E8C58C] text-xs font-mono font-bold px-3 py-1 rounded-full shadow">
                  {currentProduct.diameterOrSize || '10" Round'}
                </span>
                <span className="bg-[#EBF7EE] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-[#BDE8C6]">
                  <Sprout className="w-3.5 h-3.5" /> 30-Day Backyard Compost
                </span>
              </div>

              <button
                id={`spotlight-view-${currentProduct.id}`}
                onClick={() => onSelectProduct(currentProduct)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#5A4F3D] hover:text-[#C28236] transition-colors"
              >
                <Eye className="w-4 h-4" /> View Technical Specifications & Certifications
              </button>
            </div>

            {/* Right: Plate Details & Pack Options */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-[#173F35]">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center text-[#C28236] font-semibold">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{currentProduct.rating}</span>
                    <span className="text-[#8C7A6B] ml-1">({currentProduct.reviewsCount} verified customer reviews)</span>
                  </div>
                  <span className="text-xs font-mono text-[#10B981] font-bold bg-[#EBF7EE] px-2.5 py-0.5 rounded-md">
                    {currentProduct.inStock ? `In Stock (${(currentProduct.stockCount || 10000).toLocaleString()} units)` : 'Out of Stock'}
                  </span>
                </div>

                <h3 className="text-4xl sm:text-6xl font-serif font-bold text-[#173F35] leading-[.9]">
                  {currentProduct.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B5E4F] mt-2 leading-relaxed">
                  {currentProduct.tagline}
                </p>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-5">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs">
                    <div className="text-[#8C7A6B] text-[10px] uppercase font-semibold">Thermal Rating</div>
                    <div className="font-bold text-[#2D2A26] mt-0.5 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#C28236]" /> -20°C to +180°C
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs">
                    <div className="text-[#8C7A6B] text-[10px] uppercase font-semibold">Composition</div>
                    <div className="font-bold text-[#2D2A26] mt-0.5">
                      100% Agro Residue
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs col-span-2 sm:col-span-1">
                    <div className="text-[#8C7A6B] text-[10px] uppercase font-semibold">Certifications</div>
                    <div className="font-bold text-[#10B981] mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> ISO & Compost OK
                    </div>
                  </div>
                </div>

                {/* Pack Size Selector with Prices */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#4A4031] mb-2.5">
                    <span>Select Pack Format & Pricing:</span>
                    <span className="text-[#C28236] font-mono font-bold">Tier: {currentPack.label}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentProduct.packSizes.map((pack, idx) => {
                      const isSelected = currentPackIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePackChange(currentProduct.id, idx)}
                          className={`p-3 rounded-2xl text-left border transition-all ${
                            isSelected
                              ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-md ring-2 ring-[#C28236]'
                              : 'bg-[#FAF8F5] text-[#2D2A26] border-[#D5C6AC] hover:bg-[#F2ECE1]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">
                              {pack.label}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E8C58C]" />}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-mono font-bold text-sm ${isSelected ? 'text-white' : 'text-[#2D2A26]'}`}>
                              ${pack.price.toFixed(2)}
                            </span>
                            <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-300' : 'text-[#7A6E5E]'}`}>
                              ${pack.unitPrice.toFixed(2)}/pc
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    id={`hero-add-to-cart-${currentProduct.id}`}
                    onClick={() => handleAddWithFeedback(currentProduct, currentPackIndex)}
                    className={`w-full sm:flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      addedAnimation[`${currentProduct.id}-${currentPackIndex}`]
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#2D2A26] text-[#F9F6F0] hover:bg-black'
                    }`}
                  >
                    {addedAnimation[`${currentProduct.id}-${currentPackIndex}`] ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#E8C58C]" />
                        <span>Add {currentPack.label} — ${currentPack.price.toFixed(2)}</span>
                      </>
                    )}
                  </button>

                  <button
                    id="view-specs-btn"
                    onClick={() => onSelectProduct(currentProduct)}
                    className="w-full sm:w-auto py-4 px-5 rounded-xl border border-[#D5C6AC] bg-white text-[#2D2A26] font-semibold text-xs hover:bg-[#FAF8F5] transition-all"
                  >
                    Full Plate Specs
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Detailed Pack Sizes Breakdown Table */}
        <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8">
          <h4 className="font-serif font-bold text-xl text-[#2D2A26] mb-4">
            All Available Packaging Formats & Bulk Tiers — {currentProduct.name}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E6DEC8] text-xs font-mono uppercase text-[#7A6E5E]">
                  <th className="pb-3 font-semibold">Packaging Tier</th>
                  <th className="pb-3 font-semibold">Plate Count</th>
                  <th className="pb-3 font-semibold">Unit Price</th>
                  <th className="pb-3 font-semibold">Total Price</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {currentProduct.packSizes.map((pack, idx) => {
                  const isAdded = addedAnimation[`${currentProduct.id}-${idx}`];
                  return (
                    <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-4 font-semibold text-[#2D2A26]">
                        {pack.label}
                      </td>
                      <td className="py-4 font-mono text-[#5A4F3D]">
                        {pack.size} plates
                      </td>
                      <td className="py-4 font-mono text-[#C28236] font-bold">
                        ${pack.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 font-mono font-bold text-[#2D2A26]">
                        ${pack.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          id={`table-add-pack-${idx}`}
                          onClick={() => handleAddWithFeedback(currentProduct, idx)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isAdded
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#2D2A26] text-white hover:bg-black'
                          }`}
                        >
                          {isAdded ? 'Added!' : 'Add to Cart'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
