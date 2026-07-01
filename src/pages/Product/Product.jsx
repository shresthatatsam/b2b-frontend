import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Product.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  status: "Active",
  categoryId: "",
  images: [],
};

export default function Products() {
  const [products, setProducts] = useState([]);
    const [Categories, setcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modal, setModal] = useState(null); // null | "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search/filter
  const [search, setSearch] = useState("");

  /* ── API calls ───────────────────────────────────────── */
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


    const fetchCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/Category");
      setcategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Category.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);


  const handleCreate = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "images") {
          v.forEach((f) => data.append("Images", f));
        } else {
          data.append(k.charAt(0).toUpperCase() + k.slice(1), v);
        }
      });
      await api.post("/Product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchProducts();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
  setSubmitting(true);
  setFormError("");
  try {
    const data = new FormData();
    data.append("CategoryId", form.categoryId);
    data.append("Name", form.name);
    data.append("Description", form.description);
    data.append("Price", parseFloat(form.price));
    data.append("Stock", parseInt(form.stock));
    data.append("Status", form.status);
    form.images.forEach((f) => data.append("Images", f));

    await api.put(`/Product/${selected.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchProducts();
    closeModal();
  } catch (err) {
    setFormError(err.response?.data?.message || "Failed to update product.");
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/product/${selected.id}`);
      await fetchProducts();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Modal helpers ───────────────────────────────────── */
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setModal("create");
  };

  const openEdit = (product) => {
    setSelected(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      categoryId: product.categoryId,
      images: [],
    });
    setFormError("");
    setModal("edit");
  };

  const openDelete = (product) => {
    setSelected(product);
    setFormError("");
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFiles = (e) => {
    setForm((f) => ({ ...f, images: Array.from(e.target.files) }));
  };

  /* ── Filtered list ───────────────────────────────────── */
  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="products-page">
      {/* Header row */}
      <div className="products-header">
        <div>
          <h2 className="products-title">Products</h2>
          <p className="products-sub">{products.length} items in catalog</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <div className="alert-error">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>📦</span>
          <p>No products found.</p>
          <button className="btn-primary" onClick={openCreate}>
            Add your first product
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      {p.images?.[0]?.imageUrl ? (
                      <img
                          src={`https://localhost:7168${p.images[0].imageUrl}`}
                          alt={p.name}
                          className="product-thumb"
                      />

                      ) : (
                        <div className="product-thumb placeholder">📦</div>
                      )}
                      <div>
                        <p className="product-name">{p.name}</p>
                        <p className="product-desc">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td-price">${Number(p.price).toFixed(2)}</td>
                  <td className="td-stock">{p.stock}</td>
                  <td>
                    <span className={`status-badge ${p.status?.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button
                        className="btn-icon edit"
                        onClick={() => openEdit(p)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => openDelete(p)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────── */}
      {(modal === "create" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === "create" ? "Add Product" : "Edit Product"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="alert-error">{formError}</div>}

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleField}
                    placeholder="Product name"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleField}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="OutOfStock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleField}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleField}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleField}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
               
          <div className="form-group">
  <label>Category</label>
  <select
    name="categoryId"
    value={form.categoryId}
    onChange={handleField}
    required
  >
    <option value="">Select Category</option>
    {Categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

              </div>

              {(modal === "create" || modal === "edit") && (
                <div className="form-group">
                  <label>Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="file-input"
                  />
                  {form.images.length > 0 && (
                    <p className="file-hint">{form.images.length} file(s) selected</p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={modal === "create" ? handleCreate : handleUpdate}
                disabled={submitting}
              >
                {submitting
                  ? "Saving…"
                  : modal === "create"
                  ? "Create Product"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Product</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert-error">{formError}</div>}
              <p className="delete-msg">
                Are you sure you want to delete{" "}
                <strong>{selected?.name}</strong>? This will also remove all
                associated images and cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
