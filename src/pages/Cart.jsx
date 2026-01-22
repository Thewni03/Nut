import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-walnut mb-3">Your cart is empty</h1>
        <p className="text-walnut/65 mb-8">
          Browse our hampers or build your own to get started.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/hampers"
            className="px-6 py-3 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors"
          >
            Browse hampers
          </Link>
          <Link
            to="/build"
            className="px-6 py-3 rounded-full border border-walnut/20 text-walnut font-medium hover:border-sage hover:text-sage-dark transition-colors"
          >
            Build your own
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl text-walnut mb-8 text-center">Your cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.lineId} className="flex gap-4 bg-almond-light rounded-2xl border border-walnut/10 shadow-card p-4 sm:p-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="font-display text-2xl text-sage-dark/40">N</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-walnut leading-snug">{item.name}</h3>
                  {item.boxSize && (
                    <p className="text-xs uppercase tracking-wide text-sage-dark mt-0.5">{item.boxSize} box</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="text-walnut/40 hover:text-walnut transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {item.contents && item.contents.length > 0 && (
                <ul className="mt-2 text-xs text-walnut/55 space-y-0.5">
                  {item.contents.slice(0, 4).map((c, idx) => (
                    <li key={idx}>
                      {c.name}{c.quantity > 1 ? ` × ${c.quantity}` : ''}
                    </li>
                  ))}
                  {item.contents.length > 4 && <li>+ {item.contents.length - 4} more</li>}
                </ul>
              )}

              {item.note && (
                <p className="mt-2 text-xs text-walnut/55 italic">Note: {item.note}</p>
              )}

              <div className="mt-3 flex items-center justify-between">
                {item.type === 'HAMPER' ? (
                  <div className="flex items-center gap-2 bg-walnut/5 rounded-full px-1 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-walnut text-almond-light text-sm font-semibold hover:bg-sage transition-colors disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-walnut w-5 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-walnut text-almond-light text-sm font-semibold hover:bg-sage transition-colors"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-walnut/50">1 custom hamper</span>
                )}

                <span className="font-semibold text-walnut">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-almond-light rounded-2xl border border-walnut/10 shadow-card p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl text-walnut">Total</span>
          <span className="font-display text-2xl text-walnut">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="block w-full text-center py-4 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
