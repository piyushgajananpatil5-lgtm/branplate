import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sprout, Tag } from "lucide-react";
const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  const subtotal = cartItems.reduce((acc, item) => {
    const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
    return acc + pack.price * item.quantity;
  }, 0);
  const totalPieces = cartItems.reduce((acc, item) => {
    const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
    return acc + pack.size * item.quantity;
  }, 0);
  const discountAmount = subtotal * discountPercent / 100;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 7.5;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + shipping + estimatedTax;
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (code === "CENTRALINDIA") {
      setDiscountPercent(15);
      setAppliedPromo("CENTRALINDIA (15% Off)");
      setPromoInput("");
    } else if (code === "EARTH10" || code === "THELEGEND5") {
      setDiscountPercent(10);
      setAppliedPromo(`${code} (10% Off)`);
      setPromoInput("");
    } else {
      setPromoError('Invalid coupon code. Try "CENTRALINDIA" or "THELEGEND5"');
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { id: "cart-drawer-backdrop", className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end", children: /* @__PURE__ */ jsxs(
    "div",
    {
      id: "cart-drawer-panel",
      className: "w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#D5C6AC] animate-in slide-in-from-right duration-300",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-[#E6DEC8] flex items-center justify-between bg-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5 text-[#C28236]" }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-lg text-[#2D2A26]", children: "Your Biodegradable Plates Order" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs bg-[#EDE5D5] text-[#5A4F3D] px-2 py-0.5 rounded-full font-mono font-bold", children: cartItems.reduce((sum, item) => sum + item.quantity, 0) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              id: "close-cart-btn",
              onClick: onClose,
              className: "p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#2D2A26] transition-colors",
              children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
            }
          )
        ] }),
        totalPieces > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-[#2D2A26] text-white text-xs px-4 py-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[#E8C58C]", children: [
            /* @__PURE__ */ jsx(Sprout, { className: "w-3.5 h-3.5 text-[#10B981]" }),
            "Plastic Displaced: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              totalPieces,
              " plates & pieces"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#10B981] font-mono text-[11px]", children: [
            "~",
            (totalPieces * 0.05).toFixed(1),
            "kg Bran"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: cartItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center space-y-3 p-6 text-[#7A6E5E]", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-[#EDE5D5] flex items-center justify-center text-[#9E9080]", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-serif font-semibold text-base text-[#2D2A26]", children: "Your cart is empty" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Browse our Central India wheat bran tableware collection to start dining sustainably." })
        ] }) : cartItems.map((item, idx) => {
          const pack = item.product.packSizes[item.packSizeIndex] || item.product.packSizes[0];
          const itemTotal = pack.price * item.quantity;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              id: `cart-item-${idx}`,
              className: "bg-white p-3.5 rounded-2xl border border-[#E6DEC8] shadow-sm flex gap-3",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.product.image,
                    alt: item.product.name,
                    className: "w-16 h-16 rounded-xl object-contain p-1 bg-white border border-[#E6DEC8] shrink-0",
                    referrerPolicy: "no-referrer"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold font-serif text-[#2D2A26] line-clamp-1", children: item.product.name }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => onRemoveItem(idx),
                          className: "text-[#9E9080] hover:text-red-600 transition-colors p-1",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#C28236] font-medium", children: pack.label })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2 pt-1 border-t border-[#F4EFE6]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-[#D5C6AC] rounded-lg bg-[#FAF8F5]", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => onUpdateQuantity(idx, item.quantity - 1),
                          className: "p-1 hover:bg-[#EBE3D3] text-[#4A4031] rounded-l-lg",
                          children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "px-2 text-xs font-mono font-bold text-[#2D2A26]", children: item.quantity }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => onUpdateQuantity(idx, item.quantity + 1),
                          className: "p-1 hover:bg-[#EBE3D3] text-[#4A4031] rounded-r-lg",
                          children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxs("div", { className: "font-serif font-bold text-xs text-[#2D2A26]", children: [
                        "$",
                        itemTotal.toFixed(2)
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-[#8C7A6B]", children: [
                        "$",
                        pack.unitPrice.toFixed(2),
                        "/pc"
                      ] })
                    ] })
                  ] })
                ] })
              ]
            },
            `${item.product.id}-${item.packSizeIndex}`
          );
        }) }),
        cartItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border-t border-[#E6DEC8] space-y-3", children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: handleApplyPromo, className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-[#9E9080] absolute left-3 top-2.5" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Code: CENTRALINDIA or THELEGEND5",
                  value: promoInput,
                  onChange: (e) => setPromoInput(e.target.value),
                  className: "w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#D5C6AC] text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#C28236]"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "px-3 py-1.5 rounded-lg bg-[#EDE5D5] text-[#2D2A26] text-xs font-bold hover:bg-[#E2D6C0]",
                children: "Apply"
              }
            )
          ] }),
          appliedPromo && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-[#10B981] font-semibold flex items-center justify-between bg-[#EBF7EE] px-2.5 py-1 rounded", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Code Applied: ",
              appliedPromo
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setDiscountPercent(0);
              setAppliedPromo("");
            }, className: "text-red-500 underline text-[10px]", children: "Remove" })
          ] }),
          promoError && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-red-500 font-medium", children: promoError }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs text-[#5A4F3D] border-t border-[#F2ECE1] pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono font-medium", children: [
                "$",
                subtotal.toFixed(2)
              ] })
            ] }),
            discountAmount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[#10B981] font-medium", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Discount (",
                discountPercent,
                "%):"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
                "-$",
                discountAmount.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Eco Shipping:" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono", children: shipping === 0 ? /* @__PURE__ */ jsx("span", { className: "text-[#10B981] font-bold", children: "FREE" }) : `$${shipping.toFixed(2)}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Estimated Tax (5%):" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
                "$",
                estimatedTax.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-bold text-[#2D2A26] pt-1.5 border-t border-[#E6DEC8]", children: [
              /* @__PURE__ */ jsx("span", { children: "Total:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-[#C28236]", children: [
                "$",
                total.toFixed(2)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              id: "proceed-checkout-btn",
              onClick: () => onProceedToCheckout(discountAmount, appliedPromo),
              className: "w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Proceed to Fast Checkout" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[#E8C58C]" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-center text-[10px] text-[#8C7A6B]", children: "Dispatched directly from Central India Hub \xB7 Zero-Plastic packaging" })
        ] })
      ]
    }
  ) });
};
export {
  CartDrawer
};
