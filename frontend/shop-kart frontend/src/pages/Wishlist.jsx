import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartState } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8082/wishlist', { withCredentials: true })
      .then((response) => {
        setWishlist(response.data?.wishlist || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching wishlist:', err);
        setIsLoading(false);
        setError(true);
      });
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:8082/wishlist/${productId}`, {
        withCredentials: true
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      showToast('Removed item from your wishlist', 'info');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      showToast('Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (product) => {
    dispatch(addToCartState({ ...product, quantity: 1 }));
    showToast(`Moved "${product.name}" to your cart! 🛒`, 'success');

    if (user) {
      try {
        await axios.post(
          `http://localhost:8082/cart/${product._id}`,
          { quantity: 1 },
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Cart sync err:', err);
      }
    }

    // Also remove from wishlist
    handleRemove(product._id);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          My Wishlist ❤️
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Items you've saved to buy later or keep track of
        </p>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading your saved items...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="empty-state-box">
          <h3>Unable to load wishlist</h3>
          <p>Please check your connection and try refreshing the page.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      )}

      {!isLoading && !error && wishlist.length === 0 && (
        <div className="empty-state-box">
          <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Heart size={36} />
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>You haven't saved any items yet. Find products you love and click the heart icon to save them!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Exploring <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {!isLoading && !error && wishlist.length > 0 && (
        <div className="products-grid">
          {wishlist.map((item) => (
            <div key={item._id} className="product-card">
              <div className="product-image-box">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <button
                  onClick={() => handleRemove(item._id)}
                  className="product-wishlist-btn active"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
                <span className="product-badge-category">{item.category}</span>
              </div>

              <div className="product-card-body">
                <Link to={`/products/${item._id}`}>
                  <h3 className="product-card-title">{item.name}</h3>
                </Link>
                <p className="product-card-desc">{item.description}</p>

                <div className="product-card-pricing">
                  <span className="product-price-current">₹{item.price?.toLocaleString('en-IN')}</span>
                </div>

                <div className="product-card-footer" style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <ShoppingBag size={16} /> Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="btn btn-danger-outline btn-sm"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
