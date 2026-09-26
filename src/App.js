import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Download, Leaf, Menu, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, Sprout, Truck, X } from "lucide-react";

const groups = [
  {
    id: "areca-round", title: "Areca leaf · round plates", material: "ARECA LEAF",
    rows: [
      ["AL-RP-06", "Round plate", "6 in", 3.5, .06], ["AL-RP-08", "Round plate", "8 in", 5, .08], ["AL-RP-10", "Round plate", "10 in", 7, .11], ["AL-RP-12", "Round plate", "12 in", 9.5, .15], ["AL-RP-14", "Round plate", "14 in", 12, .19]
    ]
  },
  {
    id: "areca-mixed", title: "Areca leaf · plates, bowls & trays", material: "ARECA LEAF",
    rows: [
      ["AL-SP-04", "Square plate", "4 in", 2.5, .04], ["AL-SP-06", "Square plate", "6 in", 4, .07], ["AL-SP-07", "Square plate", "7 in", 5.5, .09], ["AL-SP-08", "Square plate", "8 in", 6.5, .1], ["AL-SP-10", "Square plate", "10 in", 8.5, .13], ["AL-BW-3SQ", "Square bowl", "3 in", 2, .03], ["AL-BW-4SQ", "Square bowl", "4 in", 2.5, .04], ["AL-BW-4RD", "Round bowl", "4 in", 2.5, .04], ["AL-BW-5RD", "Round bowl", "5 in", 3.2, .05], ["AL-BW-6RD", "Round bowl", "6 in", 4, .06], ["AL-MP-HRT65", "Heart plate", "6.5 in", 5, .08], ["AL-MP-TRY69", "Rectangle tray", "6 × 9 in", 6, .09], ["AL-MP-SPN06", "Leaf-wood spoon", "6 in", 1.5, .02], ["AL-CP-9SQ3", "3-part square compartment plate", "9 in", 7.5, .12], ["AL-CP-10RD3", "3-part round compartment plate", "10 in", 8, .13], ["AL-CP-12RD4", "4-part round compartment plate", "12 in", 10, .16], ["AL-CP-10SQ4", "4-part square compartment plate", "10 in", 9.5, .15]
    ]
  },
  {
    id: "rice-husk", title: "Rice husk tableware", material: "RICE HUSK",
    rows: [
      ["RH-RP-07", "Round plate", "7 in", 6, .1], ["RH-RP-09", "Round plate", "9 in", 8, .13], ["RH-RP-10", "Round plate", "10 in", 9.5, .15], ["RH-CP-10RD3", "3-compartment round plate", "10 in", 10.5, .17], ["RH-CP-97RT3", "3-compartment rectangular tray", "9 × 7 in", 11, .18], ["RH-CP-97MT4", "4-compartment meal tray", "9 × 7 in", 12, .19]
    ]
  },
  {
    id: "bagasse", title: "Sugarcane bagasse", material: "SUGARCANE BAGASSE",
    rows: [
      ["SC-BX-66BG", "Burger box", "6 × 6 in", 4.5, .07], ["SC-BX-75CS3", "3-compartment clamshell", "7 × 5 in", 5.5, .09], ["SC-BX-96CS", "Clamshell box", "9 × 6 in", 6.5, .1], ["SC-BX-88SQ", "Square clamshell", "8 × 8 in", 8, .13], ["SC-BX-88SQ3", "3-compartment square clamshell", "8 × 8 in", 8.5, .14], ["SC-BX-99SQ", "Square clamshell", "9 × 9 in", 9.5, .15], ["SC-RP-06..12", "Round plate · assorted sizes", "6–12 in", 7, .11], ["SC-CP-10RD3", "3-compartment round plate", "10 in", 7.5, .12], ["SC-CP-11RD4", "4-compartment round plate", "11 in", 8.5, .13], ["SC-CP-12RD4", "4-compartment round plate", "12 in", 9.5, .15], ["SC-SQ-07", "Square plate", "7 in", 5, .08], ["SC-SQ-09", "Square plate", "9 in", 6.5, .1], ["SC-TR-96CP3", "3-compartment tray", "9 × 6 in", 7, .11], ["SC-TR-5CPLID", "5-compartment meal tray with lid", "280 × 215 mm", 13, .21], ["SC-TR-5CPSCH", "5-compartment school tray", "270 × 215 mm", 12.5, .2], ["SC-BWL-120KW", "Kiwi bowl", "120 ml", 2.2, .03], ["SC-BWL-180RD", "Round bowl", "180 ml", 2.8, .04], ["SC-BWL-180SQ", "Square bowl", "180 ml", 2.8, .04]
    ]
  },
  {
    id: "paper", title: "Paper & kraft packaging", material: "PAPER & KRAFT",
    rows: [
      ["PK-BENTO-750", "Kraft bento box", "750 ml", 9, .14], ["PK-BENTO-1000", "Kraft bento box", "1,000 ml", 11, .17], ["PK-TUB-250..1000", "Kraft soup / ice-cream tub", "250–1,000 ml", 7, .11], ["PK-BWL-16..43OZ", "Kraft salad bowl", "16–43 oz", 10, .16], ["PK-WTUB-100..1000", "Paper bowl / white tub", "100–1,000 ml", 6, .1], ["PK-POUCH-100..1000", "Kraft stand-up pouch", "100–1,000 ml", 5.25, .085], ["PK-CONT-CLR", "Kraft container with clear lid", "150–750 ml", 8, .125], ["PK-LBOX-500..1000", "Kraft fold-top lunch box", "500–1,000 ml", 10, .155], ["PK-BAKE-4X4", "Baking box", "4 × 4 in", 3, .05], ["PK-WRAP-6X9..10X12", "Grease-proof wraps · 4 sizes", "assorted", 2, .035]
    ]
  },
  {
    id: "wood", title: "Wooden cutlery", material: "WOOD",
    rows: [
      ["WD-SPN-160", "Spoon", "160 mm", .9, .015], ["WD-FRK-160", "Fork", "160 mm", .9, .015], ["WD-KNF-165", "Knife", "165 mm", 1, .016], ["WD-SPK-160", "Spork", "160 mm", .9, .015], ["WD-STR-160", "Coffee stirrer", "160 mm", .5, .008]
    ]
  }
];

const currencies = {
  INR: { symbol: "₹", label: "INR · India", rate: 1 },
  USD: { symbol: "$", label: "USD · Export", rate: 83 },
  EUR: { symbol: "€", label: "EUR · Export", rate: 90 },
  GBP: { symbol: "£", label: "GBP · Export", rate: 105 },
  AED: { symbol: "د.إ", label: "AED · Export", rate: 22.6 }
};
const flatProducts = groups.flatMap((group) => group.rows.map(([sku, name, size, inr, usd]) => ({ sku, name, size, inr, usd, group: group.title, material: group.material })));
const readCart = () => {
  try { return JSON.parse(localStorage.getItem("branneco_quote_cart") || "{}"); }
  catch { return {}; }
};

function App() {
  const [currency, setCurrency] = useState("INR");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const money = currencies[currency];
  const filteredGroups = useMemo(() => groups.map((group) => ({
    ...group,
    rows: group.rows.filter((row) => row.join(" ").toLowerCase().includes(query.trim().toLowerCase()))
  })).filter((group) => group.rows.length), [query]);
  const cartLines = flatProducts.filter((product) => cart[product.sku] > 0);
  const cartCount = cartLines.reduce((sum, product) => sum + cart[product.sku], 0);
  const cartTotal = cartLines.reduce((sum, product) => sum + productPrice(product) * cart[product.sku], 0);

  function productPrice(product) {
    if (currency === "INR") return product.inr;
    const fx = product.usd / currencies.USD.rate;
    return fx * money.rate;
  }
  function formatPrice(value) {
    const decimals = currency === "INR" ? 2 : value < 0.1 ? 3 : 2;
    return `${money.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }
  function saveCart(nextCart) {
    setCart(nextCart);
    try { localStorage.setItem("branneco_quote_cart", JSON.stringify(nextCart)); } catch { /* storage may be disabled */ }
  }
  function addProduct(sku) {
    saveCart({ ...cart, [sku]: (cart[sku] || 0) + 1 });
    setToast(`${sku} added to quote`);
    window.setTimeout(() => setToast(""), 1800);
  }
  function changeQuantity(sku, amount) {
    const quantity = (cart[sku] || 0) + amount;
    const next = { ...cart };
    if (quantity <= 0) delete next[sku]; else next[sku] = quantity;
    saveCart(next);
  }
  function requestQuote() {
    const lines = cartLines.map((product) => `${product.sku} ${product.name} × ${cart[product.sku]}`).join("\n");
    const text = `Hello BrannEco, please quote these products (${currency}, ${formatPrice(cartTotal)} indicative total). Please share FOB and CIF options.\n\n${lines || "Please share your export catalogue."}`;
    window.open(`https://wa.me/919039220991?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }
  function downloadCatalogue() {
    const rows = ["SKU,Product,Size,Indicative INR,Export USD,Material", ...flatProducts.map((p) => [p.sku, `"${p.name}"`, `"${p.size}"`, p.inr, p.usd, `"${p.material}"`].join(","))];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    link.download = "branneco-product-catalogue.csv";
    link.click();
    URL.revokeObjectURL(link.href);
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
      <nav className={mobileMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{nav.map(([href, label]) => <a href={href} key={href} onClick={() => setMobileMenuOpen(false)}>{label}</a>)}</nav>
      <div className="header-actions">
        <label className="currency-control"><span>{money.symbol}</span><select value={currency} onChange={(event) => setCurrency(event.target.value)} aria-label="Display currency">{Object.entries(currencies).map(([code, info]) => <option key={code} value={code}>{info.label}</option>)}</select><ChevronDown size={13} /></label>
        <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open quote cart, ${cartCount} items`}><ShoppingBag size={17} /><span>Quote</span><b>{cartCount}</b></button>
        <button className="mobile-toggle" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span /> RESPONSIBLY MADE · READY TO SHIP</p><h1>Plastic-free<br /><i>tableware,</i><br />shipped worldwide.</h1><p className="hero-lede">Thoughtful everyday essentials, made from fallen leaves, crop byproducts and responsibly sourced paper.</p><div className="hero-actions"><a className="button button-gold" href="#catalogue">Explore the catalogue <ArrowRight size={16} /></a><button className="button button-quiet" onClick={requestQuote}>Request export quote <ArrowDown size={15} /></button></div><div className="hero-meta"><span><ShieldCheck size={16} /> Food-grade materials</span><span><Truck size={17} /> Trial carton to container</span></div></div>
        <div className="hero-still"><img src="/plate.svg" alt="Embossed plate made from plant fiber" /><div className="still-caption"><Leaf size={15} /><span>Made for the meal.<br /><b>Gentler on what comes after.</b></span></div><span className="still-index">01 / 06 · ARECA LEAF</span></div>
        <div className="hero-aside">INDIA <span>·</span> 21°08′ N</div>
      </section>

      <div className="trust-strip"><span><Check size={15} /> Food-grade & biodegradable</span><span><PackageCheck size={16} /> Flexible order volumes</span><span><Truck size={16} /> FOB / CIF export terms</span><span><Sprout size={16} /> Custom moulds available</span></div>

      <section className="category-section section-shell" id="categories"><div className="section-heading"><div><p className="eyebrow">FIND YOUR MATERIAL</p><h2>Made from what<br />nature leaves behind.</h2></div><p>Six thoughtful ranges. One lighter footprint.<br />Explore the material that works for you.</p></div><div className="category-grid">{groups.filter((g) => g.id !== "areca-mixed").map((group, index) => <a href={`#${group.id}`} className={`category-tile category-${index}`} key={group.id}><span className="tile-number">0{index + 1}</span><span className="tile-bottom"><span><small>{group.material}</small><b>{group.id === "areca-round" ? "Areca leaf" : group.id === "rice-husk" ? "Rice husk" : group.id === "bagasse" ? "Sugarcane bagasse" : group.id === "paper" ? "Paper & kraft" : "Wooden cutlery"}</b></span><ArrowRight size={19} /></span></a>)}<a href="#contact" className="category-tile category-custom"><span className="tile-number">06</span><span className="tile-bottom"><span><small>MADE TO ORDER</small><b>Custom moulds</b></span><ArrowRight size={19} /></span></a></div></section>

      <section className="catalogue-section" id="catalogue"><div className="section-shell"><div className="catalogue-title"><div><p className="eyebrow">SPECIFICATIONS AT A GLANCE</p><h2>The product catalogue</h2><p>Illustrative per-piece pricing · final quotes depend on order volume and destination.</p></div><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SKU or product" aria-label="Search SKU or product" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={15} /></button>}</label></div><div className="catalogue-tools"><span>{filteredGroups.reduce((sum, group) => sum + group.rows.length, 0)} SKUs <span className="tool-dot">·</span> prices in {currency}</span><button onClick={downloadCatalogue}><Download size={15} /> Download catalogue CSV</button></div>
        {filteredGroups.length ? filteredGroups.map((group) => <section className="product-group" id={group.id} key={group.id}><header><div><span>{group.material}</span><h3>{group.title}</h3></div><small>{String(group.rows.length).padStart(2, "0")} PRODUCTS</small></header><div className="table-scroll"><table><thead><tr><th>SKU</th><th>Product</th><th>Size</th><th>Price / piece</th><th><span className="sr-only">Add to quote</span></th></tr></thead><tbody>{group.rows.map(([sku, name, size, inr]) => { const product = flatProducts.find((p) => p.sku === sku); return <tr key={sku}><td className="sku-cell">{sku}</td><td>{name}</td><td className="size-cell">{size}</td><td className="price-cell">{formatPrice(productPrice(product))}</td><td><button className="add-button" onClick={() => addProduct(sku)} aria-label={`Add ${sku} to quote`}><Plus size={15} /><span>Add</span></button></td></tr>; })}</tbody></table></div></section>) : <div className="empty-search"><Search size={22} /><p>No products match “{query}”.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
      </div></section>

      <section className="export-section" id="export"><div className="export-index">BRANNECO / EXPORT DESK <span>02 — 04</span></div><div className="export-layout"><div><p className="eyebrow">FROM FIRST SAMPLE TO FULL CONTAINER</p><h2>Good things<br /><i>travel well.</i></h2></div><div className="export-steps">{["Browse and select your products", "Review prices in your preferred currency", "Request FOB or CIF terms for your destination", "Choose a trial carton or container volume", "We coordinate documentation and freight support"].map((step, i) => <div className="export-step" key={step}><span>0{i + 1}</span><p>{step}</p><ArrowRight size={15} /></div>)}<button className="button button-gold" onClick={() => setCartOpen(true)}>Build an export quote <ArrowRight size={16} /></button></div></div></section>

      <section className="why-section section-shell" id="why"><div className="section-heading"><div><p className="eyebrow">GOOD BY DESIGN</p><h2>Better materials.<br />A more considered choice.</h2></div><p>Useful, reliable packaging should leave<br />less behind after the meal.</p></div><div className="values-grid"><article><span>01</span><Leaf size={22} /><h3>Truly plastic-free</h3><p>Areca made from naturally fallen leaves, alongside biodegradable crop and paper materials.</p></article><article><span>02</span><ShieldCheck size={22} /><h3>Food-grade by design</h3><p>Materials selected for everyday service, from hot meals to takeaway and events.</p></article><article><span>03</span><Truck size={22} /><h3>Export-ready support</h3><p>Flexible FOB and CIF terms, practical order volumes and shipping coordination.</p></article><article><span>04</span><Sprout size={22} /><h3>Made around your brief</h3><p>Custom shapes and embossed logos can be developed around your product needs.</p></article></div></section>

      <section className="about-section" id="about"><div className="about-visual"><img src="/plate.svg" alt="Plant-fiber plate with embossed eco mark" /><span>FROM INDIA, WITH CARE</span></div><div className="about-copy"><p className="eyebrow">A LITTLE ABOUT US</p><h2>Simple to source.<br /><i>Thoughtful to serve.</i></h2><p>BrannEco brings together practical, plastic-free tableware and food packaging made in India. From areca leaf and rice husk to sugarcane bagasse, kraft paper and wooden cutlery, each range is chosen to offer a more considered alternative for businesses around the world.</p><p>Founded by Ritik Vishwakarma, with roots at NIT Warangal and IIT Delhi, BrannEco is built around a simple idea: make sustainable single-use tableware reliable to source and ready to ship.</p><a className="text-link" href="#catalogue">Explore the full range <ArrowRight size={16} /></a></div></section>

      <section className="catalogue-cta" id="contact"><div><p className="eyebrow">NEED A PARTICULAR SIZE OR SHAPE?</p><h2>Let’s find the right fit.</h2><p>Ask about specifications, custom moulds, order quantities or shipping to your market.</p></div><button className="button button-dark" onClick={requestQuote}>Talk to our export desk <ArrowRight size={16} /></button></section>
    </main>

    <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-icon"><Sprout size={20} /></span><span>brann<span>eco</span><small>TABLEWARE · INDIA</small></span></a><p>Thoughtful tableware, made in India.</p><div><a href="#categories">Materials</a><a href="#catalogue">Catalogue</a><a href="#export">Export desk</a><a href="mailto:hello@thelegend5.com">Contact</a></div><small>© {new Date().getFullYear()} BrannEco · Indicative prices only; final pricing confirmed by quote.</small></footer>

    {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="quote-drawer" aria-label="Export quote cart"><header><div><p className="eyebrow">YOUR SELECTION</p><h2>Quote list <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close quote list"><X size={20} /></button></header>{cartLines.length ? <><div className="drawer-items">{cartLines.map((product) => <article className="drawer-item" key={product.sku}><div><b>{product.name}</b><span>{product.sku} · {product.size}</span><strong>{formatPrice(productPrice(product))} <small>/ piece</small></strong></div><div className="quantity-control"><button onClick={() => changeQuantity(product.sku, -1)} aria-label={`Remove one ${product.sku}`}><Minus size={14} /></button><span>{cart[product.sku]}</span><button onClick={() => changeQuantity(product.sku, 1)} aria-label={`Add one ${product.sku}`}><Plus size={14} /></button></div></article>)}</div><div className="drawer-total"><span>Indicative total</span><b>{formatPrice(cartTotal)}</b><small>Final pricing depends on volume, packaging and destination.</small><label>Quote terms<select aria-label="Quote terms"><option>FOB or CIF · please advise both</option><option>FOB · Free on Board</option><option>CIF · Cost, Insurance & Freight</option></select></label><button className="button button-gold" onClick={requestQuote}>Request this quote <ArrowRight size={16} /></button></div></> : <div className="drawer-empty"><ShoppingBag size={28} /><h3>Your quote list is empty</h3><p>Add products from the catalogue to request export pricing.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Browse products</button></div>}</aside></div>}
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
  </div>;
}

export default App;
