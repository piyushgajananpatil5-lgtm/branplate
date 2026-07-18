import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/account/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-8">Welcome Back</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green"
        />
        <input
          type="password" required placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-bran-brown text-cream py-3 rounded-full font-semibold disabled:opacity-60">
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
      <p className="text-sm text-bran-brown/60 mt-6">
        No account? <Link to="/signup" className="text-leaf-green font-medium">Sign up</Link>
      </p>
    </div>
  );
}
