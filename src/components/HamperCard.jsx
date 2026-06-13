import { formatPrice } from '../utils/format';

/**
 * A card for a pre-built hamper, shown on shelves in the hampers cupboard
 * and on the homepage / hampers listing page.
 */
export default function HamperCard({ hamper, onAdd, onViewDetails, compact = false }) {
  return (
    <div
      className={`flex flex-col shrink-0 bg-almond-light rounded-2xl border border-walnut/10 shadow-card overflow-hidden ${
        compact ? 'w-56' : 'w-full'
      }`}
    >
      <div className="aspect-[4/3] bg-sage/15 flex items-center justify-center relative">
        {hamper.imageUrl ? (
          <img src={hamper.imageUrl} alt={hamper.name} className="w-full h-full object-cover" />
        ) : (
          <HamperPlaceholderIcon />
        )}
        {hamper.occasion && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-walnut/90 text-almond-light text-[11px] font-medium uppercase tracking-wide">
            {hamper.occasion}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg text-walnut leading-snug">{hamper.name}</h3>
        {hamper.description && (
          <p className="text-sm text-walnut/65 leading-relaxed line-clamp-2">{hamper.description}</p>
        )}

        {hamper.items && hamper.items.length > 0 && (
          <ul className="text-xs text-walnut/60 mt-1 space-y-0.5">
            {hamper.items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-sage shrink-0" />
                {item.name}
              </li>
            ))}
            {hamper.items.length > 3 && (
              <li className="text-sage-dark">+ {hamper.items.length - 3} more</li>
            )}
          </ul>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-semibold text-walnut">{formatPrice(hamper.price)}</span>
          <div className="flex gap-2">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(hamper)}
                className="px-3 py-2 rounded-full text-xs font-medium text-walnut border border-walnut/20 hover:border-sage hover:text-sage-dark transition-colors"
              >
                Details
              </button>
            )}
            {onAdd && (
              <button
                type="button"
                onClick={() => onAdd(hamper)}
                className="px-4 py-2 rounded-full bg-walnut text-almond-light text-xs font-medium hover:bg-sage transition-colors"
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HamperPlaceholderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-sage-dark/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <path d="M12 7v14M7.5 7a2.5 2.5 0 0 1 0-5C10 2 12 7 12 7s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
