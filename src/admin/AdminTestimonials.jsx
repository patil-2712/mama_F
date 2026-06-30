// src/admin/AdminTestimonials.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminTestimonials.css";

const DEFAULT_AVATAR = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#e5e7eb"/>
  <circle cx="50" cy="35" r="20" fill="#9ca3af"/>
  <circle cx="50" cy="85" r="30" fill="#9ca3af"/>
  <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#6b7280" font-size="14" font-family="Arial, sans-serif">User</text>
</svg>
`)}`;

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    position: "",
    rating: 5,
    isActive: true,
    order: 0
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      
      let url = `${API_URL}/admin/testimonials?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;

      console.log("🔍 Fetching testimonials from:", url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Testimonials data:", data);

      if (data.success) {
        setTestimonials(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch testimonials");
        if (data.message === "Not authorized" || response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch testimonials: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        fetchTestimonials(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      console.log("📁 Image selected:", file.name, file.size);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        text: testimonial.text,
        position: testimonial.position || "",
        rating: testimonial.rating || 5,
        isActive: testimonial.isActive,
        order: testimonial.order || 0
      });
      // Set image preview from existing testimonial
      if (testimonial.image) {
        const imageUrl = testimonial.image.startsWith('http') 
          ? testimonial.image 
          : `${BASE_URL}${testimonial.image}`;
        setImagePreview(imageUrl);
        console.log("🖼️ Image preview set:", imageUrl);
      } else {
        setImagePreview("");
      }
      setImageFile(null);
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        text: "",
        position: "",
        rating: 5,
        isActive: true,
        order: 0
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
    setEditingTestimonial(null);
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
        setError("Name is required");
        setLoading(false);
        return;
      }
      if (!formData.text.trim()) {
        setError("Testimonial text is required");
        setLoading(false);
        return;
      }
      if (!imageFile && !editingTestimonial) {
        setError("Testimonial image is required");
        setLoading(false);
        return;
      }

      const url = editingTestimonial 
        ? `${API_URL}/admin/testimonials/${editingTestimonial._id}`
        : `${API_URL}/admin/testimonials`;
      
      const method = editingTestimonial ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('text', formData.text.trim());
      formDataToSend.append('position', formData.position || '');
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('order', formData.order || 0);

      if (imageFile) {
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
        setSuccess(editingTestimonial ? "Testimonial updated successfully!" : "Testimonial created successfully!");
        fetchTestimonials(currentPage);
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
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Testimonial deleted successfully!");
        fetchTestimonials(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete testimonial");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/testimonials/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchTestimonials(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_AVATAR;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${BASE_URL}${imagePath}`;
    }
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '⭐'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  return (
    <div className="admin-testimonials">
      <div className="testimonials-header">
        <h1 className="testimonials-title">Testimonials Management</h1>
        <button className="add-testimonial-btn" onClick={() => openModal()}>
          + Add New Testimonial
        </button>
      </div>

      <div className="testimonials-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="testimonials-grid">
            {testimonials.length === 0 ? (
              <div className="no-testimonials">
                <p>No testimonials found</p>
                <button onClick={() => openModal()}>Add your first testimonial</button>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial._id} className="testimonial-card">
                  <div className="testimonial-card-image">
                    <img 
                      src={getImageUrl(testimonial.image)} 
                      alt={testimonial.name}
                      onError={(e) => {
                        console.log("🖼️ Image failed to load:", testimonial.image);
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="testimonial-status">
                      <span className={`status-badge ${testimonial.isActive ? 'active' : 'inactive'}`}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="testimonial-card-content">
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <div className="testimonial-rating">{renderStars(testimonial.rating || 5)}</div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    {testimonial.position && (
                      <p className="testimonial-position">{testimonial.position}</p>
                    )}
                    <div className="testimonial-card-actions">
                      <button className="action-btn edit" onClick={() => openModal(testimonial)}>Edit</button>
                      <button className="action-btn toggle" onClick={() => toggleStatus(testimonial._id)}>
                        {testimonial.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(testimonial._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => fetchTestimonials(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="page-btn"
                onClick={() => fetchTestimonials(currentPage + 1)}
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
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="testimonial-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Testimonial Text *</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter testimonial text"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Position/Title</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g., CEO, Customer"
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image {!editingTestimonial && '*'}</label>
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
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      onError={(e) => {
                        console.log("Preview image failed to load");
                        e.target.src = DEFAULT_AVATAR;
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
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;