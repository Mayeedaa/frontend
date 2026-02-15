import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2">No orders yet</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">Start shopping to place your first order</p>
        <Link to="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-baby-pink-100 text-baby-pink-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2">Order History</h1>
        <p className="text-gray-600 dark:text-slate-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-semibold text-gray-900">#{order._id.slice(-6)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                getStatusColor(order.status)
              }`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Time</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Items</p>
                <p className="text-sm text-gray-900 mt-1">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Total</p>
                <p className="text-lg font-bold text-baby-pink-600 mt-1">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

