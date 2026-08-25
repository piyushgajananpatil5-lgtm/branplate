import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Globe } from 'lucide-react';
import { AppConfig } from '../types';

interface ContactSectionProps {
  config: AppConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Wholesale & General Inquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: 'Wholesale & General Inquiry', message: '' });
    }, 3000);
  };

  return (
    <section id="contact-section" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info & Domain */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5D5] text-[#C28236] text-xs font-mono font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]">
              Partner with BranPlate
            </h2>

            <p className="text-sm text-[#5A4F3D] leading-relaxed">
              Whether you are an eco-conscious restaurant owner, wedding planner, retailer, or export partner, our team in Central India is ready to assist with custom sizes, branding, and bulk deliveries.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0">
                  <Mail className="w-5 h-5 text-[#C28236]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#7A6E5E]">Support & Inquiries Email</div>
                  <a href={`mailto:${config.contactEmail || config.firstAdminEmail}`} className="text-sm font-bold text-[#2D2A26] hover:underline font-mono">
                    {config.contactEmail || config.firstAdminEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0">
                  <Phone className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#7A6E5E]">Direct Phone & WhatsApp</div>
                  <a href={`tel:${(config.contactPhone || '+91 98234 56789').replace(/\s+/g, '')}`} className="text-sm font-bold text-[#2D2A26] hover:underline font-mono">
                    {config.contactPhone || '+91 98234 56789'}
                  </a>
                  <div className="text-[11px] text-[#8C7A6B]">
                    {config.contactHours || 'Monday – Saturday: 9:00 AM – 7:00 PM IST'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0">
                  <Globe className="w-5 h-5 text-[#C28236]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#7A6E5E]">Custom Domain & Portal</div>
                  <div className="text-sm font-bold text-[#2D2A26] font-mono">
                    {config.customDomain}
                  </div>
                  <div className="text-[11px] text-[#8C7A6B]">
                    Hosted at {config.clientUrl}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0">
                  <MapPin className="w-5 h-5 text-[#C28236]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#7A6E5E]">Manufacturing Facility & Dispatch</div>
                  <div className="text-sm font-medium text-[#2D2A26]">
                    {config.contactAddress || 'Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India'}
                  </div>
                  {config.gstinNumber && (
                    <div className="text-[11px] font-mono text-[#8C7A6B] mt-0.5">
                      GSTIN: {config.gstinNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E6DEC8] shadow-lg">
            <h3 className="text-xl font-serif font-bold text-[#2D2A26] mb-6">Send Us a Direct Message</h3>

            {sent ? (
              <div className="py-12 text-center space-y-3 bg-[#EBF7EE] rounded-2xl border border-[#A7E3B6]">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
                <h4 className="font-serif font-bold text-lg text-[#2D2A26]">Message Received</h4>
                <p className="text-xs text-[#5A4F3D]">Our team will reply to {formData.email} within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Piyush Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4031] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] font-medium"
                  >
                    <option value="Wholesale & General Inquiry">Wholesale & General Inquiry</option>
                    <option value="Custom Plate Molding & Branding">Custom Plate Molding & Branding</option>
                    <option value="Event Catering Bulk Order">Event Catering Bulk Order</option>
                    <option value="Export & International Shipping">Export & International Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4031] mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your event, cafe, or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4 text-[#E8C58C]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
