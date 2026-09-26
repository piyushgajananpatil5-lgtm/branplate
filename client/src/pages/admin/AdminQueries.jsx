import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminQueries() {
  const [category, setCategory] = useState('');
  const [queries, setQueries] = useState([]);

  const load = () => api.get('/inquiries').then((res) => {
    const inquiries = res.data.inquiries || [];
    setQueries(category ? inquiries.filter((query) => query.status === category) : inquiries);
  });
  useEffect(load, [category]);

  const updateQuery = async (id, fields) => {
    await api.patch(`/inquiries/${id}/status`, fields);
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-6">Export & Contact Queries</h1>

      <div className="flex gap-2 mb-6">
        {['', 'new', 'contacted', 'quote_sent', 'closed'].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              category === c ? 'bg-bran-brown text-cream' : 'bg-white border border-bran-brown/20 text-bran-brown'
            }`}
          >
            {c ? c.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {queries.map((q) => (
          <div key={q._id} className="bg-white border border-bran-brown/10 rounded-2xl p-5">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-bran-brown">{q.name} · {q.businessName} — {q.email}</p>
                <p className="text-xs text-bran-brown/50">{q.businessType} · {q.estimatedMonthlyVolume} · {new Date(q.createdAt).toLocaleString()}</p>
              </div>
              <select
                value={q.status}
                onChange={(e) => updateQuery(q._id || q.id, { status: e.target.value })}
                className="border border-bran-brown/20 rounded-full px-3 py-1 text-sm h-fit"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quote_sent">Quote sent</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="text-bran-brown/80 text-sm mt-3">{q.message}</p>
          </div>
        ))}
        {queries.length === 0 && <p className="text-bran-brown/60">No queries here.</p>}
      </div>
    </div>
  );
}
