import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { formatPrice } from '../utils/format';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    city: '',
    deliveryDate: '',
    customerNote: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  if (items.length === 0 && !orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-walnut mb-3">Nothing to check out yet</h1>
        <p className="text-walnut/65 mb-8">Add a hamper to your cart first.</p>
        <Link
          to="/hampers"
          className="inline-block px-6 py-3 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors"
        >
          Browse hampers
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const orderItems = items.map((item) => {
      if (item.type === 'HAMPER') {
        return {
          type: 'HAMPER',
          hamperId: item.hamperId,
          quantity: item.quantity,
        };
      }
      return {
        type: 'CUSTOM',
        name: item.name,
        boxSize: item.boxSize,
        quantity: item.quantity,
        note: item.note,
        customItems: item.contents.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
      };
    });

    try {
      const result = await api.placeOrder({
        ...form,
        items: orderItems,
      });
      setOrderResult(result);
      clearCart();
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return <OrderConfirmation result={orderResult} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl text-walnut mb-2 text-center">Checkout</h1>
      <p className="text-center text-walnut/65 mb-10 max-w-md mx-auto">
        Fill in your details below. We don't take payment online — once you submit,
        we'll prepare a WhatsApp message with your order for you to send to us.
      </p>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <form onSubmit={handleSubmit} className="space-y-5 bg-almond-light rounded-3xl border border-walnut/10 shadow-card p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" name="customerName" value={form.customerName} onChange={handleChange} required />
            <Field label="Phone number" name="customerPhone" value={form.customerPhone} onChange={handleChange} required type="tel" placeholder="07X XXX XXXX" />
          </div>

          <Field label="Email (optional)" name="customerEmail" value={form.customerEmail} onChange={handleChange} type="email" />

          <Field label="Delivery address" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} required as="textarea" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
            <Field label="Preferred delivery date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} type="date" />
          </div>

          <Field label="Anything else we should know? (optional)" name="customerNote" value={form.customerNote} onChange={handleChange} as="textarea" />

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors disabled:opacity-60"
          >
            {submitting ? 'Placing your order…' : 'Place order'}
          </button>
        </form>

        {/* Order summary sidebar */}
        <div className="bg-almond-light rounded-3xl border border-walnut/10 shadow-card p-6 sm:p-8 h-fit">
          <h2 className="font-display text-lg text-walnut mb-4">Order summary</h2>
          <ul className="space-y-3 mb-5">
            {items.map((item) => (
              <li key={item.lineId} className="flex justify-between text-sm">
                <span className="text-walnut/75">
                  {item.name}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                </span>
                <span className="text-walnut font-medium shrink-0 ml-2">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-walnut/10 pt-4 flex items-center justify-between">
            <span className="font-display text-lg text-walnut">Total</span>
            <span className="font-display text-xl text-walnut">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, as = 'input', placeholder }) {
  const baseClasses = 'w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond focus:outline-none focus:border-sage text-sm';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-walnut/80 mb-1.5">
        {label}{required && <span className="text-sage-dark"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          placeholder={placeholder}
          className={baseClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

function OrderConfirmation({ result }) {
  const { order, whatsappMessage, whatsappLink } = result;

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-sage-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="font-display text-3xl text-walnut mb-2">Order received!</h1>
      <p className="text-walnut/65 mb-1">Order reference</p>
      <p className="font-display text-xl text-walnut mb-6">{order.orderNumber}</p>

      <p className="text-walnut/70 leading-relaxed mb-8 max-w-md mx-auto">
        One last step — send us your order details over WhatsApp so we can confirm
        availability, delivery and payment with you directly.
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sage text-walnut-dark font-medium hover:bg-sage-dark hover:text-almond-light transition-colors"
      >
        <WhatsAppIcon />
        Send order via WhatsApp
      </a>

      <details className="mt-8 text-left max-w-md mx-auto">
        <summary className="cursor-pointer text-sm text-sage-dark font-medium">
          Preview message
        </summary>
        <pre className="mt-3 whitespace-pre-wrap text-xs text-walnut/70 bg-almond-light border border-walnut/10 rounded-2xl p-4 leading-relaxed">
          {whatsappMessage}
        </pre>
      </details>

      <div className="mt-10">
        <Link to="/" className="text-sm font-medium text-sage-dark hover:text-walnut transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.93.55 3.74 1.5 5.27L2 22l4.97-1.6a9.86 9.86 0 0 0 5.07 1.39c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.07c-1.6 0-3.13-.43-4.46-1.23l-.32-.19-3.31 1.06 1.08-3.22-.21-.33a8.13 8.13 0 0 1-1.25-4.32c0-4.5 3.66-8.16 8.17-8.16 4.5 0 8.16 3.66 8.16 8.16s-3.66 8.23-8.16 8.23zm4.48-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.96-.14.17-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.21-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.39.11-.51.12-.12.27-.31.4-.46.13-.16.17-.27.26-.45.08-.18.04-.33-.04-.46-.08-.13-.51-1.22-.7-1.67-.18-.43-.37-.37-.51-.38h-.43c-.15 0-.39.06-.6.29-.2.23-.78.77-.78 1.86s.8 2.16.91 2.31c.12.15 1.6 2.45 3.89 3.34 1.93.75 2.32.6 2.74.56.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .13-1.09-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}
