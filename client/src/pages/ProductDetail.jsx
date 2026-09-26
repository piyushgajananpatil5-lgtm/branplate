import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product || res.data)).catch(() => {});
  }, [id]);
  useEffect(() => setActiveImage(0), [id]);

  const images = useMemo(() => [...new Set([...(product?.images || []), product?.image, ...(product?.secondaryImages || [])].filter(Boolean))], [product]);

  if (!product) return <div className="max-w-7xl mx-auto px-6 py-24 text-bran-brown">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12"
    >
      <div className="product-detail-gallery">
        {images.length ? (
          <img className="product-detail-main-image" src={images[activeImage]} alt={`${product.name} image ${activeImage + 1}`} fetchPriority="high" decoding="async" />
        ) : (
          <div className="product-image-fallback"><Leaf size={28} /><span>{product.material || 'BrannEco'}</span></div>
        )}
        {images.length > 1 && <div className="product-detail-thumbnails" aria-label="All product images">{images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`} aria-pressed={activeImage === index}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}</div>}
        {images.length > 1 && <div className="product-detail-image-strip">{images.slice(1).map((image, index) => <img key={`${image}-below`} src={image} alt={`${product.name} additional view ${index + 2}`} loading="lazy" decoding="async" onClick={() => setActiveImage(index + 1)} />)}</div>}
      </div>

      <div>
        <h1 className="text-4xl font-display font-bold text-bran-brown">{product.name}</h1>
        <p className="text-bran-brown/70 mt-4">{product.description}</p>
        <p className="text-3xl font-semibold text-bran-brown mt-6">₹{product.price} <small className="text-sm font-normal">/ piece</small></p>

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
