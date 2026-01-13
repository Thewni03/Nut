import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card } from '../components/ui';
import { formatPrice } from '../utils/format';

export default function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getCustomers(token)
      .then(setCustomers)
      .catch(() => setError('Could not load customers right now.'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = customers
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
    })
    .sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-walnut">Customers</h1>
        <input
          type="text"
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm min-w-[220px]"
        />
      </div>

      {loading && <p className="text-walnut/60 text-center py-12">Loading customers…</p>}
      {error && <p className="text-walnut/60 text-center py-12">{error}</p>}

      {!loading && !error && (
        filtered.length === 0 ? (
          <Card className="p-12 text-center text-walnut/50">No customers yet.</Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-walnut/10 text-left text-walnut/50 uppercase text-xs tracking-wide">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">City</th>
                    <th className="px-5 py-3 font-medium">Orders</th>
                    <th className="px-5 py-3 font-medium">Total spent</th>
                    <th className="px-5 py-3 font-medium">Last order</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-walnut/5 last:border-0 hover:bg-almond/60 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-walnut">{c.name || '—'}</td>
                      <td className="px-5 py-3.5 text-walnut/70">{c.phone}</td>
                      <td className="px-5 py-3.5 text-walnut/60">{c.city || '—'}</td>
                      <td className="px-5 py-3.5 text-walnut/70">{c.totalOrders}</td>
                      <td className="px-5 py-3.5 text-walnut font-medium">{formatPrice(c.totalSpent)}</td>
                      <td className="px-5 py-3.5 text-walnut/60 whitespace-nowrap">{formatDate(c.lastOrderAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-LK', { dateStyle: 'medium' });
}
