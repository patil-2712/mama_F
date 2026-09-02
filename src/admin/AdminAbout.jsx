// src/admin/AdminAbout.jsx - Updated Header
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAbout.css";

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [image1Preview, setImage1Preview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in:8000";

  const [formData, setFormData] = useState({
    title1: "",
    paragraph1: "",
    image1: "",
    title2: "",
    paragraph2: "",
    image2: "",
    isActive: true
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_URL}/admin/about`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAboutData(data.data);
        setFormData({
          title1: data.data.title1 || "",
          paragraph1: data.data.paragraph1 || "",
          image1: data.data.image1 || "",
          title2: data.data.title2 || "",
          paragraph2: data.data.paragraph2 || "",
          image2: data.data.image2 || "",
          isActive: data.data.isActive !== undefined ? data.data.isActive : true
        });
        if (data.data.image1) {
          setImage1Preview(`${BASE_URL}${data.data.image1}`);
        }
        if (data.data.image2) {
          setImage2Preview(`${BASE_URL}${data.data.image2}`);
        }
        setIsEditing(true);
      } else if (data.message === "About page not found") {
        setIsEditing(false);
        setAboutData(null);
      } else {
        setError(data.message || "Failed to fetch about page");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch about page");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1File(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage1Preview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage2File(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage2Preview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = () => {
    if (aboutData) {
      if (aboutData.image1) {
        setImage1Preview(`${BASE_URL}${aboutData.image1}`);
      }
      if (aboutData.image2) {
        setImage2Preview(`${BASE_URL}${aboutData.image2}`);
      }
      setFormData({
        title1: aboutData.title1 || "",
        paragraph1: aboutData.paragraph1 || "",
        image1: aboutData.image1 || "",
        title2: aboutData.title2 || "",
        paragraph2: aboutData.paragraph2 || "",
        image2: aboutData.image2 || "",
        isActive: aboutData.isActive !== undefined ? aboutData.isActive : true
      });
    }
    setShowEditModal(true);
    setError("");
    setSuccess("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setError("");
    setSuccess("");
    setImage1File(null);
    setImage2File(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.title1.trim()) {
        setError("Title 1 is required");
        setLoading(false);
        return;
      }
      if (!formData.paragraph1.trim()) {
        setError("Paragraph 1 is required");
        setLoading(false);
        return;
      }
      if (!formData.title2.trim()) {
        setError("Title 2 is required");
        setLoading(false);
        return;
      }
      if (!formData.paragraph2.trim()) {
        setError("Paragraph 2 is required");
        setLoading(false);
        return;
      }

      if (!isEditing && (!image1File || !image2File)) {
        setError("Both images are required");
        setLoading(false);
        return;
      }

      const url = isEditing 
        ? `${API_URL}/admin/about/${aboutData._id}`
        : `${API_URL}/admin/about`;

      const method = isEditing ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('title1', formData.title1.trim());
      formDataToSend.append('paragraph1', formData.paragraph1.trim());
      formDataToSend.append('title2', formData.title2.trim());
      formDataToSend.append('paragraph2', formData.paragraph2.trim());
      formDataToSend.append('isActive', formData.isActive);

      if (image1File) {
        formDataToSend.append('image1', image1File);
      }
      if (image2File) {
        formDataToSend.append('image2', image2File);
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
        setSuccess(isEditing ? "About page updated successfully!" : "About page created successfully!");
        fetchAbout();
        closeEditModal();
        setTimeout(() => {
          setSuccess("");
        }, 3000);
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

  const toggleStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/about/${aboutData._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchAbout();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the about page?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/about/${aboutData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("About page deleted successfully!");
        setAboutData(null);
        setIsEditing(false);
        setFormData({
          title1: "",
          paragraph1: "",
          image1: "",
          title2: "",
          paragraph2: "",
          image2: "",
          isActive: true
        });
        setImage1Preview("");
        setImage2Preview("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete about page");
    }
  };

  if (loading && !aboutData) {
    return (
      <div className="admin-about">
        <div className="loading">Loading About Page...</div>
      </div>
    );
  }

  return (
    <div className="admin-about">
      {/* Header - Updated */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="header-icon">ℹ️</span>
          <div>
            <h1>About Page</h1>
            <p>Manage your about page content</p>
          </div>
        </div>
        <div className="page-header-right">
          {aboutData ? (
            <>
              <button 
                className={`status-btn ${aboutData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {aboutData.isActive ? '✅ Active' : '❌ Inactive'}
              </button>
              <button className="edit-btn" onClick={openEditModal}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </>
          ) : (
            <button className="create-btn" onClick={openEditModal}>
              ➕ Create About Page
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {/* Display Content */}
      {aboutData ? (
        <div className="about-content">
          {/* Section 1 */}
          <div className="content-card">
            <h2 className="content-title">📝 Section 1</h2>
            <div className="content-body">
              <div className="content-image">
                <img 
                  src={`${BASE_URL}${aboutData.image1}`} 
                  alt={aboutData.title1}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e8f0fe"/%3E%3Ctext x="50" y="100" font-family="Arial" font-size="16" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="content-text">
                <h3>{aboutData.title1}</h3>
                <p>{aboutData.paragraph1}</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="content-card">
            <h2 className="content-title">📝 Section 2</h2>
            <div className="content-body">
              <div className="content-image">
                <img 
                  src={`${BASE_URL}${aboutData.image2}`} 
                  alt={aboutData.title2}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e8f0fe"/%3E%3Ctext x="50" y="100" font-family="Arial" font-size="16" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="content-text">
                <h3>{aboutData.title2}</h3>
                <p>{aboutData.paragraph2}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="content-status">
            <span className="status-label">Status:</span>
            <span className={`status-badge ${aboutData.isActive ? 'active' : 'inactive'}`}>
              {aboutData.isActive ? '✅ Active' : '❌ Inactive'}
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">ℹ️</div>
          <h3>No About Page Found</h3>
          <p>Create your about page to display on the website</p>
          <button className="create-btn-large" onClick={openEditModal}>
            ➕ Create About Page
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? '✏️ Edit About Page' : '➕ Create About Page'}</h2>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Section 1 */}
              <div className="form-card">
                <h3 className="form-card-title">📝 Section 1</h3>
                
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title1"
                    value={formData.title1}
                    onChange={handleChange}
                    required
                    placeholder="Enter title for section 1"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="paragraph1"
                    value={formData.paragraph1}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter description for section 1"
                  />
                </div>

                <div className="form-group">
                  <label>Image {!isEditing && '*'}</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      ref={fileInput1Ref}
                      accept="image/*"
                      onChange={handleImage1Change}
                      className="upload-input"
                    />
                    <div className="upload-content">
                      <span className="upload-icon">📸</span>
                      <p>Click to upload image</p>
                      <small>JPG, PNG, GIF, WebP (Max 5MB)</small>
                    </div>
                  </div>
                  {image1Preview && (
                    <div className="image-preview-wrapper">
                      <img src={image1Preview} alt="Preview 1" className="image-preview" />
                      <button
                        type="button"
                        className="preview-remove"
                        onClick={() => {
                          setImage1Preview("");
                          setImage1File(null);
                          if (fileInput1Ref.current) {
                            fileInput1Ref.current.value = "";
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2 */}
              <div className="form-card">
                <h3 className="form-card-title">📝 Section 2</h3>
                
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title2"
                    value={formData.title2}
                    onChange={handleChange}
                    required
                    placeholder="Enter title for section 2"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="paragraph2"
                    value={formData.paragraph2}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter description for section 2"
                  />
                </div>

                <div className="form-group">
                  <label>Image {!isEditing && '*'}</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      ref={fileInput2Ref}
                      accept="image/*"
                      onChange={handleImage2Change}
                      className="upload-input"
                    />
                    <div className="upload-content">
                      <span className="upload-icon">📸</span>
                      <p>Click to upload image</p>
                      <small>JPG, PNG, GIF, WebP (Max 5MB)</small>
                    </div>
                  </div>
                  {image2Preview && (
                    <div className="image-preview-wrapper">
                      <img src={image2Preview} alt="Preview 2" className="image-preview" />
                      <button
                        type="button"
                        className="preview-remove"
                        onClick={() => {
                          setImage2Preview("");
                          setImage2File(null);
                          if (fileInput2Ref.current) {
                            fileInput2Ref.current.value = "";
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="form-card">
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    Active (Show on website)
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeEditModal}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;