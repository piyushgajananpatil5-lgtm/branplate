import { jsx, jsxs } from "react/jsx-runtime";
import { Leaf, Globe, ShieldCheck, ArrowUp } from "lucide-react";
const Footer = ({
  config,
  onNavigate,
  onOpenSampleModal,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsx("footer", { id: "main-footer", className: "bg-[#221F1B] text-[#EDE5D5] border-t border-[#3A352F] pt-16 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#38332D]", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-[#E8C58C] flex items-center justify-center text-[#221F1B] shadow-md", children: /* @__PURE__ */ jsx(Leaf, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-serif text-2xl font-bold tracking-tight text-white", children: "BranPlate" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-neutral-400 leading-relaxed max-w-sm", children: "From Field to Feast. Back to Earth. Sustainable biodegradable wheat bran tableware made from upcycled agricultural byproduct in Central India." }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#3A352F] text-xs font-mono text-[#E8C58C]", children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-[#10B981]" }),
            /* @__PURE__ */ jsx("span", { children: config.customDomain || "Domain pending" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#3A352F] text-xs font-mono text-neutral-300", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-[#10B981]" }),
            /* @__PURE__ */ jsx("span", { children: "Zero Microplastics" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-serif font-bold text-sm text-white uppercase tracking-wider", children: "Biodegradable Plates" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-neutral-400", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("shop"), className: "hover:text-[#E8C58C] transition-colors", children: "Pack of 25 Plates (Trial Kit)" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("shop"), className: "hover:text-[#E8C58C] transition-colors", children: "Pack of 50 Plates (Popular Pack)" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("shop"), className: "hover:text-[#E8C58C] transition-colors", children: "Pack of 100 Plates (Catering Bundle)" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("shop"), className: "hover:text-[#E8C58C] transition-colors", children: "Master Pallet (1,000 Bulk Plates)" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-serif font-bold text-sm text-white uppercase tracking-wider", children: "Mission & Eco" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-neutral-400", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("story"), className: "hover:text-[#E8C58C] transition-colors", children: "Circular Economy Process" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("calculator"), className: "hover:text-[#E8C58C] transition-colors", children: "AI Waste Impact Calculator" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => onNavigate("about"), className: "hover:text-[#E8C58C] transition-colors", children: "Central India Farmer Network" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: onOpenSampleModal, className: "hover:text-[#E8C58C] transition-colors text-[#E8C58C]", children: "Request Free B2B Sample Kit" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-serif font-bold text-sm text-white uppercase tracking-wider", children: "System" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-neutral-400", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: onOpenAdmin, className: "hover:text-[#E8C58C] transition-colors flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-[#10B981]" }),
            /* @__PURE__ */ jsx("span", { children: "Admin & Environment Console" })
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("span", { className: "text-neutral-500 font-mono text-[11px]", children: [
            "Primary: ",
            config.firstAdminEmail
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("span", { className: "text-neutral-500 font-mono text-[11px]", children: [
            "Vercel: ",
            config.clientUrl
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-[#10B981] font-mono text-[11px]", children: "Commit: 295393a" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " BranPlate Tableware. Central India \xB7 Circular Economy \xB7 Zero Landfill."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: scrollToTop,
          className: "p-2 rounded-xl bg-[#2D2A26] hover:bg-[#3D3A35] text-[#E8C58C] transition-colors flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Back to Top" }),
            /* @__PURE__ */ jsx(ArrowUp, { className: "w-3.5 h-3.5" })
          ]
        }
      ) })
    ] })
  ] }) });
};
export {
  Footer
};
