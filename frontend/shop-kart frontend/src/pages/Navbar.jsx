import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Package, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8082/customers/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
          <div className="brand-icon-box">
            <ShoppingBag size={22} />
          </div>
          <span>Shop <span className="brand-highlight">Easy</span></span>
        </Link>

        {/* Center Nav Links */}
        <ul className="nav-links-center">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Explore Store
            </Link>
          </li>
          <li>
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
              My Orders
            </Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions-right">
          {/* Wishlist Link */}
          <Link to="/wishlist" className="nav-action-btn" title="My Wishlist">
            <Heart size={20} />
          </Link>

          {/* Cart Link with Badge */}
          <Link to="/cart" className="nav-action-btn" title="Shopping Cart">
            <ShoppingBag size={20} />
            {totalQuantity > 0 && (
              <span className="nav-badge-count">{totalQuantity}</span>
            )}
          </Link>

          {/* Auth State Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/profile" className="nav-user-pill" title="My Account">
                <div className="user-avatar-circle">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName ? user.fullName.split(' ')[0] : 'Account'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="nav-action-btn"
                title="Logout"
                style={{ color: '#ef4444' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border-light)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{ fontWeight: 600, padding: '0.5rem 0', color: isActive('/') ? 'var(--primary)' : 'inherit' }}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileOpen(false)}
            style={{ fontWeight: 600, padding: '0.5rem 0', color: isActive('/products') ? 'var(--primary)' : 'inherit' }}
          >
            Explore Store
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileOpen(false)}
            style={{ fontWeight: 600, padding: '0.5rem 0', color: isActive('/orders') ? 'var(--primary)' : 'inherit' }}
          >
            My Orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            style={{ fontWeight: 600, padding: '0.5rem 0', color: isActive('/wishlist') ? 'var(--primary)' : 'inherit' }}
          >
            Wishlist
          </Link>
          {user && (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              style={{ fontWeight: 600, padding: '0.5rem 0' }}
            >
              My Profile ({user.fullName})
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;