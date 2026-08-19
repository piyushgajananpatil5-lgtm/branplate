import { useEffect, useState } from 'react';
import api from '../../api/axios';

const nextStatuses = ['Order Placed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [tab, setTab] = useState('incomplete');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get(`/orders/admin/all?type=${tab}`)
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/admin/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-6">Orders</h1>

      <div className="flex gap-2 mb-6">
        {['incomplete', 'completed'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize ${
              tab === t ? 'bg-bran-brown text-cream' : 'bg-white border border-bran-brown/20 text-bran-brown'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-bran-brown/60">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-bran-brown/60">No {tab} orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-bran-brown/10 rounded-2xl p-5">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-bran-brown">Order #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-bran-brown/60">
                    {o.user?.name} ({o.user?.email}) · {new Date(o.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-bran-brown/60 mt-1">
                    {o.address?.line1}, {o.address?.city}, {o.address?.state} — {o.address?.pincode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-bran-brown">₹{o.total}</p>
                  {tab === 'incomplete' ? (
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="mt-2 border border-bran-brown/20 rounded-full px-3 py-1 text-sm"
                    >
                      {nextStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`mt-2 inline-block text-sm font-semibold ${o.status === 'Cancelled' ? 'text-red-500' : 'text-leaf-green'}`}>
                      {o.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 text-sm text-bran-brown/70 space-y-1">
                {o.items.map((i, idx) => (
                  <p key={idx}>{i.name} × {i.quantity} — ₹{i.price * i.quantity}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
