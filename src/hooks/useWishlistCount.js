import { useEffect, useState } from 'react';

export const useWishlistCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial count
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setCount(wishlist.length);

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setCount(updated.length);
    };

    // Listen to storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Also listen to custom event that we'll dispatch when adding/removing from wishlist
    window.addEventListener('wishlistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, []);

  return count;
};
