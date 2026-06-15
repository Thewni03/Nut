import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, StatusBadge, Modal, Field, Button } from '../components/ui';
import { formatPrice } from '../utils/format';

const STATUS_OPTIONS = ['NEW', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getOrders(token, statusFilter)
      .then(setOrders)
      .catch(() => setError('Could not load orders right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter]);

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-walnut">Orders</h1>

        <div className="flex gap-2 flex-wrap">
          <FilterPill label="All" active={statusFilter === ''} onClick={() => setStatusFilter('')} />
          {STATUS_OPTIONS.map((status) => (
            <FilterPill
              key={status}
              label={status.replace(/_/g, ' ')}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </div>
      </div>

      {loading && <p className="text-walnut/60 text-center py-12">Loading orders…</p>}
      {error && <p className="text-walnut/60 text-center py-12">{error}</p>}

      {!loading && !error && (
        sortedOrders.length === 0 ? (
          <Card className="p-12 text-center text-walnut/50">No orders found.</Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-walnut/10 text-left text-walnut/50 uppercase text-xs tracking-wide">
                    <th className="px-5 py-3 font-medium">Order #</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-walnut/5 last:border-0 hover:bg-almond/60 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-walnut whitespace-nowrap">{order.orderNumber}</td>
                      <td className="px-5 py-3.5 text-walnut/80">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-walnut/50">{order.customerPhone}</div>
                      </td>
                      <td className="px-5 py-3.5 text-walnut/60 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-3.5 text-walnut font-medium whitespace-nowrap">{formatPrice(order.totalAmount)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-sage-dark hover:text-walnut font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={(updated) => {
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            setSelectedOrder(updated);
          }}
        />
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active ? 'bg-walnut text-almond-light border-walnut' : 'border-walnut/15 text-walnut/60 hover:border-sage'
      }`}
    >
      {label}
    </button>
  );
}

function OrderDetailModal({ order, onClose, onUpdated }) {
  const { token } = useAuth();
  const [status, setStatus] = useState(order.status);
  const [adminNote, setAdminNote] = useState(order.adminNote || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateOrderStatus(token, order.id, status, adminNote);
      onUpdated(updated);
    } catch {
      setError('Could not update the order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={`Order ${order.orderNumber}`} onClose={onClose} wide>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Customer" value={order.customerName} />
          <InfoRow label="Phone" value={order.customerPhone} />
          {order.customerEmail && <InfoRow label="Email" value={order.customerEmail} />}
          {order.city && <InfoRow label="City" value={order.city} />}
          <InfoRow label="Delivery address" value={order.deliveryAddress} className="sm:col-span-2" />
          {order.deliveryDate && <InfoRow label="Requested delivery date" value={order.deliveryDate} />}
          <InfoRow label="Placed on" value={formatDate(order.createdAt)} />
        </div>

        <div>
          <h3 className="font-display text-base text-walnut mb-2">Items</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="bg-almond rounded-xl border border-walnut/10 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-walnut">
                    {item.name}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    {item.boxSize ? ` (${item.boxSize} box)` : ''}
                  </span>
                  <span className="text-walnut font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
                {item.customItems && item.customItems.length > 0 && (
                  <ul className="mt-2 text-xs text-walnut/60 space-y-0.5">
                    {item.customItems.map((ci, i) => (
                      <li key={i}>{ci.name}{ci.quantity > 1 ? ` × ${ci.quantity}` : ''}</li>
                    ))}
                  </ul>
                )}
                {item.note && <p className="mt-2 text-xs text-walnut/50 italic">Note: {item.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {order.customerNote && (
          <div>
            <h3 className="font-display text-base text-walnut mb-1">Customer note</h3>
            <p className="text-sm text-walnut/70 bg-almond rounded-xl border border-walnut/10 p-3">{order.customerNote}</p>
          </div>
        )}

        <div className="border-t border-walnut/10 pt-4 flex items-center justify-between">
          <span className="font-display text-lg text-walnut">Total</span>
          <span className="font-display text-xl text-walnut">{formatPrice(order.totalAmount)}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Status"
            name="status"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Field
            label="Internal note (optional)"
            name="adminNote"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wide text-walnut/45 mb-0.5">{label}</p>
      <p className="text-walnut">{value}</p>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' });
}
