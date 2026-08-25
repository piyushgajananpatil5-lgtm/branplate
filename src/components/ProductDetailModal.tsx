import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Flame, RotateCcw, Sprout, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, packSizeIndex: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedPackIdx, setSelectedPackIdx] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const activePack = product.packSizes[selectedPackIdx] || product.packSizes[0];

  const handleAdd = () => {
    onAddToCart(product, selectedPackIdx);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const images = [product.image, ...product.secondaryImages];

  return (
    <div id="product-detail-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="product-detail-modal"
        className="bg-[#FAF8F5] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D5C6AC] relative flex flex-col my-auto"
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E6DEC8] shadow-inner relative flex items-center justify-center p-6">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-[#2D2A26]/80 text-[#E8C58C] text-xs font-mono px-3 py-1 rounded-md backdrop-blur-sm">
                {product.diameterOrSize}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#C28236] scale-105 shadow-md' : 'border-[#E6DEC8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Composting & Sustainability highlight */}
            <div className="p-4 rounded-2xl bg-[#EDE5D5] border border-[#D5C6AC] text-xs space-y-2 text-[#4A4031]">
              <div className="font-bold flex items-center gap-1.5 text-[#2D2A26]">
                <Sprout className="w-4 h-4 text-[#10B981]" /> 100% Soil Return Guarantee
              </div>
              <p className="leading-relaxed">
                Made strictly with wheat bran and water steam compression. When finished, bury it in your garden soil or compost heap. Disintegrates into organic manure within 30 days!
              </p>
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#C28236] font-semibold uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-[#10B981]">Central India Certified</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#C28236]">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#2D2A26]">{product.rating}</span>
                <span className="text-xs text-[#8C7A6B]">({product.reviewsCount} verified reviews)</span>
              </div>

              <p className="text-sm text-[#5A4F3D] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Spec Matrix */}
              <div className="mt-5 space-y-2 text-xs border-y border-[#E6DEC8] py-4">
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#7A6E5E]">Thermal Range:</span>
                  <span className="font-medium text-[#2D2A26]">{product.heatResistance}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#7A6E5E]">Materials:</span>
                  <span className="font-medium text-[#2D2A26]">{product.materials}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#7A6E5E]">Dimensions & Weight:</span>
                  <span className="font-medium text-[#2D2A26]">{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7A6E5E]">Shelf Life:</span>
                  <span className="font-medium text-[#2D2A26]">{product.shelfLife}</span>
                </div>
              </div>

              {/* Food Suitability Pills */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-[#2D2A26] block mb-2">Ideal For:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.suitableFor.map((item, idx) => (
                    <span key={idx} className="text-[11px] bg-[#EDE5D5] text-[#4A4031] px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pack Size Selection */}
            <div className="space-y-3 pt-4 border-t border-[#E6DEC8]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2D2A26]">Choose Pack Option:</span>
                <span className="font-mono text-[#C28236] font-bold">
                  ${activePack.unitPrice.toFixed(2)} / unit
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.packSizes.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPackIdx(idx)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col justify-between ${
                      selectedPackIdx === idx
                        ? 'border-[#2D2A26] bg-[#2D2A26] text-[#E8C58C] shadow-md'
                        : 'border-[#D5C6AC] bg-white text-[#4A4031] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <span>{pack.label}</span>
                    <span className="font-mono text-sm mt-1">
                      ${pack.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add to Cart Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className={`flex-1 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdded
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#2D2A26] text-[#F9F6F0] hover:bg-black'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#E8C58C]" />
                      <span>Add {activePack.label} — ${activePack.price.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
