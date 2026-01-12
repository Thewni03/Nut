import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, Modal, Field, Button } from '../components/ui';
import ImageUploader from '../components/ImageUploader';
import { formatPrice } from '../utils/format';

export default function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.getProducts(token), api.getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch(() => setError('Could not load products right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const filtered = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.deleteProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Could not delete this product.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-walnut">Products</h1>
        <Button onClick={() => setEditing({})}>+ Add product</Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm flex-1 min-w-[180px]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p className="text-walnut/60 text-center py-12">Loading products…</p>}
      {error && <p className="text-walnut/60 text-center py-12">{error}</p>}

      {!loading && !error && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-walnut/10 text-left text-walnut/50 uppercase text-xs tracking-wide">
                  <th className="px-5 py-3 font-medium">Image</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Cost</th>
                  <th className="px-5 py-3 font-medium">Selling price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-walnut/5 last:border-0 hover:bg-almond/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage/10 flex items-center justify-center shrink-0">
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          : <span className="text-walnut/20 text-xs">No img</span>
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-walnut">{p.name}</td>
                    <td className="px-5 py-3.5 text-walnut/60">{p.category}</td>
                    <td className="px-5 py-3.5 text-walnut/60">{formatPrice(p.costPrice)}</td>
                    <td className="px-5 py-3.5 text-walnut font-medium">{formatPrice(p.sellingPrice)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-sage/20 text-sage-dark' : 'bg-walnut/10 text-walnut/50'}`}>
                        {p.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button type="button" onClick={() => setEditing(p)} className="text-sage-dark hover:text-walnut font-medium text-sm transition-colors mr-3">Edit</button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-walnut/50">No products match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {editing !== null && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            if (isNew) {
              setProducts((prev) => [...prev, saved]);
              if (saved.category && !categories.includes(saved.category)) {
                setCategories((prev) => [...prev, saved.category].sort());
              }
            } else {
              setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, categories, onClose, onSaved }) {
  const { token } = useAuth();
  const isNew = !product.id;
  const [form, setForm] = useState({
    name: product.name ?? '',
    description: product.description ?? '',
    category: product.category ?? '',
    costPrice: product.costPrice ?? '',
    sellingPrice: product.sellingPrice ?? '',
    stockQuantity: product.stockQuantity ?? '',
    active: product.active ?? true,
    availableForCustomBuilder: product.availableForCustomBuilder ?? true,
  });
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedProduct, setSavedProduct] = useState(product.id ? product : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle image selected — if product already exists, upload immediately
  // If new product, store file and upload after save
  const handleImageSelected = async (file) => {
    if (savedProduct?.id) {
      setUploadingImage(true);
      try {
        const result = await api.uploadProductImage(token, savedProduct.id, file);
        setSavedProduct((prev) => ({ ...prev, imageUrl: result.imageUrl }));
      } catch {
        alert('Image upload failed. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    } else {
      setPendingImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      costPrice: Number(form.costPrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      stockQuantity: form.stockQuantity === '' ? null : Number(form.stockQuantity),
      imageUrl: savedProduct?.imageUrl ?? null,
    };

    try {
      const saved = isNew
        ? await api.createProduct(token, payload)
        : await api.updateProduct(token, product.id, payload);

      // Upload pending image if this was a new product
      let finalProduct = saved;
      if (pendingImageFile && saved.id) {
        setUploadingImage(true);
        try {
          const imgResult = await api.uploadProductImage(token, saved.id, pendingImageFile);
          finalProduct = { ...saved, imageUrl: imgResult.imageUrl };
        } catch {
          // Image upload failed but product was saved — not critical
          alert('Product saved, but image upload failed. You can re-upload from the edit form.');
        } finally {
          setUploadingImage(false);
        }
      }

      onSaved(finalProduct, isNew);
    } catch {
      setError('Could not save this product. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentImage = savedProduct?.imageUrl ?? null;

  return (
    <Modal title={isNew ? 'Add product' : 'Edit product'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader
          currentImage={currentImage}
          onUpload={handleImageSelected}
          uploading={uploadingImage}
          label="Product image"
        />

        <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Field label="Description (optional)" name="description" value={form.description} onChange={handleChange} as="textarea" />

        {useCustomCategory || categories.length === 0 ? (
          <Field label="Category" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Food & Beverages" />
        ) : (
          <div>
            <Field label="Category" name="category" as="select" value={form.category} onChange={handleChange} required options={categories} />
            <button type="button" onClick={() => setUseCustomCategory(true)} className="mt-1.5 text-xs text-sage-dark hover:text-walnut transition-colors">
              + Use a new category
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Cost price (Rs.)" name="costPrice" type="number" step="0.01" value={form.costPrice} onChange={handleChange} required />
          <Field label="Selling price (Rs.)" name="sellingPrice" type="number" step="0.01" value={form.sellingPrice} onChange={handleChange} required />
          <Field label="Stock (optional)" name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-walnut/80">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="rounded border-walnut/30" />
            Active (visible on site)
          </label>
          <label className="flex items-center gap-2 text-sm text-walnut/80">
            <input type="checkbox" name="availableForCustomBuilder" checked={form.availableForCustomBuilder} onChange={handleChange} className="rounded border-walnut/30" />
            Available in custom builder
          </label>
        </div>

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving || uploadingImage}>
            {saving ? 'Saving…' : uploadingImage ? 'Uploading image…' : 'Save product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
