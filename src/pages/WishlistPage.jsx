import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter(item => item._id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('wishlist', JSON.stringify([]));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">Add items to your wishlist to save them for later</p>
        <Link to="/" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="card overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-700 overflow-hidden relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}>
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(product._id);
                }}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-slate-50 line-clamp-2 mb-2">
                {product.name}
              </h3>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <span className="text-lg font-bold text-baby-pink-600 dark:text-baby-pink-400">
                  ${product.price?.toFixed(2)}
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
