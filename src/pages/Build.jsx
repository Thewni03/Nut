import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Cupboard, { Shelf } from '../components/Cupboard';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const BOX_SIZES = [
  { id: 'small', label: 'Small box', description: 'Perfect for a quick thank-you or token gift.' },
  { id: 'medium', label: 'Medium box', description: 'Our most popular size — fits 4 to 6 items comfortably.' },
  { id: 'large', label: 'Large box', description: 'For when the occasion calls for something generous.' },
];

export default function Build() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boxSize, setBoxSize] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState({}); // productId -> quantity
  const [hamperName, setHamperName] = useState('');
  const [note, setNote] = useState('');
  const { addCustomHamper } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getCustomBuilderProducts(), api.getProductCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch(() => setError('Could not load items right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  const productsById = useMemo(() => {
    const map = {};
    for (const p of products) map[p.id] = p;
    return map;
  }, [products]);

  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({
        productId,
        name: productsById[productId]?.name || 'Item',
        sellingPrice: productsById[productId]?.sellingPrice || 0,
        quantity: qty,
      }));
  }, [selections, productsById]);

  const total = selectedItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const adjustQuantity = (productId, delta) => {
    setSelections((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = () => {
    if (selectedItems.length === 0) return;
    addCustomHamper(selectedItems, boxSize?.id, hamperName.trim() || 'Custom Hamper', note.trim());
    navigate('/cart');
  };

  const groupedByCategory = categories
    .map((category) => ({
      category,
      items: products.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-sage-dark font-medium mb-3">Make it personal</p>
        <h1 className="font-display text-3xl sm:text-4xl text-walnut">Build your own hamper</h1>
        <p className="mt-3 text-walnut/65 max-w-lg mx-auto">
          Choose a box size, then open the cupboard to pick exactly what goes inside.
        </p>
      </div>

      {/* Step 1: box size */}
      <div className="mb-12">
        <h2 className="font-display text-xl text-walnut mb-4 text-center">1. Choose your box size</h2>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {BOX_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setBoxSize(size)}
              className={`text-left p-5 rounded-2xl border transition-colors ${
                boxSize?.id === size.id
                  ? 'border-sage bg-sage/10'
                  : 'border-walnut/10 bg-almond-light hover:border-sage/40'
              }`}
            >
              <p className="font-display text-lg text-walnut mb-1">{size.label}</p>
              <p className="text-sm text-walnut/60 leading-relaxed">{size.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: cupboard */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-walnut mb-4 text-center">2. Choose what goes inside</h2>

        {loading && <p className="text-center text-walnut/60">Loading items…</p>}
        {error && <p className="text-center text-walnut/60">{error}</p>}

        {!loading && !error && (
          <div className={!boxSize ? 'opacity-50 pointer-events-none' : ''}>
            <Cupboard
              title="The ingredient cupboard"
              subtitle="Shelved by category — add as many or as few items as you like."
              isOpen={isOpen}
              onOpen={() => boxSize && setIsOpen(true)}
              onClose={() => setIsOpen(false)}
            >
              {groupedByCategory.map(({ category, items }) => (
                <Shelf key={category} label={category}>
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={selections[product.id] || 0}
                      onAdd={() => adjustQuantity(product.id, 1)}
                      onRemove={() => adjustQuantity(product.id, -1)}
                    />
                  ))}
                </Shelf>
              ))}
            </Cupboard>
            {!boxSize && (
              <p className="text-center text-sm text-walnut/50 mt-3">
                Choose a box size above to unlock the cupboard.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Step 3: review selections */}
      {totalCount > 0 && (
        <div className="mt-12 max-w-2xl mx-auto bg-almond-light rounded-3xl border border-walnut/10 shadow-card p-6 sm:p-8">
          <h2 className="font-display text-xl text-walnut mb-4">3. Review your hamper</h2>

          <ul className="space-y-2 mb-5">
            {selectedItems.map((item) => (
              <li key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-walnut/80">
                  {item.name} {item.quantity > 1 ? `× ${item.quantity}` : ''}
                </span>
                <span className="text-walnut font-medium">{formatPrice(item.sellingPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-walnut/10 pt-4 mb-5 flex items-center justify-between">
            <span className="font-display text-lg text-walnut">Total</span>
            <span className="font-display text-2xl text-walnut">{formatPrice(total)}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="hamper-name" className="block text-sm font-medium text-walnut/80 mb-1.5">
                Name your hamper (optional)
              </label>
              <input
                id="hamper-name"
                type="text"
                value={hamperName}
                onChange={(e) => setHamperName(e.target.value)}
                placeholder="e.g. For Amma"
                className="w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond focus:outline-none focus:border-sage text-sm"
              />
            </div>
            <div>
              <label htmlFor="hamper-note" className="block text-sm font-medium text-walnut/80 mb-1.5">
                Note for us (optional)
              </label>
              <input
                id="hamper-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Please wrap in pink ribbon"
                className="w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond focus:outline-none focus:border-sage text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors"
          >
            Add this hamper to cart
          </button>
        </div>
      )}
    </div>
  );
}
