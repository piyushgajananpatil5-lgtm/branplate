import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Star, ShoppingBag, Check, Sprout } from "lucide-react";
const ProductDetailModal = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isAdded, setIsAdded] = useState(false);
  const activePack = product.packSizes[selectedPackIdx] || product.packSizes[0];
  const handleAdd = () => {
    onAddToCart(product, selectedPackIdx);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };
  const images = [product.image, ...product.secondaryImages];
  return /* @__PURE__ */ jsx("div", { id: "product-detail-backdrop", className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs(
    "div",
    {
      id: "product-detail-modal",
      className: "bg-[#FAF8F5] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D5C6AC] relative flex flex-col my-auto",
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "close-product-modal-btn",
            onClick: onClose,
            className: "absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-md",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E6DEC8] shadow-inner relative flex items-center justify-center p-6", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: selectedImage,
                  alt: product.name,
                  className: "w-full h-full object-contain drop-shadow-lg",
                  referrerPolicy: "no-referrer"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 bg-[#2D2A26]/80 text-[#E8C58C] text-xs font-mono px-3 py-1 rounded-md backdrop-blur-sm", children: product.diameterOrSize })
            ] }),
            images.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex gap-3 overflow-x-auto pb-1", children: images.map((img, i) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedImage(img),
                className: `w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? "border-[#C28236] scale-105 shadow-md" : "border-[#E6DEC8] opacity-70 hover:opacity-100"}`,
                children: /* @__PURE__ */ jsx("img", { src: img, alt: "Thumbnail", className: "w-full h-full object-cover", referrerPolicy: "no-referrer" })
              },
              i
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-[#EDE5D5] border border-[#D5C6AC] text-xs space-y-2 text-[#4A4031]", children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold flex items-center gap-1.5 text-[#2D2A26]", children: [
                /* @__PURE__ */ jsx(Sprout, { className: "w-4 h-4 text-[#10B981]" }),
                " 100% Soil Return Guarantee"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "Made strictly with wheat bran and water steam compression. When finished, bury it in your garden soil or compost heap. Disintegrates into organic manure within 30 days!" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 flex flex-col justify-between space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-[#C28236] font-semibold uppercase tracking-wider mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: product.category }),
                /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                /* @__PURE__ */ jsx("span", { className: "text-[#10B981]", children: "Central India Certified" })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] leading-tight", children: product.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex text-[#C28236]", children: [...Array(5)].map((_, idx) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-current" }, idx)) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[#2D2A26]", children: product.rating }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#8C7A6B]", children: [
                  "(",
                  product.reviewsCount,
                  " verified reviews)"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#5A4F3D] mt-3 leading-relaxed", children: product.description }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-2 text-xs border-y border-[#E6DEC8] py-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1 border-b border-[#F2ECE1]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#7A6E5E]", children: "Thermal Range:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-[#2D2A26]", children: product.heatResistance })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1 border-b border-[#F2ECE1]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#7A6E5E]", children: "Materials:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-[#2D2A26]", children: product.materials })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1 border-b border-[#F2ECE1]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#7A6E5E]", children: "Dimensions & Weight:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-[#2D2A26]", children: product.dimensions })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#7A6E5E]", children: "Shelf Life:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-[#2D2A26]", children: product.shelfLife })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[#2D2A26] block mb-2", children: "Ideal For:" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: product.suitableFor.map((item, idx) => /* @__PURE__ */ jsx("span", { className: "text-[11px] bg-[#EDE5D5] text-[#4A4031] px-2.5 py-1 rounded-md", children: item }, idx)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-[#E6DEC8]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#2D2A26]", children: "Choose Pack Option:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-[#C28236] font-bold", children: [
                  "$",
                  activePack.unitPrice.toFixed(2),
                  " / unit"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: product.packSizes.map((pack, idx) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelectedPackIdx(idx),
                  className: `p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col justify-between ${selectedPackIdx === idx ? "border-[#2D2A26] bg-[#2D2A26] text-[#E8C58C] shadow-md" : "border-[#D5C6AC] bg-white text-[#4A4031] hover:bg-[#F2ECE1]"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: pack.label }),
                    /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm mt-1", children: [
                      "$",
                      pack.price.toFixed(2)
                    ] })
                  ]
                },
                idx
              )) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 pt-2", children: /* @__PURE__ */ jsx(
                "button",
                {
                  id: "modal-add-to-cart-btn",
                  onClick: handleAdd,
                  className: `flex-1 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${isAdded ? "bg-[#10B981] text-white" : "bg-[#2D2A26] text-[#F9F6F0] hover:bg-black"}`,
                  children: isAdded ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Added to Your Order!" })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4 text-[#E8C58C]" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Add ",
                      activePack.label,
                      " \u2014 $",
                      activePack.price.toFixed(2)
                    ] })
                  ] })
                }
              ) })
            ] })
          ] })
        ] })
      ]
    }
  ) });
};
export {
  ProductDetailModal
};
