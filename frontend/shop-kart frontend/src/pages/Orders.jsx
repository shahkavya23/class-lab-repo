import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, Calendar, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8082/orders', {
          withCredentials: true
        });
        if (response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state-box">
          <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertCircle size={36} />
          </div>
          <h3>Unable to load orders</h3>
          <p>{error}</p>
          <Link to="/products" className="btn btn-primary">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <Package size={36} />
          </div>
          <h3>No Orders Placed Yet</h3>
          <p>Your order history is currently empty. Browse our catalog to find items you love!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '920px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          My Order History
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review and track all your previous purchases on Shop Easy
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const isPaid = order.paymentStatus === 'PAID';
          return (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Package size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.3rem' }}>
                    <Calendar size={14} />
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <span className={`order-status-badge ${isPaid ? 'status-paid' : 'status-pending'}`}>
                    {isPaid ? <CheckCircle2 size={14} /> : null}
                    {order.status || (isPaid ? 'PAID' : 'PENDING')}
                  </span>
                </div>
              </div>

              {/* Items Snapshot */}
              <div style={{ padding: '0.5rem 0 1.25rem' }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: idx !== order.items.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Paid: </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link to={`/order-success/${order._id}`} className="btn btn-outline btn-sm">
                  View Full Receipt <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
