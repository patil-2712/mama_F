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
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  // FIXED: Improved getImageUrl function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    console.log('🖼️ Getting image URL for:', imagePath);
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it starts with /uploads/ (any variation)
    if (imagePath.startsWith('/uploads/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    // If it's just a filename
    return `${BASE_URL}/uploads/images/${imagePath}`;
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      let url = `${API_URL}/products?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      console.log("📡 Fetching products from:", url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("📦 Products data:", data);
      
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
      console.log("📡 Fetching categories...");
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("📦 Categories data:", data);
      
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
      console.log("📎 Image selected:", file.name, file.size, file.type);
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
      // FIXED: Set image preview using getImageUrl
      if (product.image) {
        const imageUrl = getImageUrl(product.image);
        setImagePreview(imageUrl);
        console.log("🖼️ Image preview set:", imageUrl);
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
        console.log("📸 Appending image file:", imageFile.name);
        formDataToSend.append('image', imageFile);
      }

      console.log("📤 Sending to:", url, method);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log("📥 Response:", data);

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

  return (
    <div className="admin-products">
      {/* Search and Filter */}
      <div className="product-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
        <div className="filter-right">
          <button className="add-product-btn" onClick={() => openModal()}>
            + Add New Product
          </button>
        </div>
      </div>

      {/* Random Categories */}
      {randomCategories.length > 0 && (
        <div className="random-categories">
          <span className="random-label">Popular Categories:</span>
          {randomCategories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Products Grid */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found</p>
                <button onClick={() => openModal()}>Add your first product</button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className="product-card-image"
                      onError={(e) => {
                        console.log("🖼️ Image failed to load:", product.image);
                        // Use a local placeholder instead of external URL
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23cccccc"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="20" fill="%23666666"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded:", product.image);
                      }}
                    />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    <div className="product-actions-overlay">
                      <button className="action-btn edit" onClick={() => openModal(product)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                  </div>
                  <div className="product-card-info">
                    <h3 className="product-card-name">{product.name}</h3>
                    <span className="product-card-category">{product.category}</span>
                    <div className="product-card-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.discount > 0 && (
                        <>
                          <span className="original-price">₹{Math.round(product.price / (1 - product.discount/100))}</span>
                          <span className="discount-badge">{product.discount}% OFF</span>
                        </>
                      )}
                    </div>
                    <div className="product-card-status">
                      <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className="product-quantity">Qty: {product.quantity || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => fetchProducts(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="page-btn"
                onClick={() => fetchProducts(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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

              <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
                  <label>Badge (Optional)</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="e.g., Organic, Bestseller"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image {!editingProduct && '*'}</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📸</span>
                    <p>Click to upload image</p>
                    <small>JPG, PNG, GIF, WebP (Max 5MB)</small>
                  </div>
                </div>
                <small className="file-hint">Click the box above to select an image</small>
                {imagePreview && (
                  <div className="image-preview-wrapper">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="image-preview"
                      onError={(e) => {
                        console.log("Preview image failed to load");
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect width="200" height="150" fill="%23cccccc"/%3E%3Ctext x="50" y="80" font-family="Arial" font-size="16" fill="%23666666"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
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

              <div className="form-group checkbox-group">
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
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
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