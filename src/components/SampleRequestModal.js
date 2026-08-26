import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Sparkles, CheckCircle2, PackageCheck, Send, Building2, MapPin, Mail, Phone, User } from "lucide-react";
const SampleRequestModal = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    businessType: "restaurant",
    estimatedMonthlyVolume: "1,000 - 5,000 plates/mo",
    shippingAddress: "",
    interestedProducts: ['10" Heavy-Duty Biodegradable Plate (Sample Pack of 5)'],
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const productOptions = [
    '10" Heavy-Duty Biodegradable Plate (Sample Pack of 5)',
    '10" Biodegradable Plate \u2014 Hot Curry & Gravy Test Pack',
    "Commercial Wholesale Sample Crate (Export / B2B Grade)"
  ];
  const toggleProduct = (item) => {
    setFormData((prev) => {
      const exists = prev.interestedProducts.includes(item);
      return {
        ...prev,
        interestedProducts: exists ? prev.interestedProducts.filter((p) => p !== item) : [...prev.interestedProducts, item]
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting sample inquiry:", err);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { id: "sample-modal-backdrop", className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs(
    "div",
    {
      id: "sample-request-modal",
      className: "bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D5C6AC] relative my-auto",
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "close-sample-modal-btn",
            onClick: onClose,
            className: "absolute top-4 right-4 p-2 rounded-full bg-white text-[#2D2A26] hover:bg-black hover:text-white transition-all shadow-sm",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-[#EBF7EE] text-[#10B981] mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsx(PackageCheck, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif font-bold text-[#2D2A26]", children: "Sample Box Dispatch Scheduled!" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#5A4F3D] max-w-md mx-auto leading-relaxed", children: [
            "Thank you, ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#2D2A26]", children: formData.name }),
            ". Our Central India dispatch center has logged your sample kit request for ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#2D2A26]", children: formData.businessName }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[#EDE5D5] rounded-2xl text-xs text-[#4A4031] max-w-md mx-auto text-left space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Selected Products:" }),
              " ",
              (formData.interestedProducts || []).join(", ")
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Dispatch Hub:" }),
              " Central India Agro Cluster, Nagpur"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Delivery Target:" }),
              " 2-3 Business Days"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "mt-4 px-8 py-3 rounded-full bg-[#2D2A26] text-white text-xs font-bold hover:bg-black transition-all",
              children: "Done & Return to Store"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono font-bold text-[#C28236] uppercase tracking-wider mb-1", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
            " B2B & Commercial Samples"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]", children: "Request Free BranPlate Sample Box" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-[#6B5E4F] mt-1 mb-6", children: "Test our plates with your hottest gravies, soups, ovens, and catering dishes. Free kit for verified businesses and event organizers." }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Your Full Name *" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      placeholder: "e.g. Piyush Patil",
                      value: formData.name,
                      onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                      className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Business / Event Name *" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      placeholder: "e.g. Green Leaf Cafe / Wedding Gala",
                      value: formData.businessName,
                      onChange: (e) => setFormData({ ...formData, businessName: e.target.value }),
                      className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Business Email *" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      required: true,
                      placeholder: "name@business.com",
                      value: formData.email,
                      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                      className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Phone / WhatsApp Number" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "tel",
                      placeholder: "+91 98234 56789",
                      value: formData.phone,
                      onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                      className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Business Category" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.businessType,
                    onChange: (e) => setFormData({ ...formData, businessType: e.target.value }),
                    className: "w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] font-medium",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "restaurant", children: "Restaurant / Cloud Kitchen" }),
                      /* @__PURE__ */ jsx("option", { value: "catering", children: "Catering Company" }),
                      /* @__PURE__ */ jsx("option", { value: "events", children: "Event & Wedding Management" }),
                      /* @__PURE__ */ jsx("option", { value: "hotel", children: "Hotel / Eco Resort" }),
                      /* @__PURE__ */ jsx("option", { value: "retailer", children: "Retailer / Supermarket" }),
                      /* @__PURE__ */ jsx("option", { value: "export", children: "Export & Global Distribution" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Estimated Monthly Requirement" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.estimatedMonthlyVolume,
                    onChange: (e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value }),
                    className: "w-full px-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] font-medium",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "500 - 1,000 units", children: "500 - 1,000 units / month" }),
                      /* @__PURE__ */ jsx("option", { value: "1,000 - 5,000 units", children: "1,000 - 5,000 units / month" }),
                      /* @__PURE__ */ jsx("option", { value: "5,000 - 20,000 units", children: "5,000 - 20,000 units / month" }),
                      /* @__PURE__ */ jsx("option", { value: "20,000+ units", children: "20,000+ units (Wholesale Pallets)" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Physical Shipping Destination Address *" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-[#9E9080] absolute left-3 top-3" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    placeholder: "Street, Building, City, State, Pincode / Postal Code",
                    value: formData.shippingAddress,
                    onChange: (e) => setFormData({ ...formData, shippingAddress: e.target.value }),
                    className: "w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5C6AC] bg-white text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1.5", children: "Include in Sample Kit:" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: productOptions.map((item, idx) => {
                const isSelected = formData.interestedProducts.includes(item);
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleProduct(item),
                    className: `p-2 rounded-xl text-left text-[11px] font-medium transition-all flex items-center gap-2 border ${isSelected ? "bg-[#2D2A26] text-[#E8C58C] border-[#2D2A26]" : "bg-white text-[#4A4031] border-[#D5C6AC] hover:bg-[#F2ECE1]"}`,
                    children: [
                      /* @__PURE__ */ jsx("div", { className: `w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${isSelected ? "bg-[#10B981] text-white" : "border border-[#9E9080]"}`, children: isSelected && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 fill-current" }) }),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: item })
                    ]
                  },
                  idx
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-xs sm:text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 text-[#E8C58C]" }),
                  /* @__PURE__ */ jsx("span", { children: loading ? "Submitting Request..." : "Dispatch Free Sample Box" })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
};
export {
  SampleRequestModal
};
