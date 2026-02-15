import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter out items with null products and calculate total
  const validItems = items.filter(item => item.product && item.product._id);
  const total = validItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * (item.quantity || 0),
    0
  );

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      await removeItem(productId);
      return;
    }
    setLoading(true); // Optional: show feedback
    try {
      // Note: Backend doesn't support quantity update yet, so we remove and re-add
      // In production, implement a PATCH endpoint
      await api.delete(`/cart/items/${productId}`);
      if (newQty > 0) {
        await api.post('/cart/items', { productId, quantity: newQty });
      }
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/items/${productId}`);
      // Remove the item immediately from state while waiting for refresh
      setItems(prev => prev.filter(item => item.product._id !== productId));
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to remove item');
    }
  };

  const checkout = async () => {
    setChecking(true);
    try {
      const res = await api.post('/payments/checkout-session');
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error(e);
      alert('Checkout failed');
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!validItems.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <svg className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0h2m-2 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-8 text-lg">Start shopping to add items to your cart</p>
          <Link to="/" className="btn-primary inline-block px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg">{validItems.length} item{validItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {validItems.map((item) => {
              // Extra safety check
              if (!item || !item.product) return null;
              
              return (
                <div key={item._id} className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-28 sm:h-28 bg-gray-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <svg
                        className="w-12 h-12 text-gray-400"
                        style={{ display: item.product?.image ? 'none' : 'flex' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 dark:text-slate-50 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors mb-2 block truncate"
                      >
                        {item.product.name || 'Product'}
                      </Link>
                      {item.variant && (
                        <p className="text-xs font-medium text-baby-pink-600 dark:text-baby-pink-400 mb-1">
                          Type: {item.variant}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {item.product.description || 'No description available'}
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-slate-50 mb-4">
                        ${(item.product.price || 0).toFixed(2)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:border-baby-pink-500 dark:hover:border-baby-pink-400 hover:bg-baby-pink-50 dark:hover:bg-baby-pink-900/20 text-gray-700 dark:text-slate-300 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors flex items-center justify-center font-bold text-lg"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900 dark:text-slate-50 text-base">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:border-baby-pink-500 dark:hover:border-baby-pink-400 hover:bg-baby-pink-50 dark:hover:bg-baby-pink-900/20 text-gray-700 dark:text-slate-300 hover:text-baby-pink-600 dark:hover:text-baby-pink-400 transition-colors flex items-center justify-center font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-slate-400">Subtotal</p>
                        <p className="text-2xl font-bold text-baby-pink-600 dark:text-baby-pink-400">
                          ${((item.product.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors rounded-lg flex items-center gap-2 whitespace-nowrap text-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning for removed products */}
          {items.length > validItems.length && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Some items in your cart are no longer available and have been removed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-8">Order Summary</h2>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                <span className="text-gray-900 dark:text-slate-50 font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-slate-400">Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-slate-400">Tax</span>
                <span className="text-gray-900 dark:text-slate-50 font-semibold">At checkout</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 dark:border-slate-700 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">Total</span>
                <span className="text-3xl font-bold text-baby-pink-600 dark:text-baby-pink-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={checkout}
              disabled={checking}
              className="btn-primary w-full py-3 font-semibold text-lg disabled:opacity-50 mb-3"
            >
              {checking ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            <Link 
              to="/" 
              className="btn-outline w-full justify-center py-3 font-semibold"
            >
              Continue Shopping
            </Link>

            {/* Summary Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="space-y-3 text-xs text-gray-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

