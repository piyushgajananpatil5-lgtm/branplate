import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Globe } from "lucide-react";
const ContactSection = ({ config }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Wholesale & General Inquiry",
    message: ""
  });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: "", email: "", subject: "Wholesale & General Inquiry", message: "" });
    }, 3e3);
  };
  return /* @__PURE__ */ jsx("section", { id: "contact-section", className: "py-20 bg-[#FAF8F5]", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5D5] text-[#C28236] text-xs font-mono font-bold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5" }),
        " Get in Touch"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-serif font-bold text-[#2D2A26]", children: "Partner with BranPlate" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#5A4F3D] leading-relaxed", children: "Whether you are an eco-conscious restaurant owner, wedding planner, retailer, or export partner, our team in Central India is ready to assist with custom sizes, branding, and bulk deliveries." }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-[#C28236]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-[#7A6E5E]", children: "Support & Inquiries Email" }),
            /* @__PURE__ */ jsx("a", { href: `mailto:${config.contactEmail || config.firstAdminEmail}`, className: "text-sm font-bold text-[#2D2A26] hover:underline font-mono", children: config.contactEmail || config.firstAdminEmail })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0", children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-[#10B981]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-[#7A6E5E]", children: "Direct Phone & WhatsApp" }),
            /* @__PURE__ */ jsx("a", { href: `tel:${(config.contactPhone || "+91 98234 56789").replace(/\s+/g, "")}`, className: "text-sm font-bold text-[#2D2A26] hover:underline font-mono", children: config.contactPhone || "+91 98234 56789" }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#8C7A6B]", children: config.contactHours || "Monday \u2013 Saturday: 9:00 AM \u2013 7:00 PM IST" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0", children: /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-[#C28236]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-[#7A6E5E]", children: "Custom Domain & Portal" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-[#2D2A26] font-mono", children: config.customDomain }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-[#8C7A6B]", children: [
              "Hosted at ",
              config.clientUrl
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#EDE5D5] flex items-center justify-center text-[#2D2A26] shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-[#C28236]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-[#7A6E5E]", children: "Manufacturing Facility & Dispatch" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-[#2D2A26]", children: config.contactAddress || "Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India" }),
            config.gstinNumber && /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-mono text-[#8C7A6B] mt-0.5", children: [
              "GSTIN: ",
              config.gstinNumber
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E6DEC8] shadow-lg", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-bold text-[#2D2A26] mb-6", children: "Send Us a Direct Message" }),
      sent ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center space-y-3 bg-[#EBF7EE] rounded-2xl border border-[#A7E3B6]", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-[#10B981] mx-auto" }),
        /* @__PURE__ */ jsx("h4", { className: "font-serif font-bold text-lg text-[#2D2A26]", children: "Message Received" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#5A4F3D]", children: [
          "Our team will reply to ",
          formData.email,
          " within 24 hours."
        ] })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Your Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                placeholder: "e.g. Piyush Patil",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                className: "w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Email Address *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                required: true,
                placeholder: "you@domain.com",
                value: formData.email,
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                className: "w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Subject" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: formData.subject,
              onChange: (e) => setFormData({ ...formData, subject: e.target.value }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] font-medium",
              children: [
                /* @__PURE__ */ jsx("option", { value: "Wholesale & General Inquiry", children: "Wholesale & General Inquiry" }),
                /* @__PURE__ */ jsx("option", { value: "Custom Plate Molding & Branding", children: "Custom Plate Molding & Branding" }),
                /* @__PURE__ */ jsx("option", { value: "Event Catering Bulk Order", children: "Event Catering Bulk Order" }),
                /* @__PURE__ */ jsx("option", { value: "Export & International Shipping", children: "Export & International Shipping" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-[#4A4031] mb-1", children: "Message *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 4,
              required: true,
              placeholder: "Tell us about your event, cafe, or requirements...",
              value: formData.message,
              onChange: (e) => setFormData({ ...formData, message: e.target.value }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-[#D5C6AC] bg-[#FAF8F5] text-xs text-[#2D2A26] focus:ring-2 focus:ring-[#C28236] focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            className: "w-full py-3.5 rounded-xl bg-[#2D2A26] text-[#F9F6F0] font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 text-[#E8C58C]" }),
              /* @__PURE__ */ jsx("span", { children: "Send Message" })
            ]
          }
        )
      ] })
    ] })
  ] }) }) });
};
export {
  ContactSection
};
