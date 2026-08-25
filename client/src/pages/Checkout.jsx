import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const items = cart.map((i) => ({
        product: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.images?.[0] || '',
      }));
      const { data } = await api.post('/orders', { items, address: form, paymentMethod });
      clearCart();
      navigate(`/order/${data._id}/confirmation`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-bran-brown">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-4xl font-display font-bold text-bran-brown mb-10">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="font-semibold text-bran-brown text-lg">Shipping Address</h2>
          {[
            ['fullName', 'Full Name'],
            ['phone', 'Phone Number'],
            ['line1', 'Address Line 1'],
            ['line2', 'Address Line 2 (optional)'],
            ['city', 'City'],
            ['state', 'State'],
            ['pincode', 'Pincode'],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              required={name !== 'line2'}
              className="w-full border border-bran-brown/20 rounded-xl px-4 py-3 outline-none focus:border-leaf-green"
            />
          ))}

          <h2 className="font-semibold text-bran-brown text-lg pt-4">Payment Method</h2>
          <div className="flex gap-4">
            {['COD', 'RAZORPAY'].map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                {m === 'COD' ? 'Cash on Delivery' : 'Pay Online (Razorpay)'}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white/60 border border-bran-brown/10 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold text-bran-brown text-lg mb-4">Order Summary</h2>
          {cart.map((i) => (
            <div key={i._id} className="flex justify-between text-sm mb-2 text-bran-brown/80">
              <span>{i.name} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="border-t border-bran-brown/10 mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-semibold text-bran-brown text-base"><span>Total</span><span>₹{total}</span></div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-bran-brown text-cream py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
