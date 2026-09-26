import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, ChevronDown, Download, Leaf, Menu, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, Sprout, Truck, X } from "lucide-react";
import api from "./api/axios";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { BRANNECO_GROUPS } from "./catalogue-data";

const currencies = {
  INR: { symbol: "₹", label: "INR · India", rate: 1 },
  USD: { symbol: "$", label: "USD · Export", rate: 1 },
  EUR: { symbol: "€", label: "EUR · Export", rate: .92 },
  GBP: { symbol: "£", label: "GBP · Export", rate: .79 },
  AED: { symbol: "د.إ", label: "AED · Export", rate: 3.67 }
};
const formatPrice = (value, currency) => `${currencies[currency].symbol}${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: currency === "INR" ? 2 : value < .1 ? 3 : 2, maximumFractionDigits: currency === "INR" ? 2 : value < .1 ? 3 : 2 })}`;
const productImages = (product) => [...new Set([...(product.images || []), product.image, ...(product.secondaryImages || [])].filter((image) => typeof image === "string" && image.trim()))];
const imageFallback = (product) => product.material?.toLowerCase().includes("areca") ? "/plate.svg" : "/plate.svg";

function ProductImages({ product, compact = false }) {
  const images = productImages(product);
  if (!images.length) return <div className={compact ? "product-image-fallback is-compact" : "product-image-fallback"} aria-label={`${product.name} image unavailable`}><Leaf size={compact ? 16 : 24} /><span>{product.material || "BrannEco"}</span></div>;
  return <div className={compact ? "product-image-list is-compact" : "product-image-list"} aria-label={`${images.length} product images`}>
    {images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${product.name} view ${index + 1}`} loading={compact ? "lazy" : "eager"} decoding="async" onError={(event) => { event.currentTarget.src = imageFallback(product); }} />)}
  </div>;
}

export default function BrannEco() {
  const { cart, addToCart, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState(() => localStorage.getItem("branneco-currency") || "INR");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");
  const money = currencies[currency] || currencies.INR;

  useEffect(() => {
    let cancelled = false;
    api.get("/products").then(({ data }) => {
      if (!cancelled) setProducts((data.products || []).filter((product) => product.sku));
    }).catch(() => {
      if (!cancelled) setLoadError("Catalogue is temporarily unavailable. Please try again shortly.");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredGroups = useMemo(() => BRANNECO_GROUPS.map((group) => ({
    ...group,
    products: products.filter((product) => product.category === group.id && `${product.sku} ${product.name} ${product.diameterOrSize} ${product.material}`.toLowerCase().includes(query.trim().toLowerCase()))
  })).filter((group) => group.products.length), [products, query]);
  const cartTotal = cart.reduce((sum, item) => sum + priceFor(item) * item.quantity, 0);
  const cartLines = cart.filter((item) => item.sku);

  function priceFor(product) {
    if (currency === "INR") return Number(product.price || 0);
    return Number(product.exportPrice || product.price / 83) * money.rate;
  }
  function changeCurrency(value) {
    setCurrency(value);
    localStorage.setItem("branneco-currency", value);
  }
  function addProduct(product) {
    addToCart({ ...product, name: product.name, price: product.price, sku: product.sku, packLabel: "Per piece" });
    setCartOpen(true);
    setToast(`${product.sku} added to cart`);
  }
  function openWhatsAppQuote() {
    const lines = cartLines.map((product) => `${product.sku} ${product.name} × ${product.quantity}`).join("\n");
    const text = `Hello BrannEco, please share an export quote in ${currency}.\n\n${lines || "Please share your product catalogue."}\n\nPlease advise FOB and CIF pricing.`;
    window.open(`https://wa.me/919039220991?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }
  function downloadCatalogue() {
    const rows = ["SKU,Product,Size,Indicative INR,Export USD,Material", ...products.map((product) => [product.sku, `"${product.name}"`, `"${product.diameterOrSize || ""}"`, product.price, product.exportPrice || "", `"${product.material || ""}"`].join(","))];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    link.download = "branneco-product-catalogue.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function setLineQuantity(product, quantity) {
    if (quantity < 1) removeFromCart(product._id);
    else updateQuantity(product._id, quantity);
  }

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const nav = [["#categories", "Categories"], ["#catalogue", "Catalogue"], ["#export", "Export"], ["#about", "About"]];

  return <div className="eco-site">
    <div className="announcement"><span>Plastic-free tableware, made in India</span><span>Export enquiries · FOB / CIF worldwide</span></div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="BrannEco home"><span className="brand-icon"><Sprout size={20} /></span><span>brann<span>eco</span><small>TABLEWARE · INDIA</small></span></a>
      <nav className={mobileMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{nav.map(([href, label]) => <a href={href} key={href} onClick={() => setMobileMenuOpen(false)}>{label}</a>)}<Link to="/signup" onClick={() => setMobileMenuOpen(false)}>{user ? "Account" : "Sign up"}</Link><Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>Admin</Link></nav>
      <div className="header-actions">
        <label className="currency-control"><span>{money.symbol}</span><select value={currency} onChange={(event) => changeCurrency(event.target.value)} aria-label="Display currency">{Object.entries(currencies).map(([code, info]) => <option key={code} value={code}>{info.label}</option>)}</select><ChevronDown size={13} /></label>
        <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${itemCount} items`}><ShoppingBag size={17} /><span>Cart</span><b>{itemCount}</b></button>
        <button className="mobile-toggle" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span /> RESPONSIBLY MADE · READY TO SHIP</p><h1>Plastic-free<br /><i>tableware,</i><br />shipped worldwide.</h1><p className="hero-lede">Thoughtful everyday essentials, made from fallen leaves, crop byproducts and responsibly sourced paper.</p><div className="hero-actions"><a className="button button-gold" href="#catalogue">Explore the catalogue <ArrowRight size={16} /></a><button className="button button-quiet" onClick={openWhatsAppQuote}>Request export quote <ArrowDown size={15} /></button></div><div className="hero-meta"><span><ShieldCheck size={16} /> Food-grade materials</span><span><Truck size={17} /> Trial carton to container</span></div></div>
        <div className="hero-still"><img src="/plate.svg" alt="Embossed plate made from plant fiber" /><div className="still-caption"><Leaf size={15} /><span>Made for the meal.<br /><b>Gentler on what comes after.</b></span></div><span className="still-index">01 / 06 · ARECA LEAF</span></div><div className="hero-aside">INDIA <span>·</span> 21°08′ N</div>
      </section>

      <div className="trust-strip"><span><Check size={15} /> Food-grade & biodegradable</span><span><PackageCheck size={16} /> Flexible order volumes</span><span><Truck size={16} /> FOB / CIF export terms</span><span><Sprout size={16} /> Custom moulds available</span></div>

      <section className="category-section section-shell" id="categories"><div className="section-heading"><div><p className="eyebrow">FIND YOUR MATERIAL</p><h2>Made from what<br />nature leaves behind.</h2></div><p>Six thoughtful ranges. One lighter footprint.<br />Explore the material that works for you.</p></div><div className="category-grid">{BRANNECO_GROUPS.filter((group) => group.id !== "areca-mixed").map((group, index) => <a href={`#${group.id}`} className={`category-tile category-${index}`} key={group.id}><span className="tile-number">0{index + 1}</span><span className="tile-bottom"><span><small>{group.material.toUpperCase()}</small><b>{group.id === "areca-round" ? "Areca leaf" : group.title.replace(" tableware", "")}</b></span><ArrowRight size={19} /></span></a>)}<a href="#contact" className="category-tile category-custom"><span className="tile-number">06</span><span className="tile-bottom"><span><small>MADE TO ORDER</small><b>Custom moulds</b></span><ArrowRight size={19} /></span></a></div></section>

      <section className="catalogue-section" id="catalogue"><div className="section-shell"><div className="catalogue-title"><div><p className="eyebrow">SPECIFICATIONS AT A GLANCE</p><h2>The product catalogue</h2><p>Indicative per-piece prices · final quotes depend on order volume and destination.</p></div><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SKU or product" aria-label="Search SKU or product" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={15} /></button>}</label></div><div className="catalogue-tools"><span>{loading ? "Loading catalogue…" : `${filteredGroups.reduce((sum, group) => sum + group.products.length, 0)} SKUs · prices in ${currency}`} <span className="tool-dot">·</span> live from catalogue</span><button onClick={downloadCatalogue} disabled={loading || !products.length}><Download size={15} /> Download catalogue CSV</button></div>
        {loadError && <div className="catalogue-error" role="alert">{loadError} <button onClick={() => window.location.reload()}>Retry</button></div>}
        {loading && <div className="catalogue-loading" role="status">Loading products and images…</div>}
        {!loading && !loadError && filteredGroups.map((group) => <section className="product-group" id={group.id} key={group.id}><header><div><span>{group.material.toUpperCase()}</span><h3>{group.title}</h3></div><small>{String(group.products.length).padStart(2, "0")} PRODUCTS</small></header><div className="table-scroll"><table><thead><tr><th>SKU</th><th>Product</th><th>Size</th><th>Images</th><th>Price / piece</th><th><span className="sr-only">Add to cart</span></th></tr></thead><tbody>{group.products.map((product) => <tr key={product.sku}><td className="sku-cell">{product.sku}</td><td>{product.name}</td><td className="size-cell">{product.diameterOrSize}</td><td><Link className="gallery-link" to={`/product/${encodeURIComponent(product.id)}`} aria-label={`View all images for ${product.name}`}><ProductImages product={product} compact /><span>{productImages(product).length || 0} views <ArrowRight size={12} /></span></Link></td><td className="price-cell">{formatPrice(priceFor(product), currency)}</td><td><button className="add-button" onClick={() => addProduct(product)} aria-label={`Add ${product.sku} to cart`}><Plus size={15} /><span>Add</span></button></td></tr>)}</tbody></table></div></section>)}
        {!loading && !loadError && !filteredGroups.length && <div className="empty-search"><Search size={22} /><p>{products.length ? `No products match “${query}”.` : "Products are being prepared for the catalogue."}</p><button onClick={() => setQuery("")}>Clear search</button></div>}
      </div></section>

      <section className="export-section" id="export"><div className="export-index">BRANNECO / EXPORT DESK <span>02 — 04</span></div><div className="export-layout"><div><p className="eyebrow">FROM FIRST SAMPLE TO FULL CONTAINER</p><h2>Good things<br /><i>travel well.</i></h2></div><div className="export-steps">{["Browse and select your products", "Review prices in your preferred currency", "Request FOB or CIF terms for your destination", "Choose a trial carton or container volume", "We coordinate documentation and freight support"].map((step, i) => <div className="export-step" key={step}><span>0{i + 1}</span><p>{step}</p><ArrowRight size={15} /></div>)}<button className="button button-gold" onClick={openWhatsAppQuote}>Build an export quote <ArrowRight size={16} /></button></div></div></section>

      <section className="why-section section-shell" id="why"><div className="section-heading"><div><p className="eyebrow">GOOD BY DESIGN</p><h2>Better materials.<br />A more considered choice.</h2></div><p>Useful, reliable packaging should leave<br />less behind after the meal.</p></div><div className="values-grid"><article><span>01</span><Leaf size={22} /><h3>Truly plastic-free</h3><p>Areca made from naturally fallen leaves, alongside biodegradable crop and paper materials.</p></article><article><span>02</span><ShieldCheck size={22} /><h3>Food-grade by design</h3><p>Materials selected for everyday service, from hot meals to takeaway and events.</p></article><article><span>03</span><Truck size={22} /><h3>Export-ready support</h3><p>Flexible FOB and CIF terms, practical order volumes and shipping coordination.</p></article><article><span>04</span><Sprout size={22} /><h3>Made around your brief</h3><p>Custom shapes and embossed logos can be developed around your product needs.</p></article></div></section>

      <section className="about-section" id="about"><div className="about-visual"><img src="/plate.svg" alt="Plant-fiber plate with embossed eco mark" /><span>FROM INDIA, WITH CARE</span></div><div className="about-copy"><p className="eyebrow">A LITTLE ABOUT US</p><h2>Simple to source.<br /><i>Thoughtful to serve.</i></h2><p>BrannEco brings together practical, plastic-free tableware and food packaging made in India. From areca leaf and rice husk to sugarcane bagasse, kraft paper and wooden cutlery, each range is chosen to offer a more considered alternative for businesses around the world.</p><p>Founded by Ritik Vishwakarma, with roots at NIT Warangal and IIT Delhi, BrannEco is built around a simple idea: make sustainable single-use tableware reliable to source and ready to ship.</p><a className="text-link" href="#catalogue">Explore the full range <ArrowRight size={16} /></a></div></section>

      <section className="catalogue-cta" id="contact"><div><p className="eyebrow">NEED A PARTICULAR SIZE OR SHAPE?</p><h2>Let’s find the right fit.</h2><p>Ask about specifications, custom moulds, order quantities or shipping to your market.</p></div><button className="button button-dark" onClick={openWhatsAppQuote}>Talk to our export desk <ArrowRight size={16} /></button></section>
    </main>

    <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-icon"><Sprout size={20} /></span><span>brann<span>eco</span><small>TABLEWARE · INDIA</small></span></a><p>Thoughtful tableware, made in India.</p><div><a href="#categories">Materials</a><a href="#catalogue">Catalogue</a><Link to="/signup">Customer sign up</Link><Link to="/admin/login">Admin</Link><a href="mailto:ritiknitw7697@gmail.com">Email</a><a href="https://wa.me/919039220991">WhatsApp</a></div><small>© {new Date().getFullYear()} BrannEco · Prices are indicative; final pricing confirmed by quote.</small></footer>

    {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="quote-drawer" aria-label="Shopping cart"><header><div><p className="eyebrow">YOUR SELECTION</p><h2>Cart <span>({itemCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button></header>{cartLines.length ? <><div className="drawer-items">{cartLines.map((product) => <article className="drawer-item" key={product._id}><ProductImages product={product} compact /><div className="drawer-product"><b>{product.name}</b><span>{product.sku} · {product.diameterOrSize}</span><strong>{formatPrice(priceFor(product), currency)} <small>/ piece</small></strong></div><div className="quantity-control"><button onClick={() => setLineQuantity(product, product.quantity - 1)} aria-label={`Remove one ${product.sku}`}><Minus size={14} /></button><span>{product.quantity}</span><button onClick={() => setLineQuantity(product, product.quantity + 1)} aria-label={`Add one ${product.sku}`}><Plus size={14} /></button></div></article>)}</div><div className="drawer-total"><span>Indicative total</span><b>{formatPrice(currency === "INR" ? subtotal : cartTotal, currency)}</b><small>Calculated from current product pricing; shipping and final export terms are confirmed separately.</small><button className="button button-gold" onClick={() => { setCartOpen(false); window.location.href = "/checkout"; }}>Continue to checkout <ArrowRight size={16} /></button><button className="button button-quiet quote-whatsapp" onClick={openWhatsAppQuote}>Request export quote on WhatsApp</button></div></> : <div className="drawer-empty"><ShoppingBag size={28} /><h3>Your cart is empty</h3><p>Add products from the catalogue to continue.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Browse products</button></div>}</aside></div>}
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
  </div>;
}
