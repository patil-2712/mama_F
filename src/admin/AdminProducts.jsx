// src/admin/AdminProducts.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [randomCategories, setRandomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000/api/admin";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    description: "",
    category: "",
    badge: "",
    inStock: true,
    quantity: ""
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${BASE_URL}${imagePath}`;
    return `${BASE_URL}/uploads/images/${imagePath}`;
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      let url = `${API_URL}/products?page=${page}&limit=12`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch products");
        if (data.message === "Not authorized") {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        let categoryNames = [];
        if (data.data && Array.isArray(data.data)) {
          if (data.data.length > 0) {
            if (typeof data.data[0] === 'string') {
              categoryNames = data.data;
            } else if (data.data[0] && data.data[0].name) {
              categoryNames = data.data.map(cat => cat.name);
            }
          }
        }
        
        if (categoryNames.length === 0) {
          const fallbackCategories = [
            'Sports Nutrition', 'Health Drinks', 'Organic Tea', 'Organic Spices',
            'Superfoods', 'Baby Food', 'Dry Fruits', 'Organic Millet',
            'Organic Seeds', 'Healthy Snacks', 'Organic Pulses',
            'Natural Sweeteners', 'Cooking Oils', 'Dairy', 'Gluten Free Pasta'
          ];
          categoryNames = fallbackCategories;
        }
        
        setCategories(categoryNames);
        const shuffled = [...categoryNames].sort(() => 0.5 - Math.random());
        setRandomCategories(shuffled.slice(0, 5));
      } else {
        const fallbackCategories = [
          'Sports Nutrition', 'Health Drinks', 'Organic Tea', 'Organic Spices',
          'Superfoods', 'Baby Food', 'Dry Fruits', 'Organic Millet',
          'Organic Seeds', 'Healthy Snacks', 'Organic Pulses',
          'Natural Sweeteners', 'Cooking Oils', 'Dairy', 'Gluten Free Pasta'
        ];
        setCategories(fallbackCategories);
        const shuffled = [...fallbackCategories].sort(() => 0.5 - Math.random());
        setRandomCategories(shuffled.slice(0, 5));
      }
    } catch (err) {
      console.error("❌ Categories fetch error:", err);
      const fallbackCategories = [
        'Sports Nutrition', 'Health Drinks', 'Organic Tea', 'Organic Spices',
        'Superfoods', 'Baby Food', 'Dry Fruits', 'Organic Millet',
        'Organic Seeds', 'Healthy Snacks', 'Organic Pulses',
        'Natural Sweeteners', 'Cooking Oils', 'Dairy', 'Gluten Free Pasta'
      ];
      setCategories(fallbackCategories);
      const shuffled = [...fallbackCategories].sort(() => 0.5 - Math.random());
      setRandomCategories(shuffled.slice(0, 5));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "" || selectedCategory !== "") {
        fetchProducts(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        discount: product.discount?.toString() || "",
        description: product.description,
        category: product.category,
        badge: product.badge || "",
        inStock: product.inStock,
        quantity: product.quantity?.toString() || ""
      });
      if (product.image) {
        const imageUrl = getImageUrl(product.image);
        setImagePreview(imageUrl);
      } else {
        setImagePreview("");
      }
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        discount: "",
        description: "",
        category: "",
        badge: "",
        inStock: true,
        quantity: ""
      });
      setImagePreview("");
      setImageFile(null);
    }
    setShowModal(true);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setError("");
    setSuccess("");
    setImagePreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError("Product name is required");
        setLoading(false);
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Valid price is required");
        setLoading(false);
        return;
      }
      if (!formData.category) {
        setError("Category is required");
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError("Description is required");
        setLoading(false);
        return;
      }
      if (!imageFile && !editingProduct) {
        setError("Product image is required");
        setLoading(false);
        return;
      }

      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discount', formData.discount || 0);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('badge', formData.badge || '');
      formDataToSend.append('inStock', formData.inStock);
      formDataToSend.append('quantity', formData.quantity || 0);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        fetchProducts(currentPage);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Product deleted successfully!");
        fetchProducts(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    fetchProducts(1);
  };

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="header-icon-wrapper">
            <span className="header-icon">📦</span>
          </div>
          <div>
            <h1>Products</h1>
            <p>Manage your product inventory</p>
          </div>
        </div>
        <div className="page-header-right">
          <span className="total-badge">{totalProducts} Products</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-box-icon">📦</div>
          <div className="stat-box-content">
            <span className="stat-box-label">Total Products</span>
            <span className="stat-box-value">{totalProducts}</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon green">✅</div>
          <div className="stat-box-content">
            <span className="stat-box-label">In Stock</span>
            <span className="stat-box-value green">{inStockCount}</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon red">❌</div>
          <div className="stat-box-content">
            <span className="stat-box-label">Out of Stock</span>
            <span className="stat-box-value red">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-left">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="btn-reset" onClick={resetFilters}>↺ Reset</button>
        </div>
        <div className="filters-right">
          <button className="btn-add" onClick={() => openModal()}>
            <span>+</span> Add Product
          </button>
        </div>
      </div>

      {/* Popular Categories */}
      {randomCategories.length > 0 && (
        <div className="popular-section">
          <div className="popular-left">
            <span className="popular-label">🔥 Popular:</span>
            {randomCategories.map((cat) => (
              <button
                key={cat}
                className={`popular-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="popular-right">
            <span className="popular-count">{products.length} Products</span>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && <div className="alert error">⚠️ {error}</div>}
      {success && <div className="alert success">✅ {success}</div>}

      {/* Products Grid */}
      {loading ? (
        <div className="loading-state">⏳ Loading products...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Products Found</h3>
                <p>Start by adding your first product</p>
                <button className="btn-add-large" onClick={() => openModal()}>
                  <span>+</span> Add Product
                </button>
              </div>
            ) : (
              products.map((product) => {
                const imageUrl = getImageUrl(product.image);
                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image-wrap">
                      <img 
                        src={imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23e8f0fe"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="20" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E'} 
                        alt={product.name} 
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23e8f0fe"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="20" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      <div className="product-overlay">
                        <button className="overlay-btn edit" onClick={() => openModal(product)}>✏️</button>
                        <button className="overlay-btn delete" onClick={() => handleDelete(product._id)}>🗑️</button>
                      </div>
                    </div>
                    <div className="product-details">
                      <h4 className="product-title">{product.name}</h4>
                      <span className="product-category">{product.category}</span>
                      <div className="product-pricing">
                        <span className="product-price">₹{product.price}</span>
                        {product.discount > 0 && (
                          <>
                            <span className="product-original">₹{Math.round(product.price / (1 - product.discount/100))}</span>
                            <span className="product-discount">-{product.discount}%</span>
                          </>
                        )}
                      </div>
                      <div className="product-meta">
                        <span className={`meta-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="meta-qty">Qty: {product.quantity || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => fetchProducts(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="page-btn"
                onClick={() => fetchProducts(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingProduct ? '✏️ Edit Product' : '📦 Add Product'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-field">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                </div>
                <div className="form-field">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Badge</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="e.g., Organic, Bestseller"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Product Image {!editingProduct && '*'}</label>
                <div className="upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="upload-input"
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">🖼️</span>
                    <p>Click to upload image</p>
                    <small>JPG, PNG, GIF, WebP (Max 5MB)</small>
                  </div>
                </div>
                {imagePreview && (
                  <div className="preview-wrap">
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                    <button
                      type="button"
                      className="preview-remove"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  In Stock
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;