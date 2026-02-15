import { NavLink, Routes, Route } from 'react-router-dom';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage products and orders</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 mb-8">
        <NavLink
          to="products"
          className={({ isActive }) =>
            `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-baby-pink-600 text-baby-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-baby-pink-600 text-baby-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`
          }
        >
          Orders
        </NavLink>
      </div>

      <Routes>
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Routes>
    </div>
  );
}

