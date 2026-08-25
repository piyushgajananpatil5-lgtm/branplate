import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/account/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['name', 'text', 'Full Name'],
          ['email', 'email', 'Email'],
          ['phone', 'text', 'Phone (optional)'],
          ['password', 'password', 'Password'],
        ].map(([name, type, placeholder]) => (
          <input
            key={name}
            type={type}
            required={name !== 'phone'}
            placeholder={placeholder}
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green"
          />
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-bran-brown text-cream py-3 rounded-full font-semibold disabled:opacity-60">
          {loading ? 'Creating…' : 'Sign Up'}
        </button>
      </form>
      <p className="text-sm text-bran-brown/60 mt-6">
        Already have an account? <Link to="/login" className="text-leaf-green font-medium">Log in</Link>
      </p>
    </div>
  );
}
