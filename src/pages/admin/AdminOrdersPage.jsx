import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/orders');
        setOrders(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No orders yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">All Orders</h2>
      <div className="space-y-3">
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
                <p className="text-xs font-medium text-gray-600 uppercase">Items</p>
                <p className="text-sm text-gray-900 mt-1">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Customer</p>
                <p className="text-sm text-gray-900 mt-1">#{order.userId?.slice(-4)}</p>
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

