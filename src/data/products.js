export const INITIAL_PRODUCTS = [
    {
        id: 'bp-plate-100bio',
        name: '100% Biodegradable Pure Plant-Fiber Plate (10" Heavy-Duty)',
        category: 'dinner',
        tagline: 'Eco-certified compostable round plate crafted from 100% upcycled agro-fiber. Grease-proof, microwave-safe, zero plastic.',
        price: 18.5,
        originalPrice: 22.0,
        rating: 5.0,
        reviewsCount: 248,
        diameterOrSize: '10 inches (25.4 cm)',
        shape: 'Round',
        dimensions: '254mm x 254mm x 22mm, 52g net weight',
        heatResistance: '-20°C to +180°C (Microwave, Freezer & Oven Safe)',
        shelfLife: '24 Months in dry storage',
        decompositionTime: 'Composts completely in 30 days in soil without microplastics',
        materials: '100% Natural Biodegradable Plant Fiber / Wheat Residue, 0% Plastic Coating, 0% Chemical Binders',
        suitableFor: [
            'Hot gravies, curries & steaming rice',
            'Oily & greasy foods (100% leak resistant)',
            'Wedding banquets, buffets & catered events',
            'Everyday dining, cafes & food trucks',
            'Microwave reheating up to 180°C'
        ],
        inStock: true,
        stockCount: 25000,
        featured: true,
        bestseller: true,
        image: '/plate.svg',
        secondaryImages: [
            '/plate.svg'
        ],
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
export const SUSTAINABILITY_METRICS = {
    plasticPlatesReplaced: 1845200,
    wheatBranUpcycledKg: 96400,
    co2SavedKg: 289200,
    landfillDivertedCubicMeters: 3680,
    farmerIncomeAugmentedINR: 4250000
};
