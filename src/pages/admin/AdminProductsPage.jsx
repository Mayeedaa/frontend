import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ImageUploadInput from '../../components/ImageUploadInput';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  const load = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/categories/list')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/products', {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category || 'Uncategorized',
        stock: parseInt(form.stock) || 0,
        image: form.image
      });
      setForm({ name: '', description: '', price: '', category: '', stock: '', image: '' });
      await load();
      alert('Product added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-6">Product Catalog</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-5 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <p>No products yet. Add one using the form on the right.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  {p.image && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      {p.category && (
                        <span className="px-2 py-1 bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-700 dark:text-baby-pink-200 rounded text-xs">
                          {p.category}
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-slate-400">Stock: {p.stock || 0}</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <p className="text-lg font-bold text-baby-pink-600 dark:text-baby-pink-400 flex-shrink-0">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        <div className="card p-6 sticky top-20">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50 mb-6">Add Product</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Premium Headphones"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product details..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other (New Category)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                  className="input-field pl-8"
                />
              </div>
            </div>

            <ImageUploadInput 
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
              label="Product Image (Base64 or URL)"
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2"
            >
              {submitting ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
    </div>
  );
}

