import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-bran-brown/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-display font-bold text-bran-brown">
          BranPlate
        </Link>

        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative text-bran-brown/80 hover:text-bran-brown transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-leaf-green after:transition-all ${
                  isActive ? 'after:w-full text-bran-brown' : 'after:w-0 hover:after:w-full'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link to={user ? '/account/orders' : '/login'} className="text-bran-brown hover:text-leaf-green transition-colors">
            <User size={22} />
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative text-bran-brown hover:text-leaf-green transition-colors">
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-leaf-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
