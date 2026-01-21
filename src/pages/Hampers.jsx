import { useEffect, useState } from 'react';
import api from '../utils/api';
import Cupboard, { Shelf } from '../components/Cupboard';
import HamperCard from '../components/HamperCard';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Hampers() {
  const [hampers, setHampers] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHamper, setSelectedHamper] = useState(null);
  const { addHamper } = useCart();

  useEffect(() => {
    Promise.all([api.getHampers(), api.getOccasions()])
      .then(([hampersData, occasionsData]) => {
        setHampers(hampersData);
        setOccasions(occasionsData);
      })
      .catch(() => setError('Could not load hampers right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  const groupedByOccasion = occasions.map((occasion) => ({
    occasion,
    items: hampers.filter((h) => h.occasion === occasion),
  })).filter((g) => g.items.length > 0);

  const ungrouped = hampers.filter((h) => !occasions.includes(h.occasion));

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-sage-dark font-medium mb-3">Ready to gift</p>
        <h1 className="font-display text-3xl sm:text-4xl text-walnut">Our hampers</h1>
        <p className="mt-3 text-walnut/65 max-w-lg mx-auto">
          Each hamper is packed and ready — open the cupboard to browse by occasion,
          or scroll down to see everything at a glance.
        </p>
      </div>

      {loading && <p className="text-center text-walnut/60">Loading hampers…</p>}
      {error && <p className="text-center text-walnut/60">{error}</p>}

      {!loading && !error && (
        <>
          <Cupboard
            title="The hamper cupboard"
            subtitle="Shelved by occasion — pick what fits the moment."
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
          >
            {groupedByOccasion.map(({ occasion, items }) => (
              <Shelf key={occasion} label={occasion}>
                {items.map((hamper) => (
                  <HamperCard
                    key={hamper.id}
                    hamper={hamper}
                    compact
                    onAdd={(h) => {
                      addHamper(h);
                      setIsOpen(false);
                    }}
                    onViewDetails={setSelectedHamper}
                  />
                ))}
              </Shelf>
            ))}

            {ungrouped.length > 0 && (
              <Shelf label="More hampers">
                {ungrouped.map((hamper) => (
                  <HamperCard
                    key={hamper.id}
                    hamper={hamper}
                    compact
                    onAdd={(h) => {
                      addHamper(h);
                      setIsOpen(false);
                    }}
                    onViewDetails={setSelectedHamper}
                  />
                ))}
              </Shelf>
            )}
          </Cupboard>

          {/* Full grid below the cupboard */}
          <div className="mt-16">
            <h2 className="font-display text-2xl text-walnut text-center mb-8">All hampers</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hampers.map((hamper) => (
                <HamperCard
                  key={hamper.id}
                  hamper={hamper}
                  onAdd={addHamper}
                  onViewDetails={setSelectedHamper}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Hamper details modal */}
      {selectedHamper && (
        <HamperDetailsModal
          hamper={selectedHamper}
          onClose={() => setSelectedHamper(null)}
          onAdd={(h) => {
            addHamper(h);
            setSelectedHamper(null);
          }}
        />
      )}
    </div>
  );
}

function HamperDetailsModal({ hamper, onClose, onAdd }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-walnut-dark/60 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-almond rounded-3xl shadow-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-sage/15 flex items-center justify-center">
          {hamper.imageUrl ? (
            <img src={hamper.imageUrl} alt={hamper.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-sage-dark/40 font-display text-5xl">N</div>
          )}
        </div>

        <div className="p-6">
          {hamper.occasion && (
            <p className="text-xs uppercase tracking-[0.2em] text-brass-dark font-medium mb-2">{hamper.occasion}</p>
          )}
          <h2 className="font-display text-2xl text-walnut mb-2">{hamper.name}</h2>
          {hamper.description && <p className="text-walnut/65 leading-relaxed mb-4">{hamper.description}</p>}

          {hamper.items && hamper.items.length > 0 && (
            <ul className="space-y-1.5 mb-5">
              {hamper.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-walnut/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
                  {item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ''}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-walnut">{formatPrice(hamper.price)}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-sm font-medium text-walnut border border-walnut/20 hover:border-sage transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onAdd(hamper)}
                className="px-5 py-2.5 rounded-full bg-walnut text-almond-light text-sm font-medium hover:bg-sage transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
