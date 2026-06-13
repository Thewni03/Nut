import { formatPrice } from '../utils/format';

/**
 * A single product card shown on a shelf inside the custom builder cupboard.
 * Shows name, price, and an add/remove control with the current quantity.
 */
export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <div className="flex flex-col shrink-0 w-36 sm:w-40 bg-almond-light rounded-xl border border-walnut/10 shadow-card overflow-hidden">
      <div className="aspect-square bg-sage/15 flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ProductPlaceholderIcon />
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-sm font-medium text-walnut leading-snug line-clamp-2">{product.name}</p>
        <p className="text-xs text-sage-dark font-semibold">{formatPrice(product.sellingPrice)}</p>

        <div className="mt-auto pt-1">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-walnut/5 rounded-full px-1 py-1">
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove one ${product.name}`}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-walnut text-almond-light text-sm font-semibold hover:bg-sage transition-colors"
              >
                −
              </button>
              <span className="text-sm font-semibold text-walnut">{quantity}</span>
              <button
                type="button"
                onClick={onAdd}
                aria-label={`Add another ${product.name}`}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-walnut text-almond-light text-sm font-semibold hover:bg-sage transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="w-full py-1.5 rounded-full bg-walnut/10 text-walnut text-xs font-medium hover:bg-sage hover:text-almond-light transition-colors"
            >
              Add to box
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductPlaceholderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sage-dark/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="1.5" />
      <path d="M3 8 5 3h14l2 5" />
      <path d="M12 12v5M9.5 14.5h5" />
    </svg>
  );
}
