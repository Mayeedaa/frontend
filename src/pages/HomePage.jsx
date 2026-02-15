import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { updateWishlist, isInWishlist } from '../services/wishlist';
import { Toast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/products/categories/list'),
        ]);
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data || []);
        
        // Initialize wishlisted state
        const wishlistState = {};
        productsRes.data.forEach(p => {
          wishlistState[p._id] = isInWishlist(p._id);
        });
        setWishlisted(wishlistState);
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter products based on search, category, and price
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    updateWishlist(product);
    setWishlisted(prev => ({
      ...prev,
      [product._id]: !prev[product._id]
    }));
  };

  const quickAddToCart = async (e, productId) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      setToast({
        visible: true,
        message: 'Added to cart! 🛒',
        type: 'success'
      });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      setToast({
        visible: true,
        message: 'Failed to add to cart',
        type: 'error'
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-bebe rounded-2xl text-white p-12 md:p-16 shadow-xl transform hover:-translate-y-1 transition-all">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome to CommerceX</h1>
          <p className="text-xl text-white/95 dark:text-white/90 mb-8 max-w-2xl drop-shadow-sm">
            ✨ Discover curated products from trusted sellers. Shop quality items with confidence. Pretty, simple, and fabulous.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-baby-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-baby-pink-100 shadow-lg hover:shadow-2xl transition-all hover:scale-105 transform">
            Explore Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="mb-8 bg-gradient-to-br from-white to-baby-pink-50 dark:from-slate-800 dark:to-baby-pink-900/20 p-8 rounded-2xl shadow-lg border-2 border-baby-pink-200 dark:border-baby-pink-700">
        <h2 className="text-2xl font-bold gradient-text mb-6">Find Your Perfect Item</h2>
        <div className="space-y-6">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-semibold text-baby-pink-700 dark:text-baby-pink-200 mb-3">
              🔍 Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-baby-pink-700 dark:text-baby-pink-200 mb-3">
                📂 Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 pr-10 border-2 border-baby-pink-300 dark:border-baby-pink-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 focus:border-baby-pink-500 dark:focus:border-baby-pink-400 focus:ring-2 focus:ring-baby-pink-200 dark:focus:ring-baby-pink-800 transition-all appearance-none cursor-pointer font-medium hover:border-baby-pink-400 dark:hover:border-baby-pink-500 shadow-md"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(236 72 153)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '20px'
                }}
              >
                <option value="all">✨ All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-baby-pink-700 dark:text-baby-pink-200 mb-3">
                💰 Max Price: ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-baby-pink-500"
              />
            </div>
          </div>

          {/* Results Counter */}
          <div className="text-sm font-medium text-baby-pink-600 dark:text-baby-pink-300 bg-baby-pink-100/50 dark:bg-baby-pink-900/30 p-3 rounded-lg">
            ✨ Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold gradient-text">
              {selectedCategory === 'all' ? '✨ Featured' : '✨ ' + selectedCategory} Products
            </h2>
            <p className="text-baby-pink-600 dark:text-baby-pink-300 mt-2 font-medium">
              {filteredProducts.length === 0
                ? 'No products found. Try adjusting your filters.'
                : `Discover our ${filteredProducts.length} beautiful selected products`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card p-0 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-full" />
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8-4m0 0l-8-4" />
            </svg>
            <p className="text-gray-500 dark:text-slate-400 text-lg mb-2">No products found</p>
            <p className="text-gray-400 dark:text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="card overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-700 overflow-hidden relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center"
                    style={{ display: p.image ? 'none' : 'flex' }}
                  >
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Stock Badge */}
                  {p.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                  {p.stock > 0 && p.stock <= 10 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Low Stock ({p.stock})
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, p)}
                    className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                      wishlisted[p._id]
                        ? 'bg-red-500 text-white'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-red-500 hover:text-white'
                    }`}
                    title={wishlisted[p._id] ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg className={`w-5 h-5 ${wishlisted[p._id] ? 'fill-current' : ''}`} fill={wishlisted[p._id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col h-full">
                  {/* Category Badge */}
                  {p.category && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-700 dark:text-baby-pink-200 text-xs rounded-full">
                        {p.category}
                      </span>
                    </div>
                  )}

                  <h3 className="font-semibold text-gray-900 dark:text-slate-50 line-clamp-2 mb-2 flex-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-4 text-justify">
                    {p.description}
                  </p>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-xl font-bold text-baby-pink-600 dark:text-baby-pink-400">
                      ${p.price?.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => quickAddToCart(e, p._id)}
                      disabled={p.stock <= 0}
                      className="p-2 rounded-lg bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-600 dark:text-baby-pink-300 hover:bg-baby-pink-200 dark:hover:bg-baby-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={p.stock <= 0 ? 'Out of stock' : 'Add to cart'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({...toast, visible: false})} />
    </div>
  );
}

