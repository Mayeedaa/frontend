import { useEffect } from 'react';

export function Toast({ message, visible, onClose, type = 'success' }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-baby-pink-600';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '🛒';

  return (
    <div className={`fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 transition-all duration-300 animate-toast-in`}>
      <span className="text-xl font-bold">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
