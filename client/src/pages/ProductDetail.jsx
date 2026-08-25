import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => {});
  }, [id]);

  if (!product) return <div className="max-w-7xl mx-auto px-6 py-24 text-bran-brown">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12"
    >
      <div className="aspect-square bg-wheat-gold/15 rounded-3xl flex items-center justify-center overflow-hidden">
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-bran-brown/30">Product image</span>
        )}
      </div>

      <div>
        <h1 className="text-4xl font-display font-bold text-bran-brown">{product.name}</h1>
        <p className="text-bran-brown/70 mt-4">{product.description}</p>
        <p className="text-3xl font-semibold text-bran-brown mt-6">₹{product.price}</p>

        <div className="flex items-center gap-3 mt-6">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 border border-bran-brown/20 rounded-full">
            −
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 border border-bran-brown/20 rounded-full">
            +
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(product, qty)}
          className="mt-8 bg-bran-brown text-cream px-10 py-4 rounded-full font-semibold"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
