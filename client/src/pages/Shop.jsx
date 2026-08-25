import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  const sorted = [...products].sort((a, b) => {
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
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-display font-bold text-bran-brown">Shop All Plates</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-bran-brown/20 rounded-full px-4 py-2 text-sm text-bran-brown bg-white"
        >
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
