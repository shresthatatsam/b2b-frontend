import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import CategorySidebar from "../Category/CategorySidebar";
import "./Home.css";

const API_BASE = "https://localhost:7168"; // ⚠️ CHANGE THIS to your ASP.NET backend's actual port.

function getImageUrl(path) {
  return `${API_BASE}${path}`;
}

const EMPTY_MOCK_ITEMS = {}; // fallback so a failed fetch never crashes on undefined

export default function Home({ onCategorySelect, onProductClick }) {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [activeCategory, setActiveCategory] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [itemsCache, setItemsCache] = useState({});
  const [itemsLoading, setItemsLoading] = useState(false);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navRef = useRef(null);

  // ---- Fetch categories on mount ----
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const res = await api.get("/Category/GetAllCategories");
        if (!cancelled) setCategories(res.data);
      } catch (err) {
        if (!cancelled) {
          setCategories([]);
          if (err.response?.status === 401) {
            setCategoriesError("Not authenticated — please log in.");
          } else {
            setCategoriesError(
              err.response?.data?.message || "Failed to load categories."
            );
          }
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);


const [mostViewedProducts, setMostViewedProducts] = useState([]);
const [productsLoading, setProductsLoading] = useState(true);
const productSliderRef = useRef(null);
useEffect(() => {
  async function loadProducts() {
    try {
      const res = await api.get("/Product/GetMostViewedProducts");
      setMostViewedProducts(res.data);
    } catch (err) {
      setMostViewedProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  loadProducts();
}, []);

  // ---- Close the mega-menu when clicking outside the navbar ----
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const categorySliderRef = useRef(null);
  useEffect(() => {
  const slider = categorySliderRef.current;
  if (!slider) return;

  const interval = setInterval(() => {
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      slider.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  }, 2000); // Scroll every 2 seconds

  return () => clearInterval(interval);
}, []);

  // ---- Fetch items for a category (with cache) on click ----
  async function handleCategoryClick(category) {
    // Toggle: clicking the already-open category closes the panel
    if (activeCategory?.id === category.id && panelOpen) {
      setPanelOpen(false);
      return;
    }

    setActiveCategory(category);
    setPanelOpen(true);
    onCategorySelect?.(category);

    if (itemsCache[category.id]) return; // already have it

    setItemsLoading(true);
    try {
      const res = await api.get(`/Product/GetProductByCategoryId/${category.id}`);
      setItemsCache((prev) => ({ ...prev, [category.id]: res.data }));
    } catch (err) {
      setItemsCache((prev) => ({
        ...prev,
        [category.id]: EMPTY_MOCK_ITEMS[category.id] || [],
      }));
    } finally {
      setItemsLoading(false);
    }
  }

  const activeItems = activeCategory ? itemsCache[activeCategory.id] : null;

  return (
    <div className="home-page">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="navbar" ref={navRef}>
        <div className="navbar-row">
          <button
            className="hamburger-trigger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open all categories"
          >
            <span className="bars">
              <span />
              <span />
              <span />
            </span>
           
          </button>

          <a className="brand" href="/">
            <span className="brand-mark">Ma</span>
            <span className="brand-rest">rket</span>
          </a>

          <button
            className="mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="navbar-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search products..." aria-label="Search products" />
          </div>

          <div className="auth-buttons">
            <button className="btn btn-ghost" onClick={handleLoginClick}>
              Log in
            </button>
            <button className="btn btn-solid" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        </div>

        {categoriesError && (
          <div className="categories-banner" role="status">
            {categoriesError}
          </div>
        )}

        {/* ---------------- MEGA MENU PANEL ---------------- */}
        <div className={`mega-panel ${panelOpen ? "open" : ""}`}>
          {activeCategory && (
            <div className="mega-panel-inner">
              <div className="mega-panel-header">
                <h3>{activeCategory.name}</h3>
                <button className="close-panel" onClick={() => setPanelOpen(false)} aria-label="Close">
                  &times;
                </button>
              </div>

              {itemsLoading && !activeItems ? (
                <div className="mega-grid">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="item-card skeleton-card" />
                  ))}
                </div>
              ) : (
                <div className="mega-grid">
                  {(activeItems || []).map((item) => (
                    <button key={item.id} className="item-card" onClick={() => onProductClick?.(item)}>
                      <div className="item-image">
                        <img src={getImageUrl(item.images[0].imageUrl)} alt={item.name} loading="lazy" />
                      </div>
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">Rs. {item.price.toLocaleString()}</span>
                    </button>
                  ))}
                  {activeItems && activeItems.length === 0 && (
                    <p className="empty-note">No products in this category yet.</p>
                  )}
                </div>
              )}

              {/*
                Link (not <a>) so this is a client-side route change, not a full
                page reload. We pass the category along in `state` so ProductList
                can render the heading instantly without an extra fetch — it only
                falls back to fetching /Category/:id if someone lands here directly
                (refresh, shared link, browser back/forward).
              */}
              <Link
                className="view-all"
                to={`/Product/ProductList/${activeCategory.id}`}
                state={{ category: activeCategory }}
              >
                View all {activeCategory.name} &rarr;
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">New arrivals, every week</p>
          <h1>
            Everything you need,
            <br />
            shelved by what it's <em>for</em>.
          </h1>
          <p className="hero-sub">
            Browse categories straight from the menu above, or dive into this
            week's picks below. No account needed to look around.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid btn-lg" href="/shop">
              Start shopping
            </a>
            <button className="btn btn-ghost btn-lg" onClick={handleRegisterClick}>
              Create an account
            </button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-swatch swatch-1" />
          <div className="hero-swatch swatch-2" />
          <div className="hero-swatch swatch-3" />
        </div>
      </section>

      {/* ---------------- CATEGORY GRID (visual entry points) ---------------- */}
      <section className="category-grid-section">
        <div className="section-heading">
          <h2>Shop by category</h2>
          <span className="section-rule" />
        </div>
        <div className="category-grid" ref={categorySliderRef}>
          {categoriesLoading ? (
            [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="category-tile skeleton-card" />
            ))
          ) : categories.length > 0 ? (
            categories.map((cat, i) => (
              <button
                key={cat.id}
                className="category-tile"
                style={{ "--tile-index": i }}
                onClick={() => handleCategoryClick(cat)}
              >
                <span className="category-tile-name">{cat.name}</span>
                <span className="category-tile-arrow">&rarr;</span>
              </button>
            ))
          ) : (
            <p className="empty-note">No categories available right now.</p>
          )}
        </div>
      </section>

  {/* ---------------- Most Viewed ---------------- */}
   <section className="most-viewed-section">
  <div className="section-heading">
    <h2>Most Viewed Products</h2>
    <span className="section-rule" />
  </div>

  <div className="product-slider" ref={productSliderRef}>
    {productsLoading ? (
      [1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="product-card skeleton-card" />
      ))
    ) : mostViewedProducts.length > 0 ? (
      mostViewedProducts.map((product) => (
        <button
          key={product.id}
          className="product-card"
          onClick={() => onProductClick(product)}
        >
          <img
            src={getImageUrl(product.images[0].imageUrl)}
            alt={product.name}
          />

          <h4>{product.name}</h4>

          <p>Rs. {product.price.toLocaleString()}</p>
        </button>
      ))
    ) : (
      <p className="empty-note">No products available.</p>
    )}
  </div>
</section>

      <CategorySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onCategoryClick={handleCategoryClick}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
    </div>
  );
}