import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import About from './pages/About';

import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminQueries from './pages/admin/AdminQueries';
import AdminSettings from './pages/admin/AdminSettings';

function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes — no storefront navbar/footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login/admin/server.js" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="queries" element={<AdminQueries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Storefront routes */}
              <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
              <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
              <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
              <Route path="/order/:id/confirmation" element={<StorefrontLayout><OrderConfirmation /></StorefrontLayout>} />
              <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
              <Route path="/signup" element={<StorefrontLayout><Signup /></StorefrontLayout>} />
              <Route
                path="/account/orders"
                element={
                  <StorefrontLayout>
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  </StorefrontLayout>
                }
              />
              <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
              <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
