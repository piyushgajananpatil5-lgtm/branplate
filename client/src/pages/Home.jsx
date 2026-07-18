import { useEffect, useState } from 'react';
import api from '../api/axios';
import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import BundleSection from '../components/BundleSection';
import ReviewsMarquee from '../components/ReviewsMarquee';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Hero />
      <FeatureStrip />

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-display font-bold text-bran-brown mb-2">Choose Your Plate</h2>
        <p className="text-bran-brown/60 mb-8">Every plate, honeycomb-strong and fully compostable.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <BundleSection products={products} />
      <ReviewsMarquee />
    </div>
  );
}
