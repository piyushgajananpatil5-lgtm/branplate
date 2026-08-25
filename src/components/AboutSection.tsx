import React from 'react';
import { Sprout, Award, ShieldCheck, HeartHandshake, MapPin, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onOpenSampleModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenSampleModal }) => {
  return (
    <section id="about-section" className="py-20 bg-[#FAF8F5] border-b border-[#E6DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5D5] text-[#C28236] text-xs font-mono font-bold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" /> Born in Central India
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D2A26] leading-tight">
              Pioneering Zero-Landfill Dining Through Agricultural Upcycling.
            </h2>

            <p className="text-base sm:text-lg text-[#5A4F3D] leading-relaxed">
              Every harvest season across Central India, millions of tonnes of wheat bran—the outer nutrient-rich husk separated during flour milling—are treated as agricultural residue or burned in stubble fires.
            </p>

            <p className="text-sm sm:text-base text-[#6B5E4F] leading-relaxed">
              BranPlate was created to close this loop. By harnessing hydraulic thermo-compression and steam physics, we transform raw farmer bran into durable, oven-safe, and moisture-resistant biodegradable plates that naturally return to the soil in 30 days without leaving a single trace of microplastics.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#EDE5D5] border border-[#D5C6AC]">
                <div className="text-2xl font-serif font-bold text-[#2D2A26]">100%</div>
                <div className="text-xs text-[#6B5E4F] mt-0.5">Agricultural Grain Byproduct</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EDE5D5] border border-[#D5C6AC]">
                <div className="text-2xl font-serif font-bold text-[#10B981]">30 Days</div>
                <div className="text-xs text-[#6B5E4F] mt-0.5">Natural Soil Breakdown</div>
              </div>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                alt="Central India Wheat Fields"
                className="w-full h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 text-white">
                <div>
                  <div className="flex items-center gap-1.5 text-[#E8C58C] text-xs font-mono mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" /> Central India Agro Cluster, MP & MH
                  </div>
                  <h4 className="text-xl font-serif font-bold">Empowering Over 450+ Smallholder Farmers</h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    Creating recurring rural income while eliminating stubble air pollution.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-[#E6DEC8]">
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#C28236]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#2D2A26]">Heat & Leak Tested</h4>
            <p className="text-xs text-[#6B5E4F] leading-relaxed">
              Withstands boiling dals, soups, curries, and sauces for up to 45 minutes. Safe for microwave and oven reheating up to 180°C.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] flex items-center justify-center text-[#10B981]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#2D2A26]">Zero Artificial Additives</h4>
            <p className="text-xs text-[#6B5E4F] leading-relaxed">
              No PFAS coatings, no synthetic plastics, no glues, and no chlorine bleaching. Safe enough to compost in your home kitchen garden.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#2D2A26]">Farmer Fair-Trade Network</h4>
            <p className="text-xs text-[#6B5E4F] leading-relaxed">
              Every plate purchased directly funds agricultural residue collection programs across Central India, increasing farm family incomes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
