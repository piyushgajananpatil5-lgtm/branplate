import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Sprout, Factory, Utensils, Recycle, Check, ArrowRight } from 'lucide-react';
export const CircularStory = ({ impact, onExploreProducts }) => {
    const [activeStep, setActiveStep] = useState(0);
    const handleExplore = onExploreProducts || (() => { });
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
    return (_jsx("section", { id: "circular-story-section", className: "py-20 bg-[#F4EFE6] border-b border-[#E6DEC8]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DEC8] text-[#5A4F3D] text-xs font-mono font-bold uppercase tracking-wider mb-3", children: [_jsx(Recycle, { className: "w-3.5 h-3.5 text-[#10B981]" }), " The Full Circular Lifecycle"] }), _jsx("h2", { className: "text-3xl sm:text-5xl font-serif font-bold text-[#2D2A26] tracking-tight", children: "How Wheat Byproduct Becomes Biodegradable Plates" }), _jsx("p", { className: "text-[#6B5E4F] text-base sm:text-lg mt-4 leading-relaxed", children: "A closed-loop manufacturing journey originating in the agricultural heartland of Central India, replacing millions of single-use plastic plates with 100% compostable bran plates." })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-10", children: steps.map((step) => {
                        const Icon = step.icon;
                        const isCurrent = activeStep === step.id;
                        return (_jsxs("button", { onClick: () => setActiveStep(step.id), className: `p-4 rounded-2xl text-left transition-all border ${isCurrent
                                ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-lg scale-[1.02]'
                                : 'bg-white text-[#4A4031] border-[#E6DEC8] hover:bg-[#EFE7D8]'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: `p-2 rounded-lg ${isCurrent ? 'bg-[#3D3A35] text-[#E8C58C]' : 'bg-[#F4EFE6] text-[#C28236]'}`, children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsxs("span", { className: `text-xs font-mono ${isCurrent ? 'text-[#E8C58C]' : 'text-[#8C7A6B]'}`, children: ["0", step.id + 1] })] }), _jsx("div", { className: "font-serif font-bold text-sm truncate", children: step.title.split('. ')[1] }), _jsx("div", { className: `text-[11px] truncate mt-0.5 ${isCurrent ? 'text-neutral-300' : 'text-[#7A6E5E]'}`, children: step.subtitle })] }, step.id));
                    }) }), _jsxs("div", { className: "bg-white rounded-3xl overflow-hidden border border-[#E6DEC8] shadow-xl grid grid-cols-1 lg:grid-cols-12", children: [_jsxs("div", { className: "lg:col-span-6 relative aspect-[4/3] lg:aspect-auto", children: [_jsx("img", { src: steps[activeStep].image, alt: steps[activeStep].title, className: "w-full h-full object-cover", referrerPolicy: "no-referrer" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" }), _jsx("div", { className: "absolute bottom-4 left-4 text-white lg:hidden", children: _jsxs("span", { className: "text-xs font-mono bg-[#2D2A26]/80 px-2.5 py-1 rounded", children: ["Step 0", activeStep + 1, " of 04"] }) })] }), _jsxs("div", { className: "lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-2", children: [_jsxs("span", { children: ["Phase 0", activeStep + 1] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Central India Model" })] }), _jsx("h3", { className: "text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]", children: steps[activeStep].title }), _jsx("p", { className: "text-sm sm:text-base text-[#5A4F3D] mt-4 leading-relaxed", children: steps[activeStep].description }), _jsx("div", { className: "mt-6 space-y-2.5", children: steps[activeStep].highlights.map((item, idx) => (_jsxs("div", { className: "flex items-center gap-2.5 text-xs sm:text-sm text-[#2D2A26] font-medium", children: [_jsx("div", { className: "w-5 h-5 rounded-full bg-[#EBF7EE] text-[#10B981] flex items-center justify-center shrink-0", children: _jsx(Check, { className: "w-3.5 h-3.5" }) }), _jsx("span", { children: item })] }, idx))) })] }), _jsxs("div", { className: "pt-6 border-t border-[#F2ECE1] flex items-center justify-between", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { disabled: activeStep === 0, onClick: () => setActiveStep(prev => Math.max(0, prev - 1)), className: "px-4 py-2 rounded-xl text-xs font-semibold border border-[#D5C6AC] disabled:opacity-30 hover:bg-[#FAF8F5] transition-colors", children: "Previous" }), _jsx("button", { disabled: activeStep === steps.length - 1, onClick: () => setActiveStep(prev => Math.min(steps.length - 1, prev + 1)), className: "px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D2A26] text-white disabled:opacity-30 hover:bg-black transition-colors", children: "Next Step" })] }), _jsxs("button", { onClick: handleExplore, className: "text-xs font-bold text-[#C28236] hover:underline flex items-center gap-1", children: [_jsx("span", { children: "Shop Tableware" }), _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })] })] })] })] }) }));
};
