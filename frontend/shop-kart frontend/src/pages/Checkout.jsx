import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCart } from '../features/cart/cartSlice.js';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Home,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck
} from 'lucide-react';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be a valid 10-digit number';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      showToast('Please correct the highlighted form errors', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        showToast('Could not load Razorpay SDK. Please check your internet.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Create Order
      const { data } = await axios.post(
        'http://localhost:8082/orders/create-payment-order',
        { shippingAddress: formData },
        { withCredentials: true }
      );

      if (!data.success) {
        showToast(data.message || 'Failed to create order', 'error');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Shop Easy',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              'http://localhost:8082/orders/verify-payment',
              {
                shopKartOrderId: data.shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              dispatch(setCart([]));
              showToast('Payment successful! Order confirmed 🎉', 'success');
              navigate(`/order-success/${data.shopKartOrderId}`);
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            showToast('Payment verification failed! Please contact support.', 'error');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed or cancelled:', response.error);
        showToast('Payment was cancelled or failed. Your cart is preserved.', 'info');
        setIsSubmitting(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to initiate checkout';
      showToast(errorMsg, 'error');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state-box">
          <h3>Your cart is empty!</h3>
          <p>Please add products to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '1080px' }}>
      {/* Checkout Stepper */}
      <div className="checkout-stepper-row">
        <div className="step-item">
          <div className="step-number-circle">1</div>
          <span>Bag</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></div>
        <div className="step-item active">
          <div className="step-number-circle">2</div>
          <span>Shipping</span>
        </div>
        <div style={{ width: '40px', height: '2px', background: 'var(--border-light)' }}></div>
        <div className="step-item">
          <div className="step-number-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Left: Shipping Form */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <MapPin size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Delivery Address</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Full Recipient Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Aarav Sharma"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
            />
            {errors.fullName && <p className="form-error-msg">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={`form-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Street / House / Apartment *</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="House/Flat No., Building name, Street"
              className={`form-input ${errors.addressLine1 ? 'error' : ''}`}
            />
            {errors.addressLine1 && <p className="form-error-msg">{errors.addressLine1}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className={`form-input ${errors.city ? 'error' : ''}`}
              />
              {errors.city && <p className="form-error-msg">{errors.city}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Karnataka"
                className={`form-input ${errors.state ? 'error' : ''}`}
              />
              {errors.state && <p className="form-error-msg">{errors.state}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Postal Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              className={`form-input ${errors.pincode ? 'error' : ''}`}
            />
            {errors.pincode && <p className="form-error-msg">{errors.pincode}</p>}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="order-summary-card">
          <h3 className="summary-title">Order Items ({cartItems.length})</h3>

          <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '1.25rem' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Qty: {item.quantity || 1} × ₹{item.price?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <span style={{ fontWeight: 700 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
          </div>

          <div className="summary-line total">
            <span>Amount Payable</span>
            <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1.25rem' }}
          >
            {isSubmitting ? (
              'Securing Payment...'
            ) : (
              <>
                <Lock size={18} /> Pay ₹{totalPrice.toLocaleString('en-IN')} via Razorpay
              </>
            )}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#10b981" /> Verified 256-Bit Razorpay Gateway
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={16} color="#0ea5e9" /> Dispatched via Priority Express Courier
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;