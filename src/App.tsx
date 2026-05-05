import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VendorsPage from './pages/VendorsPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './components/DashboardLayout';

import { Toaster } from 'sonner';
import NotificationWatcher from './components/NotificationWatcher';
import CartAnimationContainer from './components/CartAnimationContainer';

export default function App() {
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <NotificationWatcher />
      <CartAnimationContainer />

      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:id" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<VendorsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}