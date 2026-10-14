import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <h3>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
                <ShoppingBag size={18} />
              </div>
              Shop <span className="brand-highlight">Easy</span>
            </h3>
            <p>
              Your premier destination for high-quality electronics, trending fashion, home aesthetics, and inspiring books. Fast delivery & 100% genuine products guaranteed.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="#10b981" /> 100% Safe Payments
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Truck size={16} color="#0ea5e9" /> Fast Delivery
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
              <li><Link to="/orders">Order History</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Fashion">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=Home">Home & Living</Link></li>
              <li><Link to="/products?category=Books">Books & Learning</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4>Stay in the Loop</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Subscribe for exclusive flash sales, new product drops, and 10% off your first purchase.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Shop Easy newsletter!"); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                style={{
                  flex: 1,
                  padding: '0.65rem 0.95rem',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px' }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Shop Easy. All rights reserved. Built with precision for exceptional shopping.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Shipping Info</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
