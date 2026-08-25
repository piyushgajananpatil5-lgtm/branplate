import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Mail, Phone, User, CreditCard, Sparkles, Truck, ArrowRight } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  promoCode: string;
  onOrderSuccess: (order: Order) => void;
  currentUserEmail?: string | null;
  onAutoLogin?: (token: string, user: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  promoCode,
  onOrderSuccess,
  currentUserEmail,
  onAutoLogin
}) => {

  const [formData, setFormData] = useState({
    name: 'Piyush Patil',
    email: currentUserEmail || 'piyushgajananpatil5@gmail.com',
    phone: '+91 98234 56789',
    street: '74 Green Park Avenue, Near Agro Tech Center',
    city: 'Nagpur',
    state: 'Maharashtra',
    zip: '440001',
    country: 'India',
    paymentMethod: 'prepaid_upi',
    notes: 'Please pack in extra-reinforced moisture-sealed master box.'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, item) => {
    const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
    return acc + pack.price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 7.5;
  const tax = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemsPayload = cartItems.map(item => {
      const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
      return {
        productId: item.product.id,
        productName: item.product.name,
        packLabel: pack.label,
        quantity: item.quantity,
        unitPrice: pack.price,
        total: pack.price * item.quantity,
        image: item.product.image
      };
    });

    const payload = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country
      },
      items: itemsPayload,
      subtotal,
      discount: discountAmount,
      shipping,
      tax,
      total,
      paymentMethod: formData.paymentMethod === 'prepaid_upi' ? 'UPI / Direct NetBanking' : 'Credit / Debit Card',
      notes: formData.notes,
      promoCode
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        setAccountCreated(true);
        if (onAutoLogin && data.token && data.order?.email) {
          onAutoLogin(data.token, { email: data.order.email, name: data.order.customerName, type: 'user' });
        }
        onOrderSuccess(data.order);
      }
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="checkout-modal"
        className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5C6AC] relative my-auto max-h-[92vh] overflow-y-auto"
      >
        <button
          id="close-checkout-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#10B981] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]">
              Order Placed Successfully!
            </h3>

            <div className="inline-flex items-center gap-2 bg-[#EDE5D5] px-4 py-1.5 rounded-full font-mono text-sm font-bold text-[#2D2A26]">
              Order #{confirmedOrder.orderNumber}
            </div>

            {/* Account Auto-Creation & Login Banner */}
            <div className="p-3.5 bg-[#EBF7EE] border border-[#A7F3D0] rounded-2xl max-w-lg mx-auto text-left flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <div className="text-xs text-[#065F46] leading-relaxed">
                <span className="font-bold text-[#047857]">Customer Account Created & Logged In!</span>
                <p className="mt-0.5 text-[11px] text-[#065F46]">
                  You are now signed in as <strong className="font-mono">{confirmedOrder.email}</strong>. Your order is linked to your account for live tracking and express reorders.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#5A4F3D] max-w-md mx-auto">
              Confirmation receipt and live dispatch updates sent to <strong>{confirmedOrder.email}</strong>.
            </p>

            <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] max-w-lg mx-auto text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#F2ECE1] pb-2 font-medium">
                <span className="text-[#7A6E5E]">Tracking Reference:</span>
                <span className="font-mono font-bold text-[#C28236]">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#F2ECE1] pb-2 font-medium">
                <span className="text-[#7A6E5E]">Delivery Destination:</span>
                <span className="text-[#2D2A26]">{confirmedOrder.address.street}, {confirmedOrder.address.city}, {confirmedOrder.address.state}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#2D2A26]">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-[#C28236]">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-8 py-3.5 rounded-full bg-[#2D2A26] text-white text-xs font-bold hover:bg-black transition-all"
            >
              Continue Browsing BranPlate
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure SSL Checkout
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] mb-6">
              Shipping & Order Details
            </h3>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6E5E] border-b border-[#E6DEC8] pb-1">
                  1. Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6E5E] border-b border-[#E6DEC8] pb-1">
                  2. Shipping Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4031] mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4031] mb-1">Postal/Zip *</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6E5E] border-b border-[#E6DEC8] pb-1">
                  3. Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'prepaid_upi' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold transition-all ${
                      formData.paymentMethod === 'prepaid_upi'
                        ? 'border-[#2D2A26] bg-[#2D2A26] text-[#E8C58C]'
                        : 'border-[#D5C6AC] bg-white text-[#4A4031]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#10B981]" />
                    <span>Instant UPI / Fast NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#2D2A26] bg-[#2D2A26] text-[#E8C58C]'
                        : 'border-[#D5C6AC] bg-white text-[#4A4031]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#C28236]" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>
              </div>

              {/* Order Total Review */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A6E5E]">
                  <span>Items Subtotal:</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981] font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7A6E5E]">
                  <span>Central India Freight Delivery:</span>
                  <span className="font-mono">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#7A6E5E]">
                  <span>GST / Sales Tax (5%):</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D2A26] pt-2 border-t border-[#F2ECE1]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#C28236]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-60"
              >
                {loading ? 'Confirming with Central India Hub...' : `Confirm Order — $${total.toFixed(2)}`}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
