import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminQueries() {
  const [category, setCategory] = useState('');
  const [queries, setQueries] = useState([]);

  const load = () => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    api.get(`/contact/admin${params}`).then((res) => setQueries(res.data));
  };
  useEffect(load, [category]);

  const updateQuery = async (id, fields) => {
    await api.put(`/contact/admin/${id}`, fields);
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-6">Refund & Contact Queries</h1>

      <div className="flex gap-2 mb-6">
        {['', 'General Query', 'Refund Request'].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              category === c ? 'bg-bran-brown text-cream' : 'bg-white border border-bran-brown/20 text-bran-brown'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {queries.map((q) => (
          <div key={q._id} className="bg-white border border-bran-brown/10 rounded-2xl p-5">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-bran-brown">{q.name} — {q.email}</p>
                <p className="text-xs text-bran-brown/50">{q.category} {q.orderId && `· Order ${q.orderId}`} · {new Date(q.createdAt).toLocaleString()}</p>
              </div>
              <select
                value={q.status}
                onChange={(e) => updateQuery(q._id, { status: e.target.value })}
                className="border border-bran-brown/20 rounded-full px-3 py-1 text-sm h-fit"
              >
                <option>Open</option>
                <option>Resolved</option>
              </select>
            </div>
            <p className="text-bran-brown/80 text-sm mt-3">{q.message}</p>
            <textarea
              placeholder="Admin notes / response…"
              defaultValue={q.adminNotes}
              onBlur={(e) => updateQuery(q._id, { adminNotes: e.target.value })}
              className="w-full mt-3 border border-bran-brown/20 rounded-xl px-3 py-2 text-sm"
              rows={2}
            />
          </div>
        ))}
        {queries.length === 0 && <p className="text-bran-brown/60">No queries here.</p>}
      </div>
    </div>
  );
}
