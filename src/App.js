import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCatalog } from "./components/ProductCatalog";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CircularStory } from "./components/CircularStory";
import { AiTablewareAdvisor } from "./components/AiTablewareAdvisor";
import { SampleRequestModal } from "./components/SampleRequestModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminPortal } from "./components/AdminPortal";
import { AuthModal } from "./components/AuthModal";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { INITIAL_PRODUCTS, SUSTAINABILITY_METRICS } from "./data/products";
import { apiFetch, saveSession, clearSession } from "./lib/api";
function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState([
    { product: INITIAL_PRODUCTS[0], packSizeIndex: 1, quantity: 1 }
    // Pre-loaded 1 pack of 50 10" Dinner plates
  ]);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromo, setCheckoutPromo] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [config, setConfig] = useState({
    clientUrl: "https://branplate-q6sx.vercel.app",
    customDomain: "",
    firstAdminEmail: "piyushgajananpatil5@gmail.com",
    mongoUri: "",
    brandName: "BranPlate",
    region: "Central India \xB7 Circular Economy \xB7 Zero Landfill",
    contactPhone: "+91 98234 56789",
    contactEmail: "support@branplate.com",
    contactAddress: "Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India",
    contactHours: "Monday \u2013 Saturday: 9:00 AM \u2013 7:00 PM IST",
    gstinNumber: "27AAECB8821P1Z5"
  });
  const [impactStats, setImpactStats] = useState(SUSTAINABILITY_METRICS);
  const fetchProducts = useCallback(() => {
    apiFetch("/api/products").then((res) => res.json()).then((data) => {
      if (data.success && Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
    }).catch(() => {
    });
  }, []);
  const restoreSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("branplate_token");
      if (!token) return;
      const res = await apiFetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthUser(data.user);
        setUserEmail(data.user.email);
        setIsUserAdmin(data.user.type === "admin");
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  }, []);
  useEffect(() => {
    apiFetch("/api/config").then((res) => res.json()).then((data) => {
      if (data.success && data.config) setConfig((prev) => ({ ...prev, ...data.config }));
    }).catch(() => {
    });
    apiFetch("/api/impact").then((res) => res.json()).then((data) => {
      if (data.success && data.impact) setImpactStats(data.impact);
    }).catch(() => {
    });
    fetchProducts();
    restoreSession();
  }, []);
  const handleAddToCart = useCallback((product, packSizeIndex) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.packSizeIndex === packSizeIndex
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, packSizeIndex, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);
  const handleAddBundleToCart = useCallback((bundleItems) => {
    setCartItems((prev) => {
      const updated = [...prev];
      bundleItems.forEach(({ product, packIndex, quantity }) => {
        const existing = updated.find(
          (item) => item.product.id === product.id && item.packSizeIndex === packIndex
        );
        if (existing) {
          existing.quantity += quantity;
        } else {
          updated.push({ product, packSizeIndex: packIndex, quantity });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
  }, []);
  const handleRemoveCartItem = useCallback((index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handleUpdateQuantity = useCallback((index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQuantity;
        return updated;
      });
    }
  }, [handleRemoveCartItem]);
  const handleProceedToCheckout = useCallback((appliedDiscount, promo) => {
    setCheckoutDiscount(appliedDiscount);
    setCheckoutPromo(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const handleOrderSuccess = useCallback((_order) => {
    setCartItems([]);
    apiFetch("/api/impact").then((res) => res.json()).then((data) => {
      if (data.success && data.impact) setImpactStats(data.impact);
    }).catch(() => {
    });
  }, []);
  const scrollToSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(`${sectionId}-section`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const footerActions = useMemo(() => ({
    onNavigate: scrollToSection,
    onOpenSampleModal: () => setIsSampleModalOpen(true),
    onOpenAdmin: () => setIsAdminOpen(true)
  }), [scrollToSection]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#FAF8F5] text-[#2D2A26] flex flex-col font-sans selection:bg-[#E8C58C] selection:text-[#1C1A17]", children: [
    /* @__PURE__ */ jsx(
      Navbar,
      {
        cartItems,
        onOpenCart: () => setIsCartOpen(true),
        onOpenAdmin: () => setIsAdminOpen(true),
        onOpenSampleModal: () => setIsSampleModalOpen(true),
        activeSection,
        onNavigate: scrollToSection,
        config,
        userEmail,
        onOpenAuth: () => setIsAuthOpen(true),
        isUserAdmin
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "flex-grow", children: [
      /* @__PURE__ */ jsx(
        Hero,
        {
          onExplore: () => scrollToSection("shop"),
          onShopClick: () => scrollToSection("shop"),
          onAdvisorClick: () => scrollToSection("ai-advisor"),
          onOpenSampleModal: () => setIsSampleModalOpen(true),
          onSampleClick: () => setIsSampleModalOpen(true),
          impact: impactStats
        }
      ),
      /* @__PURE__ */ jsx(
        ProductCatalog,
        {
          products,
          onAddToCart: handleAddToCart,
          onSelectProduct: (product) => setSelectedProduct(product)
        }
      ),
      /* @__PURE__ */ jsx(
        CircularStory,
        {
          impact: impactStats,
          onExploreProducts: () => scrollToSection("shop")
        }
      ),
      /* @__PURE__ */ jsx(
        AiTablewareAdvisor,
        {
          onAddBundleToCart: handleAddBundleToCart,
          products
        }
      ),
      /* @__PURE__ */ jsx(
        AboutSection,
        {
          onOpenSampleModal: () => setIsSampleModalOpen(true)
        }
      ),
      /* @__PURE__ */ jsx(
        ContactSection,
        {
          config
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Footer,
      {
        config,
        ...footerActions
      }
    ),
    /* @__PURE__ */ jsxs("a", {
      href: "https://wa.me/919039220991?text=Hello%20BranEco%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products.",
      target: "_blank",
      rel: "noreferrer",
      "aria-label": "Chat with BranEco on WhatsApp",
      className: "fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#188B45] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#188B45]/25 transition hover:-translate-y-1 hover:bg-[#116C35]",
      children: [
        /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children: "WhatsApp us" })
      ]
    }),
    /* @__PURE__ */ jsx(
      ProductDetailModal,
      {
        product: selectedProduct,
        onClose: () => setSelectedProduct(null),
        onAddToCart: handleAddToCart
      }
    ),
    /* @__PURE__ */ jsx(
      CartDrawer,
      {
        isOpen: isCartOpen,
        onClose: () => setIsCartOpen(false),
        cartItems,
        onUpdateQuantity: handleUpdateQuantity,
        onRemoveItem: handleRemoveCartItem,
        onProceedToCheckout: handleProceedToCheckout
      }
    ),
    /* @__PURE__ */ jsx(
      CheckoutModal,
      {
        isOpen: isCheckoutOpen,
        onClose: () => setIsCheckoutOpen(false),
        cartItems,
        discountAmount: checkoutDiscount,
        promoCode: checkoutPromo,
        onOrderSuccess: handleOrderSuccess,
        currentUserEmail: userEmail,
        onAutoLogin: (token, user) => {
          saveSession(token, user);
          setAuthUser(user);
          setUserEmail(user.email);
          setIsUserAdmin(user.type === "admin");
        }
      }
    ),
    /* @__PURE__ */ jsx(
      SampleRequestModal,
      {
        isOpen: isSampleModalOpen,
        onClose: () => setIsSampleModalOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      AdminPortal,
      {
        isOpen: isAdminOpen,
        onClose: () => setIsAdminOpen(false),
        config,
        onUpdateConfig: (newConf) => setConfig((prev) => ({ ...prev, ...newConf })),
        impact: impactStats,
        currentUserEmail: userEmail,
        onAdminsUpdated: () => {
        },
        onProductsUpdated: fetchProducts
      }
    ),
    /* @__PURE__ */ jsx(
      AuthModal,
      {
        isOpen: isAuthOpen,
        onClose: () => setIsAuthOpen(false),
        currentUserEmail: userEmail,
        onLogin: (user) => {
          setAuthUser(user);
          setUserEmail(user.email);
          setIsUserAdmin(user.type === "admin");
        },
        onLogout: () => {
          clearSession();
          setAuthUser(null);
          setUserEmail(null);
          setIsUserAdmin(false);
        },
        config
      }
    )
  ] });
}
export {
  App as default
};
