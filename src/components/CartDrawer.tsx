import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Sprout, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (appliedDiscount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {

  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');

  const subtotal = cartItems.reduce((acc, item) => {
    const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
    return acc + pack.price * item.quantity;
  }, 0);

  const totalPieces = cartItems.reduce((acc, item) => {
    const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
    return acc + pack.size * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 7.5;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + shipping + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();

    if (code === 'CENTRALINDIA') {
      setDiscountPercent(15);
      setAppliedPromo('CENTRALINDIA (15% Off)');
      setPromoInput('');
    } else if (code === 'EARTH10' || code === 'THELEGEND5') {
      setDiscountPercent(10);
      setAppliedPromo(`${code} (10% Off)`);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try "CENTRALINDIA" or "THELEGEND5"');
    }
  };

  if (!isOpen) return null;
  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#D5C6AC] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6DEC8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C28236]" />
            <h3 className="font-serif font-bold text-lg text-[#2D2A26]">Your Biodegradable Plates Order</h3>
            <span className="text-xs bg-[#EDE5D5] text-[#5A4F3D] px-2 py-0.5 rounded-full font-mono font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#2D2A26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Impact Bar */}
        {totalPieces > 0 && (
          <div className="bg-[#2D2A26] text-white text-xs px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#E8C58C]">
              <Sprout className="w-3.5 h-3.5 text-[#10B981]" />
              Plastic Displaced: <strong>{totalPieces} plates & pieces</strong>
            </span>
            <span className="text-[#10B981] font-mono text-[11px]">~{(totalPieces * 0.05).toFixed(1)}kg Bran</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6 text-[#7A6E5E]">
              <div className="w-14 h-14 rounded-full bg-[#EDE5D5] flex items-center justify-center text-[#9E9080]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-serif font-semibold text-base text-[#2D2A26]">Your cart is empty</p>
              <p className="text-xs">Browse our Central India wheat bran tableware collection to start dining sustainably.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => {
              const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
              const itemTotal = pack.price * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.packSizeIndex}`}
                  id={`cart-item-${idx}`}
                  className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-sm flex gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain p-1 bg-white border border-[#E6DEC8] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold font-serif text-[#2D2A26] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[#9E9080] hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#C28236] font-medium">
                        {pack.label}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F4EFE6]">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D5C6AC] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="p-1 hover:bg-[#EBE3D3] text-[#4A4031] rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#2D2A26]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="p-1 hover:bg-[#EBE3D3] text-[#4A4031] rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-bold text-xs text-[#2D2A26]">
                          ${itemTotal.toFixed(2)}
                        </div>
                        <div className="text-[9px] text-[#8C7A6B]">
                          ${pack.unitPrice.toFixed(2)}/pc
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Breakdown */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E6DEC8] space-y-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#9E9080] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Code: CENTRALINDIA or THELEGEND5"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#D5C6AC] text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#C28236]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#EDE5D5] text-[#2D2A26] text-xs font-bold hover:bg-[#E2D6C0]"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div className="text-[11px] text-[#10B981] font-semibold flex items-center justify-between bg-[#EBF7EE] px-2.5 py-1 rounded">
                <span>Code Applied: {appliedPromo}</span>
                <button onClick={() => { setDiscountPercent(0); setAppliedPromo(''); }} className="text-red-500 underline text-[10px]">Remove</button>
              </div>
            )}

            {promoError && (
              <div className="text-[10px] text-red-500 font-medium">
                {promoError}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-[#5A4F3D] border-t border-[#F2ECE1] pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#10B981] font-medium">
                  <span>Discount ({discountPercent}%):</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Eco Shipping:</span>
                <span className="font-mono">{shipping === 0 ? <span className="text-[#10B981] font-bold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (5%):</span>
                <span className="font-mono">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#2D2A26] pt-1.5 border-t border-[#E6DEC8]">
                <span>Total:</span>
                <span className="font-mono text-[#C28236]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => onProceedToCheckout(discountAmount, appliedPromo)}
              className="w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Proceed to Fast Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#E8C58C]" />
            </button>

            <div className="text-center text-[10px] text-[#8C7A6B]">
              Dispatched directly from Central India Hub · Zero-Plastic packaging
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
