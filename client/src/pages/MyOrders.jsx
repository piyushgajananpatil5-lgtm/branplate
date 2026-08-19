import { useEffect, useState } from 'react';
import api from '../api/axios';

const steps = ['Order Placed', 'Packed', 'Out for Delivery', 'Delivered'];

function StatusBar({ status }) {
  if (status === 'Cancelled') {
    return <span className="text-red-500 font-semibold text-sm">Cancelled</span>;
  }
  const current = steps.indexOf(status);
  return (
    <div className="flex items-center gap-2 mt-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${i <= current ? 'bg-leaf-green' : 'bg-bran-brown/15'}`} />
          {i < steps.length - 1 && <div className={`w-8 h-[2px] ${i < current ? 'bg-leaf-green' : 'bg-bran-brown/15'}`} />}
        </div>
      ))}
      <span className="text-sm text-bran-brown/70 ml-2">{status}</span>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-4xl font-display font-bold text-bran-brown mb-10">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-bran-brown/60">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="border border-bran-brown/10 rounded-2xl p-6 bg-white/60">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-bran-brown">Order #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-bran-brown/60">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-bran-brown">₹{o.total}</p>
              </div>
              <StatusBar status={o.status} />
              <div className="mt-4 text-sm text-bran-brown/70 space-y-1">
                {o.items.map((i, idx) => (
                  <p key={idx}>{i.name} × {i.quantity}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
