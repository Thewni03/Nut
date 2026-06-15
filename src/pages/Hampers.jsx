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
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, Modal, Field, Button } from '../components/ui';
import ImageUploader from '../components/ImageUploader';
import { formatPrice } from '../utils/format';

const BOX_SIZES = ['small', 'medium', 'large'];

export default function Hampers() {
  const { token } = useAuth();
  const [hampers, setHampers] = useState([]);
  const [products, setProducts] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.getHampers(token), api.getProducts(token), api.getOccasions()])
      .then(([hampersData, productsData, occasionsData]) => {
        setHampers(hampersData);
        setProducts(productsData);
        setOccasions(occasionsData);
      })
      .catch(() => setError('Could not load hampers right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this hamper? This cannot be undone.')) return;
    try {
      await api.deleteHamper(token, id);
      setHampers((prev) => prev.filter((h) => h.id !== id));
    } catch {
      alert('Could not delete this hamper. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-walnut">Hampers</h1>
        <Button onClick={() => setEditing({})}>+ Add hamper</Button>
      </div>

      {loading && <p className="text-walnut/60 text-center py-12">Loading hampers…</p>}
      {error && <p className="text-walnut/60 text-center py-12">{error}</p>}

      {!loading && !error && (
        hampers.length === 0 ? (
          <Card className="p-12 text-center text-walnut/50">No hampers yet.</Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hampers.map((hamper) => (
              <Card key={hamper.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-sage/10 flex items-center justify-center">
                  {hamper.imageUrl
                    ? <img src={hamper.imageUrl} alt={hamper.name} className="w-full h-full object-cover" />
                    : <span className="text-walnut/20 text-sm">No image</span>
                  }
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg text-walnut leading-snug">{hamper.name}</h3>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {hamper.featured && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-brass/20 text-brass-dark">Featured</span>}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${hamper.active ? 'bg-sage/20 text-sage-dark' : 'bg-walnut/10 text-walnut/50'}`}>
                        {hamper.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  {hamper.occasion && <p className="text-xs uppercase tracking-wide text-sage-dark mb-2">{hamper.occasion}</p>}
                  {hamper.description && <p className="text-sm text-walnut/60 leading-relaxed mb-3 line-clamp-2">{hamper.description}</p>}
                  <ul className="text-xs text-walnut/55 space-y-0.5 mb-4">
                    {(hamper.items || []).slice(0, 4).map((item, idx) => (
                      <li key={idx}>{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</li>
                    ))}
                    {(hamper.items || []).length > 4 && <li className="text-sage-dark">+ {hamper.items.length - 4} more</li>}
                  </ul>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-display text-lg text-walnut">{formatPrice(hamper.price)}</span>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setEditing(hamper)} className="text-sage-dark hover:text-walnut font-medium text-sm transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(hamper.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {editing !== null && (
        <HamperFormModal
          hamper={editing}
          products={products}
          occasions={occasions}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            if (isNew) setHampers((prev) => [...prev, saved]);
            else setHampers((prev) => prev.map((h) => (h.id === saved.id ? saved : h)));
            setEditing(null);
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
function HamperFormModal({ hamper, products, occasions, onClose, onSaved }) {
  const { token } = useAuth();
  const isNew = !hamper.id;
  const [form, setForm] = useState({
    name: hamper.name ?? '',
    description: hamper.description ?? '',
    occasion: hamper.occasion ?? '',
    targetAudience: hamper.targetAudience ?? '',
    price: hamper.price ?? '',
    estimatedCost: hamper.estimatedCost ?? '',
    boxSize: hamper.boxSize ?? '',
    active: hamper.active ?? true,
    featured: hamper.featured ?? false,
  });
  const [items, setItems] = useState(hamper.items ? [...hamper.items] : []);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedHamper, setSavedHamper] = useState(hamper.id ? hamper : null);
  const [useCustomOccasion, setUseCustomOccasion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSelected = async (file) => {
    if (savedHamper?.id) {
      setUploadingImage(true);
      try {
        const result = await api.uploadHamperImage(token, savedHamper.id, file);
        setSavedHamper((prev) => ({ ...prev, imageUrl: result.imageUrl }));
      } catch {
        alert('Image upload failed. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    } else {
      setPendingImageFile(file);
    }
  };

  const addItemRow = () => setItems((prev) => [...prev, { productId: '', name: '', quantity: 1 }]);

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        next[index] = { ...next[index], productId: value, name: product ? product.name : next[index].name };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      estimatedCost: Number(form.estimatedCost) || 0,
      imageUrl: savedHamper?.imageUrl ?? null,
      items: items.filter((it) => it.name).map((it) => ({
        productId: it.productId || null,
        name: it.name,
        quantity: Number(it.quantity) || 1,
      })),
    };

    try {
      const saved = isNew
        ? await api.createHamper(token, payload)
        : await api.updateHamper(token, hamper.id, payload);

      let finalHamper = saved;
      if (pendingImageFile && saved.id) {
        setUploadingImage(true);
        try {
          const imgResult = await api.uploadHamperImage(token, saved.id, pendingImageFile);
          finalHamper = { ...saved, imageUrl: imgResult.imageUrl };
        } catch {
          alert('Hamper saved, but image upload failed. You can re-upload from the edit form.');
        } finally {
          setUploadingImage(false);
        }
      }

      onSaved(finalHamper, isNew);
    } catch {
      setError('Could not save this hamper. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isNew ? 'Add hamper' : 'Edit hamper'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader
          currentImage={savedHamper?.imageUrl ?? null}
          onUpload={handleImageSelected}
          uploading={uploadingImage}
          label="Hamper image"
        />

        <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Field label="Description (optional)" name="description" value={form.description} onChange={handleChange} as="textarea" />

        <div className="grid sm:grid-cols-2 gap-4">
          {useCustomOccasion || occasions.length === 0 ? (
            <Field label="Occasion" name="occasion" value={form.occasion} onChange={handleChange} placeholder="e.g. Birthday" />
          ) : (
            <div>
              <Field label="Occasion" name="occasion" as="select" value={form.occasion} onChange={handleChange} options={occasions} />
              <button type="button" onClick={() => setUseCustomOccasion(true)} className="mt-1.5 text-xs text-sage-dark hover:text-walnut transition-colors">+ Use a new occasion</button>
            </div>
          )}
          <Field label="Target audience (optional)" name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="e.g. Mom" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Selling price (Rs.)" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          <Field label="Estimated cost (Rs.)" name="estimatedCost" type="number" step="0.01" value={form.estimatedCost} onChange={handleChange} />
          <Field label="Box size" name="boxSize" as="select" value={form.boxSize} onChange={handleChange} options={BOX_SIZES} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-walnut/80">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="rounded border-walnut/30" />
            Active (visible on site)
          </label>
          <label className="flex items-center gap-2 text-sm text-walnut/80">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded border-walnut/30" />
            Featured on homepage
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-walnut/80">Items in this hamper</label>
            <button type="button" onClick={addItemRow} className="text-xs text-sage-dark hover:text-walnut font-medium transition-colors">+ Add item</button>
          </div>
          {items.length === 0 && <p className="text-sm text-walnut/45 italic">No items yet — add at least one.</p>}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <select
                    value={item.productId || ''}
                    onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm"
                  >
                    <option value="">Choose a product…</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    placeholder="Display name"
                    className="w-full px-3 py-2 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm"
                  />
                </div>
                <div className="w-16">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-walnut/15 text-walnut/50 hover:border-red-300 hover:text-red-600 transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving || uploadingImage}>
            {saving ? 'Saving…' : uploadingImage ? 'Uploading image…' : 'Save hamper'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
