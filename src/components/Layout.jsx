import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { api } from '../services/api';
import { useWishlistCount } from '../hooks/useWishlistCount';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const wishlistCount = useWishlistCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    // Load categories
    async function loadCategories() {
      try {
        const res = await api.get('/products/categories/list');
        setCategories(res.data || []);
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    }
    loadCategories();

    // Load cart count if user is logged in
    if (user) {
      loadCartCount();
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (user) {
        loadCartCount();
      }
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const loadCartCount = async () => {
    try {
      const res = await api.get('/cart');
      const count = res.data.items?.length || 0;
      setCartCount(count);
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
    setShowCategoryMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-bebe-soft dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-900 dark:to-pink-950 transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-gradient-bebe dark:bg-gradient-to-r dark:from-baby-pink-900/80 dark:via-baby-pink-800/80 dark:to-baby-pink-900/80 backdrop-blur-md border-b-2 border-baby-pink-300 dark:border-baby-pink-700 shadow-xl transition-all">
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-bebe-vibrant shadow-lg flex items-center justify-center text-white font-bold group-hover:shadow-2xl group-hover:scale-110 transition-all text-lg">
                CX
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg gradient-text drop-shadow-sm">CommerceX</span>
                <p className="text-xs bg-gradient-to-r from-baby-pink-700 to-baby-pink-600 bg-clip-text text-transparent leading-none font-medium">Shop Bebe Pink</p>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="flex items-center w-full bg-white dark:bg-slate-900/80 rounded-xl border-2 border-baby-pink-300 dark:border-baby-pink-700 hover:border-baby-pink-400 dark:hover:border-baby-pink-600 transition-all shadow-lg hover:shadow-xl">
                <svg className="w-5 h-5 text-baby-pink-500 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-slate-50 placeholder-baby-pink-400 dark:placeholder-baby-pink-300 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-baby-pink-600 dark:text-baby-pink-400 hover:text-baby-pink-700 dark:hover:text-baby-pink-300 transition-colors font-semibold"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-baby-pink-400 dark:hover:bg-baby-pink-700 transition-all text-white hover:scale-110 transform duration-200 shadow-md hover:shadow-lg"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm.464 4.95l-2.12-2.12a1 1 0 111.414-1.414l2.12 2.12a1 1 0 11-1.414 1.414zM2.05 2.05a1 1 0 011.414 0l2.12 2.12a1 1 0 01-1.414 1.414L2.05 3.464a1 1 0 010-1.414zM17.95 17.95a1 1 0 011.414 0l2.12 2.12a1 1 0 01-1.414 1.414l-2.12-2.12a1 1 0 01-1.414-1.414zM4.464 16.95l2.12 2.12a1 1 0 01-1.414 1.414L3.05 18.464a1 1 0 011.414-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 rounded-lg hover:bg-baby-pink-400 dark:hover:bg-baby-pink-700 transition-all text-white hover:scale-110 transform duration-200 shadow-md hover:shadow-lg"
                title="Wishlist"
              >
                <svg className="w-6 h-6 drop-shadow-sm" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-white text-baby-pink-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg glow-bebe animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-baby-pink-400 dark:hover:bg-baby-pink-700 transition-all text-white hover:scale-110 transform duration-200 shadow-md hover:shadow-lg"
                title="Shopping cart"
              >
                <svg className="w-6 h-6 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" fill="currentColor"></circle>
                  <circle cx="20" cy="21" r="1" fill="currentColor"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-baby-pink-600 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg glow-bebe font-bold animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Sign In */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gradient-to-br dark:from-baby-pink-900 dark:to-baby-pink-800 text-gray-900 dark:text-baby-pink-100 hover:shadow-2xl transition-all border-2 border-white dark:border-baby-pink-700 hover:scale-105 transform">
                    <div className="w-6 h-6 rounded-full bg-gradient-bebe-vibrant shadow-md flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold">{user.name.split(' ')[0]}</span>
                    <svg className="w-4 h-4 text-baby-pink-400 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-0 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                      <p className="font-bold text-gray-900 dark:text-slate-50">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{user.email}</p>
                      <div className="mt-2 inline-block px-2 py-1 bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-700 dark:text-baby-pink-300 text-xs font-semibold rounded">
                        {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                      </div>
                    </div>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${isActive ? 'bg-baby-pink-50 dark:bg-baby-pink-900/30 text-baby-pink-600 dark:text-baby-pink-300' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-colors`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      👤 My Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${isActive ? 'bg-baby-pink-50 dark:bg-baby-pink-900/30 text-baby-pink-600 dark:text-baby-pink-300' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-colors`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📦 My Orders
                    </NavLink>
                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm ${isActive ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-colors border-b border-gray-200 dark:border-slate-700`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        🔧 Admin Dashboard
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-baby-pink-600 text-white shadow-lg'
                        : 'bg-baby-pink-600 text-white hover:bg-baby-pink-700 hover:shadow-md'
                    }`
                  }
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </NavLink>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>

          {/* Secondary Category Navigation */}
          <div className="hidden md:flex items-center gap-2 py-3 overflow-x-auto border-t border-gray-200 dark:border-slate-800">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="relative px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300 font-medium whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Categories
              <svg className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Category Dropdown */}
            {showCategoryMenu && (
              <div className="absolute top-full left-4 mt-2 w-56 bg-white dark:bg-slate-900 border-2 border-baby-pink-200 dark:border-baby-pink-700 rounded-xl shadow-2xl z-50 backdrop-blur-sm">
                <div className="p-2 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      navigate('/');
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-baby-pink-50 dark:hover:bg-baby-pink-900/30 text-gray-700 dark:text-slate-300 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors font-medium"
                  >
                    ✨ All Products
                  </button>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-baby-pink-50 dark:hover:bg-baby-pink-900/30 text-gray-700 dark:text-slate-300 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors"
                      >
                        📦 {cat}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500 dark:text-slate-400 text-sm">Loading categories...</p>
                  )}
                </div>
              </div>
            )}

            {/* Top Categories Carousel */}
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-4 py-2 rounded-lg hover:bg-baby-pink-50 dark:hover:bg-baby-pink-900/30 text-gray-700 dark:text-slate-300 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors whitespace-nowrap text-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-50 rounded-lg text-sm"
            />
            <button type="submit" className="btn-primary px-4">
              🔍
            </button>
          </form>

          <NavLink to="/" className="block px-4 py-2 rounded text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
            Home
          </NavLink>
          {user && (
            <>
              <NavLink to="/orders" className="block px-4 py-2 rounded text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                My Orders
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className="block px-4 py-2 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40">
                  🔧 Admin Dashboard
                </NavLink>
              )}
            </>
          )}

          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="w-full text-left px-4 py-2 rounded text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-baby-pink-600 to-baby-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  CX
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-slate-50">CommerceX</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Shop Smart</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                Your trusted online marketplace for quality products at great prices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-50 mb-4">Shopping</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li>
                  <Link to="/" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Best Sellers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-50 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-50 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                &copy; 2026 CommerceX. All rights reserved. Built with ❤️ for shoppers.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.51 10 10 0 01-2.836.776 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

