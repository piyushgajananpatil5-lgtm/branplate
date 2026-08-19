import { motion } from 'framer-motion';
import { Leaf, Beef, Droplets, MapPin } from 'lucide-react';

const features = [
  { icon: Leaf, text: '100% Biodegradable in 30–45 Days' },
  { icon: Beef, text: 'Feeds Cattle After Use — A Category First' },
  { icon: Droplets, text: 'Holds Hot Curry & Gravy for 2–3 Hours' },
  { icon: MapPin, text: 'Zero Plastic, Zero Landfill' },
];

export default function FeatureStrip() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {features.map(({ icon: Icon, text }, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="p-6 border border-bran-brown/10 rounded-2xl bg-white/50 hover:border-leaf-green transition-colors"
        >
          <Icon className="text-leaf-green mb-3" size={28} />
          <p className="font-medium text-bran-brown">{text}</p>
        </motion.div>
      ))}
    </section>
  );
}
