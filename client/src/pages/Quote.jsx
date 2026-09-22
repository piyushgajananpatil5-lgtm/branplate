import { useState } from 'react';
import api from '../api/axios';

const initialForm = { name: '', company: '', email: '', product: 'Not sure yet', quantity: '', city: '', message: '' };

export default function Quote() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', {
        name: form.name,
        email: form.email,
        orderId: '',
        category: 'Quote Request',
        message: `Company: ${form.company}\nProduct: ${form.product}\nQuantity: ${form.quantity}\nCity: ${form.city}\n${form.message}`,
      });
      setStatus('sent');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-12">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-green">B2B enquiries</p>
        <h1 className="mt-4 text-5xl font-display font-bold leading-tight text-bran-brown">Tell us what your next event needs.</h1>
        <p className="mt-6 max-w-md leading-7 text-bran-brown/65">Share a few details and the BranEco team will help you choose the right material, size, and volume.</p>
        <a className="mt-8 inline-block font-semibold text-leaf-green" href="https://wa.me/919039220991?text=Hello%20BranEco%2C%20I%27d%20like%20a%20bulk%20quote.">Prefer WhatsApp? Start a chat.</a>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-bran-brown/10 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <input required name="name" value={form.name} onChange={update} placeholder="Your name" className="field" />
        <input required name="company" value={form.company} onChange={update} placeholder="Company or organisation" className="field" />
        <input required type="email" name="email" value={form.email} onChange={update} placeholder="Work email" className="field" />
        <input required name="city" value={form.city} onChange={update} placeholder="City" className="field" />
        <select name="product" value={form.product} onChange={update} className="field">
          <option>Not sure yet</option>
          <option>Kraft Paper</option>
          <option>Bagasse</option>
          <option>Rice Husk</option>
          <option>Areca Leaf</option>
          <option>Wheat Bran Plates</option>
        </select>
        <input required name="quantity" value={form.quantity} onChange={update} placeholder="Approx. quantity" className="field" />
        <textarea name="message" value={form.message} onChange={update} placeholder="Tell us about your event (optional)" rows="5" className="field md:col-span-2" />
        <button disabled={status === 'sending'} className="rounded-full bg-bran-brown px-6 py-3 font-semibold text-cream transition hover:bg-leaf-green disabled:opacity-60 md:col-span-2">{status === 'sending' ? 'Sending...' : 'Request a quote'}</button>
        {status === 'sent' && <p className="text-sm text-leaf-green md:col-span-2">Thanks. We will be in touch soon.</p>}
        {status === 'error' && <p className="text-sm text-red-600 md:col-span-2">Something went wrong. Please try WhatsApp instead.</p>}
      </form>
    </main>
  );
}