// src/admin/AdminBanners.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminBanners.css";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000/api/admin";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    position: "hero",
    order: 0,
    isActive: true,
    isFeatured: false,
    startDate: "",
    endDate: ""
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBanners();
  }, []);

  const fetchBanners = async (page = 1) => {
    try {
      setLoading(true);
      let url = `${API_URL}/banners?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedPosition) url += `&position=${selectedPosition}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setBanners(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch banners");
        if (data.message === "Not authorized") {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBanners(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedPosition]);

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

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        description: banner.description,
        buttonText: banner.buttonText || "Shop Now",
        buttonLink: banner.buttonLink || "/shop",
        position: banner.position || "hero",
        order: banner.order || 0,
        isActive: banner.isActive,
        isFeatured: banner.isFeatured || false,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : "",
        endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : ""
      });
      setImagePreview(banner.image ? `${BASE_URL}${banner.image}` : "");
      setImageFile(null);
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        position: "hero",
        order: 0,
        isActive: true,
        isFeatured: false,
        startDate: "",
        endDate: ""
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
    setEditingBanner(null);
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
      if (!formData.title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError("Description is required");
        setLoading(false);
        return;
      }
      if (!imageFile && !editingBanner) {
        setError("Banner image is required");
        setLoading(false);
        return;
      }

      const url = editingBanner
        ? `${API_URL}/banners/${editingBanner._id}`
        : `${API_URL}/banners`;

      const method = editingBanner ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('subtitle', formData.subtitle.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('isFeatured', formData.isFeatured);
      if (formData.startDate) formDataToSend.append('startDate', formData.startDate);
      if (formData.endDate) formDataToSend.append('endDate', formData.endDate);

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
        setSuccess(editingBanner ? "Banner updated successfully!" : "Banner created successfully!");
        fetchBanners(currentPage);
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
      console.error("Submit error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Banner deleted successfully!");
        fetchBanners(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete banner");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/banners/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchBanners(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle banner status");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPosition("");
    fetchBanners(1);
  };

  return (
    <div className="admin-banners">
      <div className="banner-header">
        <h1 className="banner-title">Banner Management</h1>
        <button className="add-banner-btn" onClick={() => openModal()}>
          + Add New Banner
        </button>
      </div>

      {/* Filters */}
      <div className="banner-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="position-filter"
          >
            <option value="">All Positions</option>
            <option value="hero">Hero</option>
            <option value="featured">Featured</option>
            <option value="promotion">Promotion</option>
            <option value="sidebar">Sidebar</option>
          </select>
          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Banners Grid */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="banners-grid">
            {banners.length === 0 ? (
              <div className="no-banners">
                <p>No banners found</p>
                <button onClick={() => openModal()}>Add your first banner</button>
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner._id} className="banner-card">
                  <div className="banner-image-container">
                    <img
                      src={getImageUrl(banner.image)}
                      alt={banner.title}
                      className="banner-card-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=No+Image';
                      }}
                    />
                    <div className="banner-status-badge">
                      <span className={`status-badge ${banner.isActive ? 'active' : 'inactive'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {banner.isFeatured && (
                        <span className="featured-badge">★ Featured</span>
                      )}
                    </div>
                    <div className="banner-actions-overlay">
                      <button className="action-btn edit" onClick={() => openModal(banner)}>
                        Edit
                      </button>
                      <button
                        className="action-btn toggle"
                        onClick={() => toggleStatus(banner._id)}
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(banner._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="banner-card-info">
                    <div className="banner-card-header">
                      <h3 className="banner-card-title">{banner.title}</h3>
                      <span className="banner-position">{banner.position}</span>
                    </div>
                    {banner.subtitle && (
                      <p className="banner-card-subtitle">{banner.subtitle}</p>
                    )}
                    <p className="banner-card-description">{banner.description}</p>
                    <div className="banner-card-footer">
                      <div className="banner-button-info">
                        <span className="button-text">Button: {banner.buttonText}</span>
                        <span className="button-link">Link: {banner.buttonLink}</span>
                      </div>
                      <div className="banner-card-meta">
                        <span className="banner-order">Order: {banner.order}</span>
                        <span className="banner-date">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
                onClick={() => fetchBanners(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                className="page-btn"
                onClick={() => fetchBanners(currentPage + 1)}
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
              <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="banner-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter banner title"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter subtitle (optional)"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter banner description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="Shop Now"
                  />
                </div>
                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleChange}
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  >
                    <option value="hero">Hero</option>
                    <option value="featured">Featured</option>
                    <option value="promotion">Promotion</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Banner Image {!editingBanner && '*'}</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <small className="file-hint">Supported: JPG, PNG, GIF, WebP (Max 5MB)</small>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
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
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-row checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;