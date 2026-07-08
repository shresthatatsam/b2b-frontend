import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../../services/api";
import "./ProductList.css";

const API_BASE = "https://localhost:7168"; // same backend base you use elsewhere

function getImageUrl(path) {
  return `${API_BASE}${path}`;
}

export default function ProductList() {
  const { categoryId } = useParams();
  const location = useLocation();

  // If we navigated here from Home via <Link state={{ category }}>, we already
  // have the category name and can render the heading instantly. If someone
  // lands here directly (refresh, shared link, back/forward), state is empty
  // and we fall back to fetching it below.
  const [category, setCategory] = useState(location.state?.category ?? null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const needsCategory = !location.state?.category;

        const [catResult, prodResult] = await Promise.allSettled([
          needsCategory
            ? api.get(`/Category/${categoryId}`) // adjust if your API uses a different single-category route
            : Promise.resolve(null),
          api.get(`/Product/GetProductByCategoryId/${categoryId}`),
        ]);

        if (cancelled) return;

        if (needsCategory && catResult.status === "fulfilled" && catResult.value) {
          setCategory(catResult.value.data);
        }

        if (prodResult.status === "fulfilled") {
          setProducts(prodResult.value.data);
        } else {
          setError(
            prodResult.reason?.response?.data?.message ||
              "Failed to load products for this category."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  if (loading) return <div className="category-page-loading">Loading…</div>;

  return (
    <div className="category-page">
      <div className="category-page-header">
        <Link to="/" className="back-link">&larr; Back home</Link>
        <h1>{category?.name || "Products"}</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {!error && products.length === 0 ? (
        <p className="empty-note">No products in this category yet.</p>
      ) : (
        <div className="category-product-grid">
          {products.map((item) => (
            <div key={item.id} className="category-product-card">
              <div className="category-product-image">
                {item.images?.[0]?.imageUrl ? (
                  <img src={getImageUrl(item.images[0].imageUrl)} alt={item.name} loading="lazy" />
                ) : (
                  <div className="category-product-image placeholder">📦</div>
                )}
              </div>
              <span className="category-product-name">{item.name}</span>
              <span className="category-product-price">Rs. {Number(item.price).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}