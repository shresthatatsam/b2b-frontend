import React, { useEffect } from "react";
import "./CategorySidebar.css";

/**
 * Amazon-style slide-in sidebar: a dark panel that slides in from the left,
 * listing every category plus account shortcuts. Fully controlled — Home
 * owns the `open` state and the category data, this just renders it.
 */
export default function CategorySidebar({
  open,
  onClose,
  categories,
  categoriesLoading,
  onCategoryClick,
  onLoginClick,
  onRegisterClick,
}) {
  // Lock page scroll while the sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`category-sidebar ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-label="Shop by category"
      >
        <div className="sidebar-account">
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            &times;
          </button>
          <p className="sidebar-greeting">Hello, sign in</p>
          <button
            className="sidebar-signin"
            onClick={() => {
              onClose();
              onLoginClick();
            }}
          >
            Log in
          </button>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Shop by Category</h4>
          <ul className="sidebar-list">
            {categoriesLoading ? (
              [1, 2, 3, 4, 5, 6].map((n) => <li key={n} className="sidebar-skeleton" />)
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className="sidebar-link"
                    onClick={() => {
                      onCategoryClick(cat);
                      onClose();
                    }}
                  >
                    {cat.name}
                    <svg className="sidebar-chevron" width="8" height="12" viewBox="0 0 8 12" fill="none">
                      <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              <li className="sidebar-empty">No categories available right now.</li>
            )}
          </ul>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Help &amp; Settings</h4>
          <ul className="sidebar-list">
            <li>
              <button
                className="sidebar-link"
                onClick={() => {
                  onClose();
                  onRegisterClick();
                }}
              >
                Create an account
              </button>
            </li>
            <li>
              <button
                className="sidebar-link"
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
              >
                Log in
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}