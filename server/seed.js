export const INITIAL_PRODUCTS = [
    {
        id: 'bp-plate-100bio',
        name: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)',
        category: 'dinner',
        tagline: 'Eco-certified compostable round plate crafted from 100% upcycled agro-fiber. Grease-proof, microwave-safe, zero plastic.',
        price: 18.5, originalPrice: 22.0, rating: 5.0, reviewsCount: 248,
        diameterOrSize: '10 inches (25.4 cm)', shape: 'Round',
        dimensions: '254mm x 254mm x 22mm, 52g net weight',
        heatResistance: '-20°C to +180°C (Microwave, Freezer & Oven Safe)',
        shelfLife: '24 Months in dry storage',
        decompositionTime: 'Composts completely in 30 days in soil without microplastics',
        materials: '100% Natural Biodegradable Plant Fiber / Wheat Residue, 0% Plastic Coating, 0% Chemical Binders',
        suitableFor: ['Hot gravies, curries & steaming rice', 'Oily & greasy foods (100% leak resistant)', 'Wedding banquets, buffets & catered events', 'Everyday dining, cafes & food trucks', 'Microwave reheating up to 180°C'],
        inStock: true, stockCount: 25000, featured: true, bestseller: true,
        image: '/plate.svg', secondaryImages: ['/plate.svg'],
        packSizes: [
            { size: 25, price: 18.5, label: 'Pack of 25 Plates', unitPrice: 0.74 },
            { size: 50, price: 34.0, label: 'Pack of 50 Plates (Save 8%)', unitPrice: 0.68 },
            { size: 100, price: 62.0, label: 'Pack of 100 Plates (Save 16%)', unitPrice: 0.62 },
            { size: 500, price: 280.0, label: 'Commercial Case of 500 Plates', unitPrice: 0.56 },
            { size: 1000, price: 510.0, label: 'Wholesale Master Pallet (1,000 Plates)', unitPrice: 0.51 }
        ],
        description: 'Our flagship 100% biodegradable plate. Manufactured through precision high-temperature molding of natural agricultural fibers. Delivers unmatched structural rigidity that never bends or gets soggy under piping hot food, gravies, or oils.'
    }
];
export const INITIAL_USERS = [
    { name: 'Piyush Patil', email: 'piyushgajananpatil5@gmail.com', phone: '+91 98234 56789',
        shippingAddress: { street: '74 Green Park Avenue, Near Agro Tech Center', city: 'Nagpur', state: 'Maharashtra', zip: '440001', country: 'India' },
        totalOrdersCount: 1, totalSpent: 182.4 },
    { name: 'Potato Bhai', email: 'potatobhai69@gmail.com', phone: '+91 98990 12345',
        totalOrdersCount: 0, totalSpent: 0 }
];
export const INITIAL_ADMINS = [
    { name: 'Piyush Patil', email: 'piyushgajananpatil5@gmail.com', role: 'super_admin',
        permissions: ['manage_admins', 'manage_products', 'manage_orders', 'manage_inquiries', 'edit_config', 'export_reports'],
        addedBy: 'System Primary Owner', status: 'active' },
    { name: 'Potato Bhai', email: 'potatobhai69@gmail.com', role: 'super_admin',
        permissions: ['manage_admins', 'manage_products', 'manage_orders', 'manage_inquiries', 'edit_config', 'export_reports'],
        addedBy: 'Super Administrator', status: 'active' }
];
export const INITIAL_IMPACT = {
    key: 'global', plasticPlatesReplaced: 1845200, wheatBranUpcycledKg: 96400,
    co2SavedKg: 289200, landfillDivertedCubicMeters: 3680, farmerIncomeAugmentedINR: 4250000
};
export const INITIAL_CONFIG = {
    clientUrl: 'https://branplate-q6sx.vercel.app',
    customDomain: 'thelegend5.com',
    firstAdminEmail: 'piyushgajananpatil5@gmail.com',
    brandName: 'BranPlate',
    tagline: '100% Biodegradable Wheat Bran Plates — From Field to Feast. Back to Earth.',
    region: 'Central India · Circular Economy · Zero Landfill',
    contactPhone: '+91 98234 56789',
    contactEmail: 'support@branplate.com',
    contactAddress: 'Plot 74, Agro Industrial Hub, Central Ring Road, Nagpur, Maharashtra 440001, India',
    contactHours: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
    gstinNumber: '27AAECB8821P1Z5'
};
export const INITIAL_ORDERS = [
    {
        orderNumber: 'BP-88219', customerName: 'Piyush Patil', email: 'piyushgajananpatil5@gmail.com', phone: '+91 98234 56789',
        address: { street: '74 Green Park Avenue, Near Agro Tech Center', city: 'Nagpur', state: 'Maharashtra', zip: '440001', country: 'India' },
        items: [
            { productId: 'bp-plate-100bio', productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: 'Pack of 100 Plates (Save 16%)', quantity: 2, unitPrice: 62, total: 124, image: '/plate.svg' },
            { productId: 'bp-plate-100bio', productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: 'Pack of 50 Plates (Save 8%)', quantity: 2, unitPrice: 34, total: 68, image: '/plate.svg' }
        ],
        subtotal: 192, discount: 19.2, shipping: 0, tax: 9.6, total: 182.4,
        status: 'shipped', paymentMethod: 'Prepaid (Direct Gateway / UPI)', trackingNumber: 'BP-TRK-992014-IN'
    },
    {
        orderNumber: 'BP-88220', customerName: 'EcoFest Catering Services', email: 'events@ecofest.org', phone: '+91 94221 11223',
        address: { street: 'Eco Plaza, Central Ring Road', city: 'Bhopal', state: 'Madhya Pradesh', zip: '462001', country: 'India' },
        items: [{ productId: 'bp-plate-100bio', productName: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)', packLabel: 'Wholesale Master Pallet (1,000 Plates)', quantity: 2, unitPrice: 510, total: 1020, image: '/plate.svg' }],
        subtotal: 1020, discount: 102, shipping: 0, tax: 45.9, total: 963.9,
        status: 'processing', paymentMethod: 'Commercial Purchase Order', trackingNumber: 'BP-TRK-992025-IN'
    }
];
export const INITIAL_INQUIRIES = [
    { name: 'Suresh Verma', businessName: 'The Organic Kitchen Cafe', email: 'suresh@organickitchen.in', phone: '+91 98811 22334',
        businessType: 'restaurant', estimatedMonthlyVolume: '2,500 - 5,000 plates/month',
        shippingAddress: '42 Farm-to-Table Lane, Pune, MH',
        interestedPlates: ['10" 100% Biodegradable Plant-Fiber Dinner Plate (Sample Pack)'],
        message: 'We are transitioning our 3 restaurant branches to 100% plastic-free biodegradable plates. Requesting sample kit for hot gravy durability test.',
        status: 'sample_dispatched' }
];

  const firstAdminEmail = (process.env.FIRST_ADMIN_EMAIL || '').toLowerCase();
  if (firstAdminEmail) {
    const exists = await AdminUser.findOne({ email: firstAdminEmail });
    if (!exists) {
      await AdminUser.create({ email: firstAdminEmail, role: 'owner' });
      console.log(`Whitelisted first admin: ${firstAdminEmail}. Visit /admin/signup to set a password.`);
    } else {
      console.log(`Admin ${firstAdminEmail} already exists.`);
    }
  } else {
    console.log('No FIRST_ADMIN_EMAIL set in .env — skipping admin whitelist seed.');
  }

  const settingsExists = await SiteSettings.findOne({ key: 'contact' });
  if (!settingsExists) {
    await SiteSettings.create({ key: 'contact' });
    console.log('Default site contact settings created.');
  }

  console.log('Seeding complete.');
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
