import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [contact, setContact] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');

  const loadAll = () => {
    api.get('/settings/contact').then((res) => setContact(res.data));
    api.get('/admin/auth/admins').then((res) => setAdmins(res.data));
  };
  useEffect(loadAll, []);

  const saveContact = async (e) => {
    e.preventDefault();
    await api.put('/settings/contact', contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    setInviteMsg('');
    try {
      const { data } = await api.post('/admin/auth/admins', { email: newEmail });
      setInviteMsg(data.message);
      setNewEmail('');
      loadAll();
    } catch (err) {
      setInviteMsg(err.response?.data?.message || 'Failed to add admin');
    }
  };

  const revokeAdmin = async (id) => {
    if (!confirm('Revoke this admin\u2019s access?')) return;
    await api.delete(`/admin/auth/admins/${id}`);
    loadAll();
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-bran-brown mb-6">Contact Info</h1>
        {contact && (
          <form onSubmit={saveContact} className="bg-white border border-bran-brown/10 rounded-2xl p-6 max-w-lg space-y-3">
            {['phone', 'email', 'address', 'businessHours'].map((field) => (
              <input
                key={field}
                value={contact[field] || ''}
                onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                placeholder={field}
                className="w-full border border-bran-brown/20 rounded-xl px-4 py-2"
              />
            ))}
            <button className="bg-bran-brown text-cream px-6 py-2 rounded-full font-semibold">Save</button>
            {saved && <span className="text-leaf-green text-sm ml-3">Saved!</span>}
          </form>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-bran-brown mb-4">Admin Access</h2>
        <p className="text-sm text-bran-brown/60 mb-4">Add a Gmail address here, then they can set a password at /admin/signup.</p>
        <form onSubmit={addAdmin} className="flex gap-3 max-w-lg mb-4">
          <input
            type="email"
            required
            placeholder="newadmin@gmail.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 border border-bran-brown/20 rounded-xl px-4 py-2"
          />
          <button className="bg-leaf-green text-white px-6 py-2 rounded-full font-semibold">Add Admin</button>
        </form>
        {inviteMsg && <p className="text-sm text-bran-brown/70 mb-4">{inviteMsg}</p>}

        <div className="space-y-2 max-w-lg">
          {admins.map((a) => (
            <div key={a._id} className="flex justify-between items-center bg-white border border-bran-brown/10 rounded-xl px-4 py-2">
              <span className="text-sm text-bran-brown">
                {a.email} {a.email === admin?.email && <span className="text-xs text-leaf-green">(you)</span>} {!a.isActive && <span className="text-xs text-red-500">(revoked)</span>}
              </span>
              {a.isActive && a.email !== admin?.email && (
                <button onClick={() => revokeAdmin(a._id)} className="text-xs text-red-500">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
