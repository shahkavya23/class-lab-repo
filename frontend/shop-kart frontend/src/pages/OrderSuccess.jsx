import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight, ShoppingBag, Printer } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/orders/${id}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
        setError(err.response?.data?.message || 'Failed to load order receipt');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Generating your order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state-box">
          <h3>Order Confirmation Not Found</h3>
          <p>{error || 'Unable to retrieve order details.'}</p>
          <Link to="/products" className="btn btn-primary">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '780px' }}>
      {/* Celebration Header */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)'
          }}
        >
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Thank you for choosing Shop Easy! Your payment has been verified and your package is being prepared for dispatch.
        </p>

        {/* Tracking progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            padding: '1.25rem 2rem',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem', fontSize: '0.8rem', fontWeight: 700 }}>
              ✓
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Placed</span>
          </div>

          <div style={{ flex: 1, height: '3px', background: '#10b981', margin: '0 0.5rem 1rem' }}></div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem', fontSize: '0.8rem', fontWeight: 700 }}>
              2
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>Processing</span>
          </div>

          <div style={{ flex: 1, height: '3px', background: 'var(--border-light)', margin: '0 0.5rem 1rem' }}></div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', border: '2px solid var(--border-light)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem', fontSize: '0.8rem', fontWeight: 700 }}>
              3
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Dispatched</span>
          </div>

          <div style={{ flex: 1, height: '3px', background: 'var(--border-light)', margin: '0 0.5rem 1rem' }}></div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', border: '2px solid var(--border-light)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem', fontSize: '0.8rem', fontWeight: 700 }}>
              4
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Delivered</span>
          </div>
        </div>

        {/* Receipt Details Box */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.75rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Number</div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>#{order._id}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment Status</div>
              <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.98rem' }}>{order.paymentStatus} (Razorpay)</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Paid</div>
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              <MapPin size={16} color="var(--primary)" /> Delivery Destination
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})<br />
              {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>

          {/* Items Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              <Package size={16} color="var(--primary)" /> Purchased Items
            </div>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.4rem 0' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 700 }}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary btn-lg">
            View My Orders <ArrowRight size={18} />
          </Link>
          <Link to="/products" className="btn btn-outline btn-lg">
            Continue Shopping
          </Link>
          <button onClick={() => window.print()} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
