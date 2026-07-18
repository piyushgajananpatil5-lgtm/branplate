import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const words = ['Biodegradable.', 'Feeds Cattle.', 'Zero Plastic.'];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-leaf-green font-semibold tracking-widest uppercase text-sm mb-4"
      >
        Central India · Circular Economy · Zero Landfill
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-7xl font-display font-bold text-bran-brown leading-tight"
      >
        From Field to Feast.
        <br />
        <span className="text-wheat-gold">Back to Earth.</span>
      </motion.h1>

      <div className="h-10 mt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-2xl text-bran-brown/70 font-medium"
          >
            {words[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(93, 64, 55, 0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 bg-bran-brown text-cream px-10 py-4 rounded-full text-lg font-semibold"
          >
            Shop Now
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
