// src/admin/AdminCategories.jsx
import React, { useState, useEffect } from "react";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";
  const getToken = () => localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      
      const url = searchTerm 
        ? `${API_URL}/categories?search=${searchTerm}`
        : `${API_URL}/categories`;
      
      console.log("📡 Fetching categories from:", url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("📦 Categories data:", data);
      
      if (data.success) {
        // Handle different data formats
        let categoryList = [];
        
        if (Array.isArray(data.data)) {
          if (data.data.length > 0) {
            // Check if first item is a string or object
            if (typeof data.data[0] === 'string') {
              // Format: ["Category1", "Category2"]
              categoryList = data.data.map((name, index) => ({
                _id: `temp-${index}`,
                name: name,
                isActive: true,
                createdAt: new Date().toISOString()
              }));
            } else if (data.data[0] && typeof data.data[0] === 'object') {
              // Format: [{_id: "...", name: "Category1", ...}]
              categoryList = data.data;
            }
          }
        }
        
        console.log("📦 Processed categories:", categoryList);
        setCategories(categoryList);
      } else {
        setError(data.message || "Failed to fetch categories");
        // Set empty array on error
        setCategories([]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchCategories();
  }, []);

  // Search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open modal for creating/editing
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || ""
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: ""
      });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setError("");
    setSuccess("");
    setFormData({ name: "" });
  };

  // Handle submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError("Category name is required");
        setLoading(false);
        return;
      }

      const url = editingCategory 
        ? `${API_URL}/categories/${editingCategory._id}`
        : `${API_URL}/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';

      console.log(`📤 ${method} to:`, url);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim()
        })
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (data.success) {
        setSuccess(editingCategory ? "Category updated successfully!" : "Category created successfully!");
        fetchCategories();
        setTimeout(() => {
          closeModal();
          setSuccess("");
        }, 1500);
      } else {
        if (data.errors) {
          setError(data.errors.map(err => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong");
        }
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Category deleted successfully!");
        fetchCategories();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(`Category ${data.data.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchCategories();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle category status");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    fetchCategories();
  };

  // Safely get category name
  const getCategoryName = (category) => {
    if (!category) return '';
    if (typeof category === 'string') return category;
    if (category.name) return category.name;
    return '';
  };

  // Safely get category id
  const getCategoryId = (category) => {
    if (!category) return `temp-${Math.random()}`;
    if (typeof category === 'string') return `temp-${category}`;
    if (category._id) return category._id;
    return `temp-${Math.random()}`;
  };

  // Safely get category status
  const getCategoryStatus = (category) => {
    if (!category) return true;
    if (typeof category === 'string') return true;
    return category.isActive !== undefined ? category.isActive : true;
  };

  // Safely get category createdAt
  const getCategoryCreatedAt = (category) => {
    if (!category) return new Date().toISOString();
    if (typeof category === 'string') return new Date().toISOString();
    return category.createdAt || new Date().toISOString();
  };

  return (
    <div className="admin-categories">
      {/* Header */}
      <div className="categories-header">
        <h1 className="categories-title">Manage Categories</h1>
        <button className="add-category-btn" onClick={() => openModal()}>
          + Add New Category
        </button>
      </div>

      {/* Search and Filter */}
      <div className="categories-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
        <div className="filter-right">
          <span className="category-count">{categories.length} categories</span>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Categories Table */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="categories-list">
          {categories.length === 0 ? (
            <div className="no-categories">
              <p>No categories found</p>
              <button onClick={() => openModal()}>Add your first category</button>
            </div>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  const id = getCategoryId(category);
                  const name = getCategoryName(category);
                  const isActive = getCategoryStatus(category);
                  const createdAt = getCategoryCreatedAt(category);
                  
                  return (
                    <tr key={id || index}>
                      <td>{index + 1}</td>
                      <td className="category-name-cell">{name}</td>
                      <td>
                        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit"
                            onClick={() => openModal(category)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            className={`action-btn toggle ${isActive ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleStatus(id)}
                            title={isActive ? 'Deactivate' : 'Activate'}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;