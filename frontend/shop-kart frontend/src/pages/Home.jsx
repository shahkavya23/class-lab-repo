import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCartState } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Heart,
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8082/products')
      .then((res) => {
        const list = res.data?.products || [];
        setFeaturedProducts(list.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Home products load err:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    dispatch(addToCartState({ ...product, quantity: 1 }));
    showToast(`Added "${product.name}" to your cart!`, 'success');

    if (user) {
      try {
        await axios.post(
          `http://localhost:8082/cart/${product._id}`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Cart sync err:', err);
      }
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) {
      showToast('Please sign in to save items to your wishlist', 'info');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8082/wishlist/${product._id}`,
        {},
        { withCredentials: true }
      );
      showToast(`Added "${product.name}" to your wishlist! ❤️`, 'success');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showToast('Item is already in your wishlist!', 'info');
      } else {
        showToast('Failed to add to wishlist', 'error');
      }
    }
  };

  return (
    <div className="home-page-container">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="hero-grid">
            {/* Hero Copy */}
            <div>
              <div className="hero-badge-pill">
                <Sparkles size={16} /> New Season Arrivals & Tech Drops
              </div>
              <h1 className="hero-title">
                Curated Essentials for a <span className="brand-highlight">Modern Lifestyle</span>.
              </h1>
              <p className="hero-subtitle">
                Discover exceptional electronics, trendsetting fashion, artisanal home decor, and inspiring books crafted for everyday elegance.
              </p>
              <div className="hero-cta-group">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Explore Collection <ArrowRight size={18} />
                </Link>
                <a href="#categories" className="btn btn-outline btn-lg">
                  Shop by Category
                </a>
              </div>

              {/* Stats Row */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <h4>20K+</h4>
                  <p>Satisfied Shoppers</p>
                </div>
                <div className="hero-stat-item">
                  <h4>4.9 ★</h4>
                  <p>Product Rating</p>
                </div>
                <div className="hero-stat-item">
                  <h4>100%</h4>
                  <p>Genuine Guarantee</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="hero-visual-card">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80"
                alt="Shop Easy Premium Storefront"
                className="hero-main-img"
              />

              {/* Floating perk 1 */}
              <div className="floating-perk-card floating-perk-top">
                <div style={{ background: '#ecfdf5', color: '#10b981', padding: '8px', borderRadius: '50%' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Razorpay Verified</h5>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>100% Secure Checkout</p>
                </div>
              </div>

              {/* Floating perk 2 */}
              <div className="floating-perk-card floating-perk-bottom">
                <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '8px', borderRadius: '50%' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>Express Delivery</h5>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Dispatched within 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES STRIP ================= */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-circle">
                <Truck size={24} />
              </div>
              <div>
                <h4>Free Express Shipping</h4>
                <p>On orders above ₹999 with live tracking</p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4>Secure Payments</h4>
                <p>Protected by 256-bit SSL encryption</p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <RotateCcw size={24} />
              </div>
              <div>
                <h4>30-Day Easy Returns</h4>
                <p>Hassle-free refunds and replacements</p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle" style={{ background: '#fdf2f8', color: '#ec4899' }}>
                <Headphones size={24} />
              </div>
              <div>
                <h4>24/7 Dedicated Support</h4>
                <p>Prompt assistance anytime you need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Explore Collections</h2>
              <p className="section-subtitle">Handpicked categories tailored to elevate your daily routine</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {/* Category 1: Electronics */}
            <Link to="/products?category=Electronics" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Electronics"
                className="category-bg-img"
              />
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Electronics</h3>
                <span>Headphones, Audio & Tech →</span>
              </div>
            </Link>

            {/* Category 2: Fashion */}
            <Link to="/products?category=Fashion" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80"
                alt="Fashion"
                className="category-bg-img"
              />
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Fashion</h3>
                <span>Leather, Apparel & Footwear →</span>
              </div>
            </Link>

            {/* Category 3: Home */}
            <Link to="/products?category=Home" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80"
                alt="Home"
                className="category-bg-img"
              />
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Home Decor</h3>
                <span>Minimalist Ceramic & Living →</span>
              </div>
            </Link>

            {/* Category 4: Books */}
            <Link to="/products?category=Books" className="category-card">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                alt="Books"
                className="category-bg-img"
              />
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Books & Wisdom</h3>
                <span>Bestsellers & Productivity →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section className="section-padding" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header-row">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <TrendingUp size={16} /> TOP RATED PICKS
              </div>
              <h2 className="section-title">Trending This Week</h2>
              <p className="section-subtitle">The most loved items selected by our community</p>
            </div>
            <Link to="/products" className="btn btn-primary btn-sm">
              See All Items <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading curated collection...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="product-wishlist-btn"
                      title="Save to Wishlist"
                    >
                      <Heart size={18} />
                    </button>
                    <span className="product-badge-category">{product.category}</span>
                  </div>

                  <div className="product-card-body">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="product-card-title">{product.name}</h3>
                    </Link>
                    <p className="product-card-desc">{product.description}</p>

                    <div className="product-card-pricing">
                      <span className="product-price-current">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="product-price-original">₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="product-stock-tag stock-in">
                      <CheckCircle2 size={14} /> In Stock ({product.stock} left)
                    </div>

                    <div className="product-card-footer">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-card-cart"
                      >
                        <ShoppingBag size={16} /> Add to Cart
                      </button>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn-card-view"
                        title="View Details"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= PROMO BANNER ================= */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              borderRadius: '24px',
              padding: '4rem 3rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: '1px solid rgba(129, 140, 248, 0.4)',
                  padding: '0.35rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#818cf8',
                  marginBottom: '1rem'
                }}
              >
                LIMITED TIME SPECIAL OFFER
              </div>
              <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                Elevate Your Everyday With Premium Craftsmanship
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Enjoy flat 15% discount across all categories with seamless payments and guaranteed next-day dispatch.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop The Sale Now <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                alt="Featured Product"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  maxHeight: '320px',
                  margin: '0 auto',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h2 className="section-title">Loved by Thousands</h2>
            <p className="section-subtitle">Real feedback from genuine customers who shop on Shop Easy</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                "The AuraWave headphones exceeded every expectation. Packaging was premium and delivery arrived in 48 hours. Shop Easy is my new go-to store!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  R
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700 }}>Rohan Verma</h5>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Buyer • Bengaluru</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                "The Nordic Ceramic Coffee Set makes mornings so peaceful. Flawless UI on the website, smooth Razorpay checkout, zero hitches."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  A
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700 }}>Ananya Iyer</h5>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Buyer • Mumbai</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                "The Oxford leather jacket fits like a custom tailor job. High quality material, solid stitching, and great customer care."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  P
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700 }}>Priya Sharma</h5>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Buyer • Delhi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}