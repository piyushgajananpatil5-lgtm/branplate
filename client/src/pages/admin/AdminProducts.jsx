import { useEffect, useState } from 'react';
import api from '../../api/axios';

const empty = { name: '', description: '', price: '', packSize: '', category: 'plates' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/products/admin/all').then((res) => setProducts(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post('/products', payload);
    }
    setForm(empty);
    setEditingId(null);
    load();
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, packSize: p.packSize, category: p.category });
  };

  const toggleActive = async (p) => {
    await api.put(`/products/${p._id}`, { isActive: !p.isActive });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-bran-brown mb-6">Products</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-bran-brown/10 rounded-2xl p-6 mb-8 grid sm:grid-cols-2 gap-4">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input placeholder="Pack Size (e.g. Pack of 25)" value={form.packSize} onChange={(e) => setForm({ ...form, packSize: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2 sm:col-span-2" rows={2} />
        <div className="sm:col-span-2 flex gap-3">
          <button className="bg-bran-brown text-cream px-6 py-2 rounded-full font-semibold">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="text-bran-brown/60 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p._id} className="bg-white border border-bran-brown/10 rounded-xl p-4 flex justify-between items-center flex-wrap gap-3">
            <div>
              <p className="font-semibold text-bran-brown">{p.name} {!p.isActive && <span className="text-red-500 text-xs">(inactive)</span>}</p>
              <p className="text-sm text-bran-brown/60">{p.packSize} — ₹{p.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-sm px-4 py-1.5 border border-bran-brown/20 rounded-full">Edit / Price</button>
              <button onClick={() => toggleActive(p)} className="text-sm px-4 py-1.5 border border-bran-brown/20 rounded-full">
                {p.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => remove(p._id)} className="text-sm px-4 py-1.5 border border-red-300 text-red-500 rounded-full">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
