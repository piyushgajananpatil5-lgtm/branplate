import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ShoppingBag, Star, Eye, Check, ShieldCheck, Flame, Layers, Sprout, CheckCircle2, PackageCheck } from "lucide-react";
const ProductCatalog = ({
  products,
  onAddToCart,
  onSelectProduct
}) => {
  const [activeProductId, setActiveProductId] = useState(products[0]?.id || "bp-plate-100bio");
  const [selectedPackIndex, setSelectedPackIndex] = useState({});
  const [addedAnimation, setAddedAnimation] = useState({});
  const currentProduct = products.find((p) => p.id === activeProductId) || products[0];
  const handlePackChange = (productId, packIndex) => {
    setSelectedPackIndex((prev) => ({ ...prev, [productId]: packIndex }));
  };
  const handleAddWithFeedback = (prod, pIndex) => {
    const packIndex = pIndex !== void 0 ? pIndex : selectedPackIndex[prod.id] || 0;
    onAddToCart(prod, packIndex);
    setAddedAnimation((prev) => ({ ...prev, [`${prod.id}-${packIndex}`]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [`${prod.id}-${packIndex}`]: false }));
    }, 1200);
  };
  if (!currentProduct) return null;
  const currentPackIndex = selectedPackIndex[currentProduct.id] || 0;
  const currentPack = currentProduct.packSizes[currentPackIndex] || currentProduct.packSizes[0] || { price: currentProduct.price, label: "Standard Pack", size: 25, unitPrice: currentProduct.price / 25 };
  return /* @__PURE__ */ jsx("section", { id: "shop-section", className: "py-20 bg-[#173F35] text-[#F9F1DF]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-xs uppercase font-mono font-bold tracking-widest text-[#173F35] mb-2 px-3 py-1 bg-[#E8A83E] rounded-full", children: [
        /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }),
        " 100% Certified Biodegradable Tableware"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-5xl sm:text-7xl font-serif font-bold text-[#F9F1DF] leading-[.9]", children: "CHOOSE YOUR STACK" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#D8E0D2] text-sm sm:text-base mt-3", children: "Engineered from natural upcycled plant fibers in Central India. Grease-proof, oven-safe to 180\xB0C, and completely compostable in soil in 30 days." })
    ] }),
    products.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-3 mb-8 overflow-x-auto pb-2", children: products.map((prod) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveProductId(prod.id),
        className: `px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${activeProductId === prod.id ? "bg-[#2D2A26] text-[#E8C58C] border-[#2D2A26] shadow-md" : "bg-white text-[#5A4F3D] border-[#D5C6AC] hover:bg-[#EDE5D5]"}`,
        children: [
          /* @__PURE__ */ jsx(PackageCheck, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: prod.name }),
          /* @__PURE__ */ jsxs("span", { className: "font-mono text-[11px] opacity-80", children: [
            "$",
            prod.price.toFixed(2)
          ] })
        ]
      },
      prod.id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#F9F1DF] rounded-[2rem] border-4 border-[#E8A83E] shadow-[12px_12px_0_#E8A83E] overflow-hidden mb-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 p-8 sm:p-12 bg-[#E8A83E] flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r-4 border-[#173F35]", children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-full max-w-md aspect-square flex items-center justify-center p-4", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: currentProduct.image,
            alt: currentProduct.name,
            className: "w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer mix-blend-multiply",
            onClick: () => onSelectProduct(currentProduct),
            referrerPolicy: "no-referrer"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-6 left-6 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-[#2D2A26] text-[#E8C58C] text-xs font-mono font-bold px-3 py-1 rounded-full shadow", children: currentProduct.diameterOrSize || '10" Round' }),
          /* @__PURE__ */ jsxs("span", { className: "bg-[#EBF7EE] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-[#BDE8C6]", children: [
            /* @__PURE__ */ jsx(Sprout, { className: "w-3.5 h-3.5" }),
            " 30-Day Backyard Compost"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: `spotlight-view-${currentProduct.id}`,
            onClick: () => onSelectProduct(currentProduct),
            className: "mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#5A4F3D] hover:text-[#C28236] transition-colors",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
              " View Technical Specifications & Certifications"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-[#173F35]", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs mb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center text-[#C28236] font-semibold", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-current mr-1" }),
            /* @__PURE__ */ jsx("span", { children: currentProduct.rating }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#8C7A6B] ml-1", children: [
              "(",
              currentProduct.reviewsCount,
              " verified customer reviews)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-[#10B981] font-bold bg-[#EBF7EE] px-2.5 py-0.5 rounded-md", children: currentProduct.inStock ? `In Stock (${(currentProduct.stockCount || 1e4).toLocaleString()} units)` : "Out of Stock" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl sm:text-6xl font-serif font-bold text-[#173F35] leading-[.9]", children: currentProduct.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-[#6B5E4F] mt-2 leading-relaxed", children: currentProduct.tagline }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[#8C7A6B] text-[10px] uppercase font-semibold", children: "Thermal Rating" }),
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-[#2D2A26] mt-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5 text-[#C28236]" }),
              " -20\xB0C to +180\xB0C"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[#8C7A6B] text-[10px] uppercase font-semibold", children: "Composition" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-[#2D2A26] mt-0.5", children: "100% Agro Residue" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-[#FAF8F5] rounded-xl border border-[#E6DEC8] text-xs col-span-2 sm:col-span-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[#8C7A6B] text-[10px] uppercase font-semibold", children: "Certifications" }),
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-[#10B981] mt-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
              " ISO & Compost OK"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-[#4A4031] mb-2.5", children: [
            /* @__PURE__ */ jsx("span", { children: "Select Pack Format & Pricing:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#C28236] font-mono font-bold", children: [
              "Tier: ",
              currentPack.label
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: currentProduct.packSizes.map((pack, idx) => {
            const isSelected = currentPackIndex === idx;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => handlePackChange(currentProduct.id, idx),
                className: `p-3 rounded-2xl text-left border transition-all ${isSelected ? "bg-[#2D2A26] text-white border-[#2D2A26] shadow-md ring-2 ring-[#C28236]" : "bg-[#FAF8F5] text-[#2D2A26] border-[#D5C6AC] hover:bg-[#F2ECE1]"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-xs", children: pack.label }),
                    isSelected && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#E8C58C]" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsxs("span", { className: `font-mono font-bold text-sm ${isSelected ? "text-white" : "text-[#2D2A26]"}`, children: [
                      "$",
                      pack.price.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-mono ${isSelected ? "text-neutral-300" : "text-[#7A6E5E]"}`, children: [
                      "$",
                      pack.unitPrice.toFixed(2),
                      "/pc"
                    ] })
                  ] })
                ]
              },
              idx
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 flex flex-col sm:flex-row items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              id: `hero-add-to-cart-${currentProduct.id}`,
              onClick: () => handleAddWithFeedback(currentProduct, currentPackIndex),
              className: `w-full sm:flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${addedAnimation[`${currentProduct.id}-${currentPackIndex}`] ? "bg-[#10B981] text-white" : "bg-[#2D2A26] text-[#F9F6F0] hover:bg-black"}`,
              children: addedAnimation[`${currentProduct.id}-${currentPackIndex}`] ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-white" }),
                /* @__PURE__ */ jsx("span", { children: "Added to Cart!" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4 text-[#E8C58C]" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Add ",
                  currentPack.label,
                  " \u2014 $",
                  currentPack.price.toFixed(2)
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              id: "view-specs-btn",
              onClick: () => onSelectProduct(currentProduct),
              className: "w-full sm:w-auto py-4 px-5 rounded-xl border border-[#D5C6AC] bg-white text-[#2D2A26] font-semibold text-xs hover:bg-[#FAF8F5] transition-all",
              children: "Full Plate Specs"
            }
          )
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxs("h4", { className: "font-serif font-bold text-xl text-[#2D2A26] mb-4", children: [
        "All Available Packaging Formats & Bulk Tiers \u2014 ",
        currentProduct.name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#E6DEC8] text-xs font-mono uppercase text-[#7A6E5E]", children: [
          /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: "Packaging Tier" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: "Plate Count" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: "Unit Price" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold", children: "Total Price" }),
          /* @__PURE__ */ jsx("th", { className: "pb-3 font-semibold text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#F2ECE1]", children: currentProduct.packSizes.map((pack, idx) => {
          const isAdded = addedAnimation[`${currentProduct.id}-${idx}`];
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[#FAF8F5] transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-4 font-semibold text-[#2D2A26]", children: pack.label }),
            /* @__PURE__ */ jsxs("td", { className: "py-4 font-mono text-[#5A4F3D]", children: [
              pack.size,
              " plates"
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-4 font-mono text-[#C28236] font-bold", children: [
              "$",
              pack.unitPrice.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-4 font-mono font-bold text-[#2D2A26]", children: [
              "$",
              pack.price.toFixed(2)
            ] }),
            /* @__PURE__ */ jsx("td", { className: "py-4 text-right", children: /* @__PURE__ */ jsx(
              "button",
              {
                id: `table-add-pack-${idx}`,
                onClick: () => handleAddWithFeedback(currentProduct, idx),
                className: `px-4 py-2 rounded-lg text-xs font-semibold transition-all ${isAdded ? "bg-[#10B981] text-white" : "bg-[#2D2A26] text-white hover:bg-black"}`,
                children: isAdded ? "Added!" : "Add to Cart"
              }
            ) })
          ] }, idx);
        }) })
      ] }) })
    ] })
  ] }) });
};
export {
  ProductCatalog
};
