import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card } from '../components/ui';
import { formatPrice } from '../utils/format';

const STATUS_COLORS = {
  NEW: '#B8924F',
  CONFIRMED: '#8C9574',
  PREPARING: '#A8B091',
  OUT_FOR_DELIVERY: '#6B4F3F',
  DELIVERED: '#6E7659',
  CANCELLED: '#C97B63',
};

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getAnalytics(token)
      .then(setData)
      .catch(() => setError('Could not load analytics right now.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-walnut/60 text-center py-12">Loading dashboard…</p>;
  if (error) return <p className="text-walnut/60 text-center py-12">{error}</p>;
  if (!data) return null;

  const statusEntries = Object.entries(data.ordersByStatus || {});
  const popularityEntries = Object.entries(data.itemPopularity || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name: truncate(name, 18), count }));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-walnut">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total revenue" value={formatPrice(data.totalRevenue)} accent="brass" />
        <SummaryCard label="Total orders" value={data.totalOrders} accent="sage" />
        <SummaryCard label="Total customers" value={data.totalCustomers} accent="walnut" />
        <SummaryCard
          label="New orders"
          value={data.ordersByStatus?.NEW || 0}
          accent="brass"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by status pie chart */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-walnut mb-4">Orders by status</h2>
          {statusEntries.length === 0 ? (
            <EmptyState text="No orders yet." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusEntries.map(([status, count]) => ({ name: status.replace(/_/g, ' '), value: count, status }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusEntries.map(([status]) => (
                    <Cell key={status} fill={STATUS_COLORS[status] || '#8C9574'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Popular items bar chart */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-walnut mb-4">Most popular items</h2>
          {popularityEntries.length === 0 ? (
            <EmptyState text="No order data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={popularityEntries} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A352A" opacity={0.08} />
                <XAxis type="number" allowDecimals={false} stroke="#4A352A" fontSize={12} />
                <YAxis type="category" dataKey="name" width={120} stroke="#4A352A" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#8C9574" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  const accentClasses = {
    brass: 'text-brass-dark',
    sage: 'text-sage-dark',
    walnut: 'text-walnut',
  };

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-walnut/50 mb-2">{label}</p>
      <p className={`font-display text-2xl sm:text-3xl ${accentClasses[accent] || 'text-walnut'}`}>{value}</p>
    </Card>
  );
}

function EmptyState({ text }) {
  return (
    <div className="h-48 flex items-center justify-center text-sm text-walnut/50">
      {text}
    </div>
  );
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
