import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Category.css";

const EMPTY_FORM = {
  name: "",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
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
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/Category");
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      await api.post("/Category", { name: form.name });
      await fetchCategories();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      await api.put(`/Category/${selected.id}`, { name: form.name });
      await fetchCategories();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/Category/${selected.id}`);
      await fetchCategories();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete category.");
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

  const openEdit = (category) => {
    setSelected(category);
    setForm({ name: category.name });
    setFormError("");
    setModal("edit");
  };

  const openDelete = (category) => {
    setSelected(category);
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

  /* ── Filtered list ───────────────────────────────────── */
  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="categories-page">
      {/* Header row */}
      <div className="categories-header">
        <div>
          <h2 className="categories-title">Categories</h2>
          <p className="categories-sub">{categories.length} categories</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Add Category
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <div className="alert-error">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading categories…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>🗂️</span>
          <p>No categories found.</p>
          <button className="btn-primary" onClick={openCreate}>
            Add your first category
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Business</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="category-cell">
                      <div className="category-icon">🏷️</div>
                      <div>
                        <p className="category-name">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td-business">{c.businessName || "—"}</td>
                  <td>
                    <div className="action-row">
                      <button
                        className="btn-icon edit"
                        onClick={() => openEdit(c)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => openDelete(c)}
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
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === "create" ? "Add Category" : "Edit Category"}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="alert-error">{formError}</div>}

            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleField}
                  placeholder="e.g. Electronics"
                  autoFocus
                />
              </div>
              {modal === "edit" && selected?.businessName && (
                <p className="field-hint">Business: {selected.businessName}</p>
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
                  ? "Create Category"
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
              <h3>Delete Category</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert-error">{formError}</div>}
              <p className="delete-msg">
                Are you sure you want to delete{" "}
                <strong>{selected?.name}</strong>? This can't be undone, and
                any products using this category may be affected.
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