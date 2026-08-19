import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', orderId: '', category: 'General Query', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    api.get('/settings/contact').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', orderId: '', category: 'General Query', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-display font-bold text-bran-brown mb-6">Get in Touch</h1>
        {settings && (
          <div className="space-y-2 text-bran-brown/70">
            <p>📞 {settings.phone}</p>
            <p>✉️ {settings.email}</p>
            <p>📍 {settings.address}</p>
            <p>🕒 {settings.businessHours}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Your Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        <input required type="email" placeholder="Your Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        <input placeholder="Order ID (optional)" value={form.orderId}
          onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green">
          <option>General Query</option>
          <option>Refund Request</option>
        </select>
        <textarea required rows={5} placeholder="Your Message" value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green" />
        <button disabled={status === 'sending'} className="w-full bg-bran-brown text-cream py-3 rounded-full font-semibold disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        {status === 'sent' && <p className="text-leaf-green text-sm">Thanks — we'll be in touch soon.</p>}
        {status === 'error' && <p className="text-red-500 text-sm">Something went wrong. Try again.</p>}
      </form>
    </div>
  );
}
