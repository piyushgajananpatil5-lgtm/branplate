import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const links = [
  ['/admin/orders', 'Orders'],
  ['/admin/products', 'Products'],
  ['/admin/queries', 'Refund & Queries'],
  ['/admin/settings', 'Settings'],
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-bran-brown text-cream p-6 flex flex-col">
        <h2 className="text-xl font-display font-bold mb-8">BranPlate Admin</h2>
        <nav className="flex-1 space-y-2">
          {links.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname.startsWith(to) ? 'bg-cream/15 font-semibold' : 'hover:bg-cream/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-cream/60 mb-2">{admin?.email}</div>
        <button onClick={handleLogout} className="text-sm text-left text-cream/80 hover:text-wheat-gold">
          Log Out
        </button>
      </aside>
      <main className="flex-1 bg-cream p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
