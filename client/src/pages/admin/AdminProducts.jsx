import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BRANNECO_GROUPS } from '../../catalogue-data';

const empty = { sku: '', name: '', description: '', price: '', exportPrice: '', diameterOrSize: '', material: 'Areca leaf', packSize: '', category: 'areca-round', images: [] };

const readImageFile = (file) => new Promise((resolve, reject) => {
  if (!file?.type.startsWith('image/')) return reject(new Error('Please select an image file.'));
  if (file.size > 5 * 1024 * 1024) return reject(new Error('Image must be 5 MB or smaller.'));

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.76));
    };
    image.onerror = () => reject(new Error('Could not process the selected image.'));
    image.src = reader.result;
  };
  reader.onerror = () => reject(new Error('Could not read the selected image.'));
  reader.readAsDataURL(file);
});

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [imageError, setImageError] = useState('');

  const load = () => api.get('/products/admin/all').then((res) => setProducts(res.data.products || res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), exportPrice: Number(form.exportPrice) || Number(form.price) / 83, images: form.images || [] };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post('/products', payload);
    }
    setForm(empty);
    setEditingId(null);
    setImageError('');
    load();
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setImageError('');
      const room = Math.max(0, 5 - (form.images?.length || 0));
      if (!room) throw new Error('A product can have up to 5 images. Remove an image before adding more.');
      const images = await Promise.all(files.slice(0, room).map(readImageFile));
      setForm((current) => ({ ...current, images: [...(current.images || []), ...images] }));
    } catch (error) {
      setImageError(error.message || 'Could not add image.');
    }
    e.target.value = '';
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ sku: p.sku || p.id || '', name: p.name, description: p.description, price: p.price, exportPrice: p.exportPrice || '', diameterOrSize: p.diameterOrSize || '', material: p.material || 'Areca leaf', packSize: p.packSize || '', category: p.category, images: p.images?.length ? p.images : [p.image].filter((image) => image && image !== '/plate.svg') });
  };

  const toggleActive = async (p) => {
    await api.put(`/products/${p._id}`, { inStock: !p.inStock });
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
        <input required placeholder="SKU (e.g. AL-RP-10)" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input type="number" step="0.001" placeholder="Export price (USD / piece)" value={form.exportPrice} onChange={(e) => setForm({ ...form, exportPrice: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input placeholder="Size (e.g. 10 in / 750 ml)" value={form.diameterOrSize} onChange={(e) => setForm({ ...form, diameterOrSize: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input placeholder="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <input placeholder="Pack Size / label" value={form.packSize} onChange={(e) => setForm({ ...form, packSize: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2">
          {form.category && !BRANNECO_GROUPS.some((group) => group.id === form.category) && <option value={form.category}>{form.category}</option>}
          {BRANNECO_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
        </select>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-bran-brown/20 rounded-xl px-4 py-2 sm:col-span-2" rows={2} />
        <div className="sm:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {form.images?.length ? form.images.map((image, index) => (
              <div key={`${index}-${image.slice(0, 24)}`} className="relative">
                <img src={image} alt={`Product preview ${index + 1}`} className="w-16 h-16 rounded-xl object-cover border border-bran-brown/20 p-1" />
                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, imageIndex) => imageIndex !== index) })} aria-label={`Remove image ${index + 1}`} className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs">×</button>
              </div>
            )) : <div className="w-16 h-16 rounded-xl border border-dashed border-bran-brown/30 flex items-center justify-center text-xs text-bran-brown/50">No image</div>}
          <label className="cursor-pointer bg-cream text-bran-brown border border-bran-brown/20 px-4 py-2 rounded-full font-semibold text-sm">
            Add Images
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleImageChange} />
          </label>
            <span className="text-xs text-bran-brown/50">{form.images?.length || 0}/5 · PNG, JPG or WEBP · max 5 MB each</span>
          </div>
        </div>
        {imageError && <p className="sm:col-span-2 text-sm text-red-500">{imageError}</p>}
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
            <div className="flex items-center gap-3">
              {(p.images?.[0] || p.image) && <img src={p.images?.[0] || p.image} alt="" className="w-12 h-12 rounded-lg object-contain border border-bran-brown/10 p-1" />}
              <div>
              <p className="font-semibold text-bran-brown">{p.name} {p.inStock === false && <span className="text-red-500 text-xs">(out of stock)</span>}</p>
              <p className="text-sm text-bran-brown/60">{p.sku} · {p.diameterOrSize || p.packSize} — ₹{p.price}</p>
            </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-sm px-4 py-1.5 border border-bran-brown/20 rounded-full">Edit / Price</button>
              <button onClick={() => toggleActive(p)} className="text-sm px-4 py-1.5 border border-bran-brown/20 rounded-full">
                {p.inStock === false ? 'Mark in stock' : 'Mark out of stock'}
              </button>
              <button onClick={() => remove(p._id)} className="text-sm px-4 py-1.5 border border-red-300 text-red-500 rounded-full">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
