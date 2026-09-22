import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('newest');
  const [material, setMaterial] = useState('all');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  const filtered = material === 'all' ? products : products.filter((product) => `${product.name} ${product.description} ${product.material || ''}`.toLowerCase().includes(material));
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-16"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-display font-bold text-bran-brown">Shop All Plates</h1>
        <div className="flex flex-wrap gap-2">
          {['all', 'kraft', 'bagasse', 'rice husk', 'areca leaf'].map((option) => (
            <button key={option} onClick={() => setMaterial(option)} className={`rounded-full border px-4 py-2 text-sm capitalize transition ${material === option ? 'border-bran-brown bg-bran-brown text-cream' : 'border-bran-brown/20 text-bran-brown hover:border-leaf-green'}`}>{option === 'all' ? 'All materials' : option}</button>
          ))}
        </div>
      </div>
      <div className="mb-8 flex justify-end">
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-bran-brown/20 bg-white px-4 py-2 text-sm text-bran-brown">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </motion.div>
  );
}
