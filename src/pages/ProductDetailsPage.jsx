import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { updateWishlist, isInWishlist } from '../services/wishlist';
import { Toast } from '../components/Toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([
    { _id: 1, author: 'Sarah Johnson', rating: 5, text: 'Excellent product! Very satisfied with the quality.', date: '2026-02-10' },
    { _id: 2, author: 'Mike Brown', rating: 4, text: 'Good value for money. Arrived on time.', date: '2026-02-08' },
    { _id: 3, author: 'Emma Davis', rating: 5, text: 'Perfect! Exactly as described. Highly recommend!', date: '2026-02-05' }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setIsWishlisted(isInWishlist(res.data._id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    setAdding(true);
    try {
      const payload = { productId: product._id, quantity };
      if (selectedVariant) {
        payload.variant = selectedVariant;
      }
      await api.post('/cart/items', payload);
      setToast({
        visible: true,
        message: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart! 🎉`,
        type: 'success'
      });
      // Notify Layout.jsx to refresh cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // Reset quantity after successful add
      setQuantity(1);
      setSelectedVariant('');
    } catch (e) {
      console.error(e);
      setToast({
        visible: true,
        message: 'Failed to add to cart',
        type: 'error'
      });
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = () => {
    updateWishlist(product);
    setIsWishlisted(!isWishlisted);
  };

  const submitReview = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!newReview.text.trim()) {
      alert('Please enter a review');
      return;
    }
    const review = {
      _id: reviews.length + 1,
      author: user.name,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, text: '' });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-full animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <svg className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-600 dark:text-slate-400 text-lg mb-4">Product not found</p>
        <Link to="/" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
        <Link to="/" className="hover:text-baby-pink-600">Home</Link>
        <span>/</span>
        <Link to="/" className="hover:text-baby-pink-600">{product.category || 'Products'}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid gap-12 md:grid-cols-2 mb-16">
        {/* Product Image */}
        <div>
          <div className="aspect-[4/3] bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden flex items-center justify-center sticky top-20">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center"
              style={{ display: product.image ? 'none' : 'flex' }}
            >
              <div className="text-center">
                <svg className="w-24 h-24 text-gray-400 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-slate-500">No image available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Category Badge */}
          {product.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-700 dark:text-baby-pink-200 text-sm font-semibold rounded-full">
                {product.category}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">
              {averageRating} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
            <span className="text-5xl font-bold text-baby-pink-600 dark:text-baby-pink-400">
              ${product.price?.toFixed(2)}
            </span>
            {product.stock > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                ✓ In Stock ({product.stock} available)
              </p>
            )}
            {product.stock <= 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                ✗ Out of Stock
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-3">Description</h3>
            <p className="text-gray-700 dark:text-slate-300 text-justify leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-3">
                  Product Type
                </label>
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 focus:border-baby-pink-500 dark:focus:border-baby-pink-400 focus:ring-2 focus:ring-baby-pink-200 dark:focus:ring-baby-pink-800 transition-colors appearance-none cursor-pointer font-medium"
                >
                  <option value="">Select a type...</option>
                  {product.variants.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-900 dark:text-slate-50">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock <= 0}
                  className="px-4 py-3 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-50 disabled:opacity-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center py-3 border-0 focus:ring-0 bg-white dark:bg-slate-700 dark:text-slate-50"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock <= 0}
                  className="px-4 py-3 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={addToCart}
                disabled={adding || product.stock <= 0}
                className="btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={toggleWishlist}
                className={`px-6 py-4 rounded-lg border-2 font-semibold transition-colors ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-red-500 hover:text-red-600'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            
          </div>

          {/* Product Meta */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-center">
            <div>
              <svg className="w-6 h-6 text-baby-pink-600 dark:text-baby-pink-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Fast Delivery</p>
            </div>
            <div>
              <svg className="w-6 h-6 text-baby-pink-600 dark:text-baby-pink-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Quality Verified</p>
            </div>
            <div>
              <svg className="w-6 h-6 text-baby-pink-600 dark:text-baby-pink-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Best Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-8">
          Customer Reviews
        </h2>

        {/* Add Review Form */}
        {user && (
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">
              Share Your Experience
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="focus:outline-none transition-transform"
                    >
                      <svg
                        className={`w-8 h-8 ${newReview.rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  className="input-field w-full min-h-24 resize-none"
                />
              </div>
              <button
                onClick={submitReview}
                className="btn-primary w-full"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-baby-pink-50 dark:bg-baby-pink-900/20 border border-baby-pink-200 dark:border-baby-pink-800 rounded-lg p-6 mb-8 text-center">
            <p className="text-baby-pink-700 dark:text-baby-pink-300 mb-3">
              Sign in to leave a review
            </p>
            <Link to="/auth/login" className="btn-primary inline-block">
              Sign In
            </Link>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-slate-400 py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-50">
                      {review.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-slate-300">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      </div>
    </div>
  );
}

