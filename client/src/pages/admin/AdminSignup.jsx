import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSignup() {
  const { signup } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form.email, form.password);
      navigate('/admin/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-2">Set Admin Password</h1>
      <p className="text-bran-brown/60 mb-8 text-sm">
        Only works for Gmail addresses already added to the admin whitelist.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" required placeholder="Admin Gmail" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        <input type="password" required placeholder="Choose a Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-bran-brown text-cream py-3 rounded-full font-semibold disabled:opacity-60">
          {loading ? 'Setting up…' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
}
