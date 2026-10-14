import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateQuantityState, removeFromCartState } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ArrowLeft
} from 'lucide-react';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Math calculations
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      handleRemoveItem(productId);
      return;
    }

    dispatch(updateQuantityState({ id: productId, quantity: newQty }));

    if (user) {
      try {
        await axios.put(
          `http://localhost:8082/cart/${productId}`,
          { quantity: newQty },
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Failed to update cart quantity on server:', err);
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    dispatch(removeFromCartState(productId));
    showToast('Item removed from cart', 'info');

    if (user) {
      try {
        await axios.delete(`http://localhost:8082/cart/${productId}`, {
          withCredentials: true
        });
      } catch (err) {
        console.error('Failed to remove item on server:', err);
      }
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'SHOPEASY' || code === 'WELCOME10' || code === 'SAVE10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      showToast(`Coupon "${code}" applied! You saved 10% 🎉`, 'success');
    } else {
      showToast('Invalid coupon code. Try "SHOPEASY" for 10% off', 'error');
    }
  };

  // ================= EMPTY STATE =================
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <ShoppingBag size={36} />
          </div>
          <h3>Your Shopping Cart is Empty</h3>
          <p>Explore our premium collections and add your favorite items to get started!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ================= ACTIVE CART =================
  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Shopping Bag
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
        </p>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Items */}
        <div className="cart-items-card">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-row">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80';
                }}
              />

              <div className="cart-item-meta">
                <Link to={`/products/${item._id}`}>
                  <h4>{item.name}</h4>
                </Link>
                <p style={{ marginBottom: '0.5rem' }}>Category: {item.category || 'General'}</p>
                <div className="cart-item-price">
                  ₹{item.price?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Stepper */}
              <div className="quantity-stepper">
                <button
                  className="stepper-btn"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity || 1, -1)}
                >
                  -
                </button>
                <span className="stepper-count">{item.quantity || 1}</span>
                <button
                  className="stepper-btn"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity || 1, 1)}
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem' }}>
                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveItem(item._id)}
                title="Remove Item"
                style={{ color: '#ef4444', padding: '0.4rem' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="order-summary-card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-line">
            <span>Subtotal</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>
              {deliveryFee === 0 ? (
                <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
              ) : (
                `₹${deliveryFee}`
              )}
            </span>
          </div>

          {couponApplied && (
            <div className="summary-line" style={{ color: '#10b981' }}>
              <span>Discount (10%)</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Free delivery prompt */}
          {subtotal < 999 && (
            <div
              style={{
                background: '#f0fdf4',
                color: '#166534',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more to unlock FREE Express Delivery!
            </div>
          )}

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0' }}>
            <input
              type="text"
              placeholder="Promo code (try SHOPEASY)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{
                flex: 1,
                height: '40px',
                padding: '0 0.75rem',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn btn-outline btn-sm">
              Apply
            </button>
          </form>

          <div className="summary-line total">
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary)' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1.25rem' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#64748b', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#10b981" /> 256-Bit SSL Encrypted Checkout
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={16} color="#0ea5e9" /> Fast Dispatch with Real-Time Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;