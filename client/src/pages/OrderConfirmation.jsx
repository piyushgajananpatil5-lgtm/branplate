import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <CheckCircle className="mx-auto text-leaf-green mb-4" size={56} />
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-2">Order Placed!</h1>
      <p className="text-bran-brown/70 mb-8">
        {order ? `Order #${order._id.slice(-6).toUpperCase()} — Total ₹${order.total}` : 'Loading your order details...'}
      </p>
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
