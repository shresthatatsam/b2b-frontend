import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

/**
 * Home Page
 * -------------------------------------------------
 * - Fetches categories dynamically for the navbar
 * - Clicking a category opens a mega-menu panel with that
 *   category's items (fetched on demand + cached)
 * - Login / Register buttons redirect to /login and /register via
 *   react-router-dom's useNavigate (requires this component to be
 *   rendered inside a <BrowserRouter>)
 *
 * Swap the two API endpoints below with your real backend routes.
 * Until then, mock data is used automatically if the fetch fails,
 * so the page always renders something.
 */


    const fetchCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/Category/GetAllCategories");
      setcategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Category.");
    } finally {
      setLoading(false);
    }
  };


const API_CATEGORIES_URL = "/api/GetAllCategories";
const API_CATEGORY_ITEMS_URL = (categoryId) => `/api/categories/${categoryId}/products`;

const MOCK_CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home-living", name: "Home & Living" },
  { id: "beauty", name: "Beauty" },
  { id: "sports", name: "Sports" },
];

const MOCK_ITEMS = {
  electronics: [
    { id: 1, name: "Wireless Earbuds", price: 2999, image: "https://picsum.photos/seed/earbuds/300/300" },
    { id: 2, name: "Smart Watch", price: 4999, image: "https://picsum.photos/seed/watch/300/300" },
    { id: 3, name: "Bluetooth Speaker", price: 1999, image: "https://picsum.photos/seed/speaker/300/300" },
    { id: 4, name: "Laptop Stand", price: 999, image: "https://picsum.photos/seed/stand/300/300" },
  ],
  fashion: [
    { id: 5, name: "Denim Jacket", price: 2499, image: "https://picsum.photos/seed/jacket/300/300" },
    { id: 6, name: "Running Shoes", price: 3299, image: "https://picsum.photos/seed/shoes/300/300" },
    { id: 7, name: "Leather Bag", price: 3999, image: "https://picsum.photos/seed/bag/300/300" },
    { id: 8, name: "Sunglasses", price: 899, image: "https://picsum.photos/seed/glasses/300/300" },
  ],
  "home-living": [
    { id: 9, name: "Ceramic Vase", price: 799, image: "https://picsum.photos/seed/vase/300/300" },
    { id: 10, name: "Table Lamp", price: 1599, image: "https://picsum.photos/seed/lamp/300/300" },
    { id: 11, name: "Throw Blanket", price: 1299, image: "https://picsum.photos/seed/blanket/300/300" },
    { id: 12, name: "Wall Clock", price: 1099, image: "https://picsum.photos/seed/clock/300/300" },
  ],
  beauty: [
    { id: 13, name: "Face Serum", price: 699, image: "https://picsum.photos/seed/serum/300/300" },
    { id: 14, name: "Matte Lipstick", price: 499, image: "https://picsum.photos/seed/lipstick/300/300" },
    { id: 15, name: "Hair Dryer", price: 1899, image: "https://picsum.photos/seed/dryer/300/300" },
    { id: 16, name: "Perfume", price: 2199, image: "https://picsum.photos/seed/perfume/300/300" },
  ],
  sports: [
    { id: 17, name: "Yoga Mat", price: 899, image: "https://picsum.photos/seed/yoga/300/300" },
    { id: 18, name: "Dumbbell Set", price: 2599, image: "https://picsum.photos/seed/dumbbell/300/300" },
    { id: 19, name: "Cricket Bat", price: 1799, image: "https://picsum.photos/seed/bat/300/300" },
    { id: 20, name: "Football", price: 699, image: "https://picsum.photos/seed/football/300/300" },
  ],
};

export default function Home({ onCategorySelect, onProductClick }) {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [itemsCache, setItemsCache] = useState({});
  const [itemsLoading, setItemsLoading] = useState(false);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navRef = useRef(null);

  // ---- Fetch categories on mount ----
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const res = await fetch(API_CATEGORIES_URL);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (!cancelled) setCategories(data);
      } catch (err) {
        // Fall back to mock data so the UI still works during development
        if (!cancelled) setCategories(MOCK_CATEGORIES);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
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
      const res = await fetch(API_CATEGORY_ITEMS_URL(category.id));
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItemsCache((prev) => ({ ...prev, [category.id]: data }));
    } catch (err) {
      setItemsCache((prev) => ({
        ... ,
        [category.id]: MOCK_ITEMS[category.id] || [],
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

          <nav className={`nav-links ${mobileNavOpen ? "is-open" : ""}`}>
            {categoriesLoading ? (
              <div className="nav-skeleton">
                {[1, 2, 3, 4].map((n) => (
                  <span key={n} className="skeleton-pill" />
                ))}
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`nav-link ${activeCategory?.id === cat.id && panelOpen ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.name}
                  <svg
                    className="chevron"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              ))
            )}
          </nav>

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
                    <button
                      key={item.id}
                      className="item-card"
                      onClick={() => onProductClick?.(item)}
                    >
                      <div className="item-image">
                        <img src={item.image} alt={item.name} loading="lazy" />
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

              <a className="view-all" href={`/category/${activeCategory.id}`}>
                View all {activeCategory.name} &rarr;
              </a>
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
        <div className="category-grid">
          {(categoriesLoading ? MOCK_CATEGORIES : categories).map((cat, i) => (
            <button
              key={cat.id}
              className="category-tile"
              style={{ "--tile-index": i }}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="category-tile-name">{cat.name}</span>
              <span className="category-tile-arrow">&rarr;</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}