import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  Plus, Trash2, Package, X, Upload, Link as LinkIcon,
  CheckCircle2, AlertCircle, Loader2, Star, ImageOff,
  ChevronDown, LayoutGrid, RefreshCw
} from 'lucide-react';

// ─── Reusable Field Components ────────────────────────────────────────────────

const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

// ─── Toast notification ───────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const isError = type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl text-sm font-semibold text-white transition-all
        ${isError ? 'bg-red-600' : 'bg-emerald-600'}`}
    >
      {isError ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="h-4 w-4" /></button>
    </div>
  );
};

// ─── Add Product Modal ────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: '', price: '', description: '', countInStock: '',
  category: '', isFeatured: false, image: '', imageTab: 'url',
};

const AddProductModal = ({ categories, onClose, onCreated }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef();

  // Live preview URL
  useEffect(() => {
    if (form.imageTab === 'url') setPreviewUrl(form.image);
  }, [form.image, form.imageTab]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('image', res.data.imageUrl);
      setPreviewUrl(res.data.imageUrl);
    } catch {
      setError('Image upload failed. Try using a URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.description || !form.image || !form.category) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        image: form.image.trim(),
        category: form.category,
        countInStock: parseInt(form.countInStock, 10) || 0,
        isFeatured: form.isFeatured,
      };
      const res = await api.post('/products', payload);
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-800/50">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Add New Product</h2>
              <p className="text-xs text-slate-400">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Name" required>
              <input id="prod-name" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. iPhone 15 Pro" />
            </FormField>
            <FormField label="Price (USD)" required>
              <input id="prod-price" type="number" step="0.01" min="0" className={inputCls} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 999.99" />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description" required>
            <textarea id="prod-desc" rows={3} className={inputCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief product description..." />
          </FormField>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category" required>
              <div className="relative">
                <select id="prod-cat" className={`${inputCls} appearance-none pr-9 cursor-pointer`} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">— Select Category —</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </FormField>
            <FormField label="Stock Count">
              <input id="prod-stock" type="number" min="0" className={inputCls} value={form.countInStock} onChange={(e) => set('countInStock', e.target.value)} placeholder="e.g. 25" />
            </FormField>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input id="prod-featured" type="checkbox" className="sr-only" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
              <div className={`h-6 w-11 rounded-full transition-colors duration-200 ${form.isFeatured ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${form.isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Star className="h-4 w-4 text-amber-500" />
              Mark as Featured (shows on homepage)
            </span>
          </label>

          {/* Image — URL or Upload */}
          <FormField label="Product Image" required>
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-3">
              {['url', 'upload'].map((tab) => (
                <button key={tab} type="button"
                  onClick={() => { set('imageTab', tab); set('image', ''); setPreviewUrl(''); }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${form.imageTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {tab === 'url' ? <><LinkIcon className="h-3.5 w-3.5" /> Image URL</> : <><Upload className="h-3.5 w-3.5" /> Upload File</>}
                </button>
              ))}
            </div>

            {form.imageTab === 'url' ? (
              <input id="prod-image-url" className={inputCls} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." />
            ) : (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button type="button" onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-4 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all disabled:opacity-60"
                >
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Click to choose an image (max 5MB)</>}
                </button>
                {form.image && <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">✓ Uploaded: {form.image}</p>}
              </div>
            )}

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </FormField>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Plus className="h-4 w-4" /> Add Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirmation ──────────────────────────────────────────────────────

const DeleteConfirm = ({ product, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 mx-auto">
        <Trash2 className="h-6 w-6" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Delete Product?</h3>
        <p className="mt-1 text-sm text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">"{product.name}"</span> will be permanently removed.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all disabled:opacity-60">
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
      showToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" added successfully!`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showToast(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete product.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Product Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} in your store`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button id="add-product-btn" onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35 transition-all">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
          <p className="text-sm text-slate-400 font-medium">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <LayoutGrid className="h-8 w-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700 dark:text-slate-300">No products yet</p>
            <p className="text-sm text-slate-400 mt-1">Click "Add Product" to create your first listing.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-all">
            <Plus className="h-4 w-4" /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p._id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Product */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <ImageOff className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[180px] mt-0.5">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 px-2.5 py-1 text-xs font-bold">
                      {p.category?.name || '—'}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-3.5 font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  {/* Stock */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                      p.countInStock > 10
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : p.countInStock > 0
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                    }`}>
                      {p.countInStock > 0 ? `${p.countInStock} left` : 'Out of stock'}
                    </span>
                  </td>
                  {/* Featured badge */}
                  <td className="px-4 py-3.5">
                    {p.isFeatured ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Featured
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Toast */}
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'success' })} />
    </div>
  );
};

export default AdminProducts;
