import React, { useState } from 'react';
import { Sprout, Factory, Utensils, Recycle, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { ImpactStats } from '../types';

interface CircularStoryProps {
  impact?: ImpactStats;
  onExploreProducts?: () => void;
}

export const CircularStory: React.FC<CircularStoryProps> = ({
  impact,
  onExploreProducts
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const handleExplore = onExploreProducts || (() => {});

  const steps = [
    {
      id: 0,
      title: '1. The Golden Field Harvest',
      subtitle: 'Upcycling Agro-Waste in Central India',
      icon: Sprout,
      color: '#C28236',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      description: 'When wheat is milled for flour, the fibrous outer husk (wheat bran) is left behind. We partner directly with farm cooperatives across Madhya Pradesh and Maharashtra to purchase this agricultural byproduct at fair prices, turning farm residue into a vital income stream instead of being incinerated as crop stubble.',
      highlights: ['Direct farmer fair-trade procurement', 'Eliminates open-field stubble burning', 'Zero virgin trees cut down']
    },
    {
      id: 1,
      title: '2. Steam Thermo-Forging',
      subtitle: 'Zero Additives, Zero Plastics, Zero Glues',
      icon: Factory,
      color: '#4A4031',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      description: 'The raw wheat bran is finely milled, sanitized, and fed into high-precision hydraulic heated molds. Under 200°C steam pressure, the natural lignins inside the bran bond together to create a dense, rigid, self-sealing structure. No artificial chemicals, bleach, or polymer coatings are ever added.',
      highlights: ['Water-steam bonding technology', 'Food-contact certified safe', 'Chemical-free & vegan production']
    },
    {
      id: 2,
      title: '3. The Feast Experience',
      subtitle: 'Sturdy, Oven-Safe, and Grease-Proof',
      icon: Utensils,
      color: '#C28236',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      description: 'Unlike soggy paper plates or brittle palm leaves, BranPlate tableware handles steaming hot curries, heavy banquet portions, soups, and greasy steaks with ease. It is microwave and oven safe up to 180°C, and will not warp or impart chemical tastes to your food.',
      highlights: ['Handles boiling liquids for 45+ mins', 'Microwave and oven reheat safe', 'Aesthetic earthy artisanal finish']
    },
    {
      id: 3,
      title: '4. Back to the Earth',
      subtitle: 'Complete Soil Breakdown in 30 Days',
      icon: Recycle,
      color: '#10B981',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      description: 'After dining, simply toss BranPlate into your home compost, soil garden, or organic waste bin. In the presence of ambient moisture and soil microbes, it completely decomposes into nutrient-rich organic hummus in 30 days — replenishing the very earth the grain originated from.',
      highlights: ['30 days in home soil composting', 'Zero microplastic contamination', 'Enriches soil with organic nitrogen']
    }
  ];

  return (
    <section id="circular-story-section" className="py-20 bg-[#F4EFE6] border-b border-[#E6DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DEC8] text-[#5A4F3D] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Recycle className="w-3.5 h-3.5 text-[#10B981]" /> The Full Circular Lifecycle
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D2A26] tracking-tight">
            How Wheat Byproduct Becomes Biodegradable Plates
          </h2>
          <p className="text-[#6B5E4F] text-base sm:text-lg mt-4 leading-relaxed">
            A closed-loop manufacturing journey originating in the agricultural heartland of Central India, replacing millions of single-use plastic plates with 100% compostable bran plates.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isCurrent
                    ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-lg scale-[1.02]'
                    : 'bg-white text-[#4A4031] border-[#E6DEC8] hover:bg-[#EFE7D8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isCurrent ? 'bg-[#3D3A35] text-[#E8C58C]' : 'bg-[#F4EFE6] text-[#C28236]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-mono ${isCurrent ? 'text-[#E8C58C]' : 'text-[#8C7A6B]'}`}>
                    0{step.id + 1}
                  </span>
                </div>
                <div className="font-serif font-bold text-sm truncate">{step.title.split('. ')[1]}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isCurrent ? 'text-neutral-300' : 'text-[#7A6E5E]'}`}>
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#E6DEC8] shadow-xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Visual */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto">
            <img
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"></div>
            <div className="absolute bottom-4 left-4 text-white lg:hidden">
              <span className="text-xs font-mono bg-[#2D2A26]/80 px-2.5 py-1 rounded">
                Step 0{activeStep + 1} of 04
              </span>
            </div>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-2">
                <span>Phase 0{activeStep + 1}</span>
                <span>•</span>
                <span>Central India Model</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]">
                {steps[activeStep].title}
              </h3>

              <p className="text-sm sm:text-base text-[#5A4F3D] mt-4 leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Highlights */}
              <div className="mt-6 space-y-2.5">
                {steps[activeStep].highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#2D2A26] font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#EBF7EE] text-[#10B981] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Controls */}
            <div className="pt-6 border-t border-[#F2ECE1] flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D5C6AC] disabled:opacity-30 hover:bg-[#FAF8F5] transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D2A26] text-white disabled:opacity-30 hover:bg-black transition-colors"
                >
                  Next Step
                </button>
              </div>

              <button
                onClick={handleExplore}
                className="text-xs font-bold text-[#C28236] hover:underline flex items-center gap-1"
              >
                <span>Shop Tableware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
