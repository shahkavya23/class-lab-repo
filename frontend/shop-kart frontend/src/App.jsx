import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Products.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Navbar from './pages/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import { setCart } from './features/cart/cartSlice.js';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Orders from './pages/Orders.jsx';

function CartSync() {
  const { user, loading } = useAuth();
  const userId = user?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      return;
    }

    let cancelled = false;

    axios
      .get('http://localhost:8082/cart', { withCredentials: true })
      .then(({ data }) => {
        if (!Array.isArray(data.cart)) {
          return;
        }

        const cartItems = data.cart.flatMap(({ product, quantity }) =>
          product ? [{ ...product, quantity }] : []
        );

        if (!cancelled) dispatch(setCart(cartItems));
      })
      .catch((error) => {
        if (!cancelled) console.error('Cart restoration note:', error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, loading, userId]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <CartSync />
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Storefront & Catalog */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Product />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Account & Checkout Flow */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-success/:id"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;