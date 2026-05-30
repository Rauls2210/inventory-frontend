import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductListPage from '../pages/ProductListPage';
import AddProductPage from '../pages/AddProductPage';
import EditProductPage from '../pages/EditProductPage';
import InventoryPage from '../pages/InventoryPage';
import InventoryHistoryPage from '../pages/InventoryHistoryPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/history" element={<InventoryHistoryPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
