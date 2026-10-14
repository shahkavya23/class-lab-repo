import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { addToCartState } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  X
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [singleQty, setSingleQty] = useState(1);

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sync category from URL search params if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const endpoint = id
      ? `http://localhost:8082/products/${id}`
      : 'http://localhost:8082/products';

    const params = id ? {} : {};
    if (!id) {
      if (search) params.search = search;
      if (category) params.category = category;
    }

    axios
      .get(endpoint, { params })
      .then((response) => {
        if (id) {
          setProducts(response.data ? [response.data] : []);
        } else {
          setProducts(response.data?.products || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [id, category, search]);

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
        showToast('This item is already in your wishlist!', 'info');
      } else {
        showToast('Failed to add to wishlist', 'error');
      }
    }
  };

  const handleAddToCart = async (product, qty = 1) => {
    dispatch(addToCartState({ ...product, quantity: qty }));
    showToast(`Added ${qty > 1 ? `${qty}x ` : ''}"${product.name}" to your cart! 🛒`, 'success');

    if (user) {
      try {
        await axios.post(
          `http://localhost:8082/cart/${product._id}`,
          { quantity: qty },
          { withCredentials: true }
        );
      } catch (error) {
        console.error('Failed to sync to cart database', error);
      }
    }
  };

  const handleBuyNow = async (product) => {
    await handleAddToCart(product, singleQty);
    navigate('/checkout');
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Books'];

  // ================= SINGLE PRODUCT DETAIL VIEW =================
  if (id && products.length > 0) {
    const product = products[0];
    return (
      <div className="product-detail-wrapper container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Store</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div className="detail-layout-grid">
          {/* Gallery View */}
          <div className="detail-gallery-container">
            <img
              src={product.image}
              alt={product.name}
              className="detail-main-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Details Pane */}
          <div className="detail-info-pane">
            <span className="detail-category-badge">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating-row">
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span>4.9 (120+ verified ratings)</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price-main">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="product-price-original" style={{ fontSize: '1.15rem' }}>
                ₹{Math.round(product.price * 1.3).toLocaleString('en-IN')}
              </span>
              <span className="detail-discount-tag">Save 23% Today</span>
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Perks checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#10b981', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> In Stock & Ready to Dispatch ({product.stock} units available)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#64748b' }}>
                <Truck size={18} color="#0ea5e9" /> Free Express Delivery across India on this item
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#64748b' }}>
                <RotateCcw size={18} color="#f59e0b" /> 30-Day Hassle-Free Returns & Replacement
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#64748b' }}>
                <ShieldCheck size={18} color="#4f46e5" /> 1-Year Comprehensive Warranty Included
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Quantity:</span>
              <div className="quantity-stepper">
                <button
                  className="stepper-btn"
                  onClick={() => setSingleQty(Math.max(1, singleQty - 1))}
                >
                  -
                </button>
                <span className="stepper-count">{singleQty}</span>
                <button
                  className="stepper-btn"
                  onClick={() => setSingleQty(Math.min(product.stock || 10, singleQty + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="detail-actions-row">
              <button
                onClick={() => handleAddToCart(product, singleQty)}
                className="btn btn-outline btn-lg"
                style={{ flex: 1 }}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(product)}
                className="btn btn-primary btn-lg"
                style={{ flex: 1.2 }}
              >
                Buy Now <ArrowRight size={20} />
              </button>
              <button
                onClick={() => handleAddToWishlist(product)}
                className="btn btn-outline"
                style={{ width: '52px', height: '52px', padding: 0 }}
                title="Add to Wishlist"
              >
                <Heart size={22} color="#ef4444" />
              </button>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                <ArrowLeft size={18} /> Back to Product Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= CATALOG GRID VIEW =================
  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Explore Our Store
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse premium items across tech, apparel, interior decor, and literature
        </p>
      </div>

      {/* Toolbar: Search, Categories, Sort */}
      <div className="catalog-toolbar">
        <div className="toolbar-top-row">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-prefix" />
            <input
              type="text"
              placeholder="Search by product name, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-field"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-filter-box"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map((cat) => {
            const isSelected = cat === 'All' ? !category : category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  const val = cat === 'All' ? '' : cat;
                  setCategory(val);
                  setSearchParams(val ? { category: val } : {});
                }}
                className={`category-pill-btn ${isSelected ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Products Grid / States */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading items...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <Search size={32} />
          </div>
          <h3>No products found</h3>
          <p>We couldn't find any items matching your search or filters. Try adjusting your query or browsing all categories.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('');
              setSearchParams({});
            }}
            className="btn btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-box">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="product-wishlist-btn"
                  title="Add to Wishlist"
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
                  <CheckCircle2 size={14} /> In Stock ({product.stock} units)
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
  );
}
