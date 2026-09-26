import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.order || res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <CheckCircle className="mx-auto text-leaf-green mb-4" size={56} />
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-2">Order Placed!</h1>
      <p className="text-bran-brown/70 mb-8">
        {order ? `Order #${order._id.slice(-6).toUpperCase()} — Total ₹${order.total}` : 'Loading your order details...'}
      </p>
      {location.state?.emailNotificationSent === false && <p className="text-sm text-amber-800 mb-5">Your order is saved. The shop email notification is pending mail setup; please message us on WhatsApp to confirm.</p>}
      <a href={`https://wa.me/919039220991?text=${encodeURIComponent(`Hello BrannEco, I placed order ${order?.orderNumber || id}. Please confirm my order.`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1b4332] text-white px-7 py-3 rounded-full font-semibold mb-6">Continue on WhatsApp</a>
      <p className="text-bran-brown/60 mb-8">
        Estimated delivery: 3–5 business days. Track it anytime under "My Orders."
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/account/orders" className="bg-bran-brown text-cream px-8 py-3 rounded-full font-semibold">
          View My Orders
        </Link>
        <Link to="/shop" className="border border-bran-brown/20 text-bran-brown px-8 py-3 rounded-full font-semibold">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
