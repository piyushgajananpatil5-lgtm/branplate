import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [status, setStatus] = useState('idle'); // idle | adding | added

  const handleAdd = () => {
    setStatus('adding');
    addToCart(product, 1);
    setTimeout(() => setStatus('added'), 500);
    setTimeout(() => setStatus('idle'), 1800);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="border border-bran-brown/10 rounded-3xl p-6 bg-white/60 hover:border-leaf-green transition-colors flex flex-col"
    >
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square bg-wheat-gold/15 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-bran-brown/30 text-sm">Product image</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-bran-brown">{product.name}</h3>
        <p className="text-bran-brown/60 text-sm mt-1 line-clamp-2">{product.description}</p>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-bran-brown">₹{product.price}</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-bran-brown text-cream px-5 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition min-w-[104px]"
        >
          {status === 'adding' ? 'Adding…' : status === 'added' ? 'Added ✓' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}
