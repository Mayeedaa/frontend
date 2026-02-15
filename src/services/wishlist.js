const dispatchWishlistEvent = () => {
  window.dispatchEvent(new Event('wishlistUpdated'));
};

export const getWishlistCount = () => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  return wishlist.length;
};

export const isInWishlist = (productId) => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  return wishlist.some(item => item._id === productId);
};

export const addToWishlist = (product) => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (!wishlist.some(item => item._id === product._id)) {
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    dispatchWishlistEvent();
  }
};

export const removeFromWishlist = (productId) => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const updated = wishlist.filter(item => item._id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(updated));
  dispatchWishlistEvent();
};

export const updateWishlist = (product) => {
  if (isInWishlist(product._id)) {
    removeFromWishlist(product._id);
  } else {
    addToWishlist(product);
  }
};
