import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, PackageCheck, Send, Building2, MapPin, Mail, Phone, User } from 'lucide-react';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  isOpen,
  onClose
}) => {

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: 'restaurant',
    estimatedMonthlyVolume: '1,000 - 5,000 plates/mo',
    shippingAddress: '',
    interestedProducts: ['10" Heavy-Duty Biodegradable Plate (Sample Pack of 5)'],
    message: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const productOptions = [
    '10" Heavy-Duty Biodegradable Plate (Sample Pack of 5)',
    '10" Biodegradable Plate — Hot Curry & Gravy Test Pack',
    'Commercial Wholesale Sample Crate (Export / B2B Grade)'
  ];

  const toggleProduct = (item: string) => {
    setFormData(prev => {
      const exists = prev.interestedProducts.includes(item);
      return {
        ...prev,
        interestedProducts: exists
          ? prev.interestedProducts.filter(p => p !== item)
          : [...prev.interestedProducts, item]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting sample inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div id="sample-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="sample-request-modal"
        className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5C6AC] relative my-auto"
      >
        {/* Close Button */}
        <button
          id="close-sample-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#10B981] mx-auto flex items-center justify-center">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2D2A26]">
              Sample Box Dispatch Scheduled!
            </h3>
            <p className="text-sm text-[#5A4F3D] max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-[#2D2A26]">{formData.name}</span>. Our Central India dispatch center has logged your sample kit request for <span className="font-semibold text-[#2D2A26]">{formData.businessName}</span>.
            </p>
            <div className="p-4 bg-[#EDE5D5] rounded-2xl text-xs text-[#4A4031] max-w-md mx-auto text-left space-y-1">
              <div><strong>Selected Products:</strong> {(formData.interestedProducts || []).join(', ')}</div>
              <div><strong>Dispatch Hub:</strong> Central India Agro Cluster, Nagpur</div>
              <div><strong>Delivery Target:</strong> 2-3 Business Days</div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 rounded-full bg-[#2D2A26] text-white text-xs font-bold hover:bg-black transition-all"
            >
              Done & Return to Store
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> B2B & Commercial Samples
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]">
              Request Free BranPlate Sample Box
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E4F] mt-1 mb-6">
              Test our plates with your hottest gravies, soups, ovens, and catering dishes. Free kit for verified businesses and event organizers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9E9080] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Piyush Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Business / Event Name *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#9E9080] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Green Leaf Cafe / Wedding Gala"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Business Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9E9080] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Phone / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#9E9080] absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98234 56789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Business Category</label>
                  <select
                    value={formData.businessType}
                    onChange={(e: any) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] font-medium"
                  >
                    <option value="restaurant">Restaurant / Cloud Kitchen</option>
                    <option value="catering">Catering Company</option>
                    <option value="events">Event & Wedding Management</option>
                    <option value="hotel">Hotel / Eco Resort</option>
                    <option value="retailer">Retailer / Supermarket</option>
                    <option value="export">Export & Global Distribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Estimated Monthly Requirement</label>
                  <select
                    value={formData.estimatedMonthlyVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] font-medium"
                  >
                    <option value="500 - 1,000 units">500 - 1,000 units / month</option>
                    <option value="1,000 - 5,000 units">1,000 - 5,000 units / month</option>
                    <option value="5,000 - 20,000 units">5,000 - 20,000 units / month</option>
                    <option value="20,000+ units">20,000+ units (Wholesale Pallets)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4031] mb-1">Physical Shipping Destination Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#9E9080] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Street, Building, City, State, Pincode / Postal Code"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-[#4A4031] mb-1.5">Include in Sample Kit:</label>
                <div className="grid grid-cols-2 gap-2">
                  {productOptions.map((item, idx) => {
                    const isSelected = formData.interestedProducts.includes(item);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleProduct(item)}
                        className={`p-2 rounded-xl text-left text-[11px] font-medium transition-all flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-[#2D2A26] text-[#E8C58C] border-[#2D2A26]'
                            : 'bg-white text-[#4A4031] border-[#D5C6AC] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#10B981] text-white' : 'border border-[#9E9080]'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 fill-current" />}
                        </div>
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-xs sm:text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#E8C58C]" />
                <span>{loading ? 'Submitting Request...' : 'Dispatch Free Sample Box'}</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
