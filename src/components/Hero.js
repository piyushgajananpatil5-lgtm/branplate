import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Sparkles, CheckCircle2, Shield, Flame, Sprout } from "lucide-react";
const Hero = ({
  onShopClick,
  onAdvisorClick,
  onSampleClick,
  onExplore,
  onOpenSampleModal,
  impact
}) => {
  const safeImpact = impact || {
    plasticPlatesReplaced: 1845200,
    wheatBranUpcycledKg: 92260,
    co2SavedKg: 221424,
    partnerFarms: 420,
    soilDegradationDays: 30
  };
  const handleShop = onShopClick || onExplore || (() => {
  });
  const handleAdvisor = onAdvisorClick || (() => {
  });
  const handleSample = onSampleClick || onOpenSampleModal || (() => {
  });
  return /* @__PURE__ */ jsxs("section", { id: "hero-section", className: "relative overflow-hidden bg-[#E8A83E] pt-10 pb-20 border-b-4 border-[#173F35]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-20", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#173F35_1px,transparent_1px)] [background-size:18px_18px]" }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-6 text-left", children: [
        /* @__PURE__ */ jsxs("div", { id: "hero-eyebrow-badge", className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5D5] border border-[#D5C6AC] text-[#5A4F3D] text-xs sm:text-sm font-medium tracking-wide", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#10B981]" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold uppercase tracking-wider text-[11px] sm:text-xs", children: "FIELD-FORGED TABLEWARE \xB7 ZERO PLASTIC" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { id: "hero-main-title", className: "text-6xl sm:text-8xl lg:text-[9rem] font-serif font-bold text-[#173F35] leading-[.82]", children: [
          "PLATES",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-[#F9F1DF]", children: "WITH A" }),
          /* @__PURE__ */ jsx("br", {}),
          "PURPOSE."
        ] }),
        /* @__PURE__ */ jsx("p", { id: "hero-tagline-text", className: "text-xl sm:text-2xl font-serif text-[#173F35] font-medium uppercase", children: "The good kind of disposable." }),
        /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-[#173F35] leading-relaxed max-w-xl font-medium", children: "100% natural, leak-resistant biodegradable plates forged from upcycled wheat bran agricultural surplus in Central India. Oven, microwave, and hot-liquid safe \u2014 completely decomposing in soil in 30 days without toxic microplastics." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 pt-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              id: "hero-shop-now-btn",
              onClick: handleShop,
              className: "px-8 py-4 rounded-full bg-[#173F35] text-[#F9F1DF] font-semibold text-base hover:bg-[#0c2d26] transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 group",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Shop Plates" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[#E8C58C] group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              id: "hero-ai-advisor-btn",
              onClick: handleAdvisor,
              className: "px-6 py-4 rounded-full bg-[#F9F1DF] text-[#173F35] font-semibold text-base hover:bg-white border border-[#173F35] transition-all flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-[#C28236]" }),
                /* @__PURE__ */ jsx("span", { children: "AI Plates Event Planner" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[#173F35]/30 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#173F35]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#10B981] shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Composts in 30 Days" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4 text-[#C28236] shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Oven & Microwave 180\xB0C" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-[#10B981] shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "0% Chemical Binders" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "plate-packaging product-rise relative rounded-[2rem] overflow-hidden border-4 border-[#173F35] aspect-[4/3] sm:aspect-square flex items-center justify-center p-6 sm:p-10", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/plate.svg",
              alt: "BranPlate 100% Biodegradable Plate",
              className: "w-full h-full object-contain drop-shadow-xl mix-blend-multiply",
              referrerPolicy: "no-referrer"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 right-4 bg-[#2D2A26]/90 backdrop-blur-md text-white p-4 rounded-xl border border-neutral-700/60 shadow-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#E8C58C] font-semibold mb-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Sprout, { className: "w-3.5 h-3.5 text-[#10B981]" }),
                "Central India Agro Impact"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-neutral-300", children: "Live Counters" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center pt-1 border-t border-neutral-700", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-white font-mono", children: [
                  ((safeImpact.plasticPlatesReplaced || 1845200) / 1e6).toFixed(2),
                  "M+"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-neutral-300", children: "Plates Saved" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-[#E8C58C] font-mono", children: [
                  ((safeImpact.wheatBranUpcycledKg || 92260) / 1e3).toFixed(1),
                  "k kg"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-neutral-300", children: "Bran Upcycled" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-[#10B981] font-mono", children: "30 Days" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-neutral-300", children: "Soil Breakdown" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute -top-4 -left-4 bg-[#FFFFFF] px-4 py-2.5 rounded-xl shadow-lg border border-[#E6DEC8] flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#10B981] font-bold text-sm", children: "\u{1F33E}" }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-[#2D2A26]", children: "100% Wheat Bran" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#7A6E5E]", children: "0% Plastic or Wax Coated" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  Hero
};
