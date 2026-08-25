import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="bg-bran-brown text-cream mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-display font-bold mb-3">BranPlate</h3>
          <p className="text-cream/70 text-sm">From Field to Feast. Back to Earth.</p>
          <div className="flex gap-4 mt-4">
            <Instagram size={20} className="hover:text-wheat-gold cursor-pointer transition-colors" />
            <Facebook size={20} className="hover:text-wheat-gold cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-cream/70 text-sm">
            {[
              ['/shop', 'Shop'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="relative hover:text-wheat-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Join the Field Club</h4>
          <p className="text-cream/70 text-sm mb-3">New products, restocks, and eco updates.</p>
          {submitted ? (
            <p className="text-leaf-green text-sm">Thanks — you're on the list!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 px-3 py-2 rounded-l-full text-bran-brown text-sm outline-none"
              />
              <button className="bg-leaf-green px-4 rounded-r-full text-sm font-semibold hover:brightness-110 transition">
                Join
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-cream/10 text-center text-xs text-cream/50 py-4">
        © {new Date().getFullYear()} BranPlate. All rights reserved.
      </div>
    </footer>
  );
}
