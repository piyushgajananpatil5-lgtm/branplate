import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function BundleSection({ products }) {
  const { addToCart } = useCart();
  const bulkPacks = products.filter((p) => /bulk|combo|50|100/i.test(p.packSize || p.name));
  const list = bulkPacks.length ? bulkPacks : products;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h2 className="text-3xl font-display font-bold text-bran-brown mb-2">Save Some Bran</h2>
      <p className="text-bran-brown/60 mb-8">Buy in bulk for events, weddings, and catering.</p>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {list.map((p) => (
          <motion.div
            key={p._id}
            whileHover={{ y: -4 }}
            className="min-w-[260px] bg-white border border-bran-brown/10 rounded-2xl p-6 flex-shrink-0"
          >
            <h3 className="font-bold text-bran-brown">{p.name}</h3>
            <p className="text-sm text-bran-brown/60 mt-1">{p.packSize}</p>
            <p className="text-xl font-semibold text-bran-brown mt-3">₹{p.price}</p>
            <button
              onClick={() => addToCart(p, 1)}
              className="mt-4 w-full bg-leaf-green text-white py-2 rounded-full text-sm font-semibold hover:brightness-110 transition"
            >
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
