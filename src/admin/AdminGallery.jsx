// src/admin/AdminGallery.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminGallery.css";

const AdminGallery = () => {
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({
    image1: "",
    image2: "",
    image3: ""
  });
  const [videoPreviews, setVideoPreviews] = useState({
    video1: "",
    video2: "",
    video3: ""
  });
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null
  });
  const [videoFiles, setVideoFiles] = useState({
    video1: null,
    video2: null,
    video3: null
  });
  const fileInputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    video1: useRef(null),
    video2: useRef(null),
    video3: useRef(null)
  };
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    image1Title: "",
    image1Alt: "",
    image2Title: "",
    image2Alt: "",
    image3Title: "",
    image3Alt: "",
    video1Title: "",
    video1Description: "",
    video2Title: "",
    video2Description: "",
    video3Title: "",
    video3Description: "",
    isActive: true
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_URL}/admin/gallery`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setGalleryData(data.data);
        setFormData({
          image1Title: data.data.image1Title || "",
          image1Alt: data.data.image1Alt || "",
          image2Title: data.data.image2Title || "",
          image2Alt: data.data.image2Alt || "",
          image3Title: data.data.image3Title || "",
          image3Alt: data.data.image3Alt || "",
          video1Title: data.data.video1Title || "",
          video1Description: data.data.video1Description || "",
          video2Title: data.data.video2Title || "",
          video2Description: data.data.video2Description || "",
          video3Title: data.data.video3Title || "",
          video3Description: data.data.video3Description || "",
          isActive: data.data.isActive !== undefined ? data.data.isActive : true
        });
        if (data.data.image1) {
          setImagePreviews(prev => ({ ...prev, image1: `${BASE_URL}${data.data.image1}` }));
        }
        if (data.data.image2) {
          setImagePreviews(prev => ({ ...prev, image2: `${BASE_URL}${data.data.image2}` }));
        }
        if (data.data.image3) {
          setImagePreviews(prev => ({ ...prev, image3: `${BASE_URL}${data.data.image3}` }));
        }
        if (data.data.video1) {
          setVideoPreviews(prev => ({ ...prev, video1: `${BASE_URL}${data.data.video1}` }));
        }
        if (data.data.video2) {
          setVideoPreviews(prev => ({ ...prev, video2: `${BASE_URL}${data.data.video2}` }));
        }
        if (data.data.video3) {
          setVideoPreviews(prev => ({ ...prev, video3: `${BASE_URL}${data.data.video3}` }));
        }
        setIsEditing(true);
      } else if (data.message === "Gallery not found") {
        setIsEditing(false);
        setGalleryData(null);
      } else {
        setError(data.message || "Failed to fetch gallery");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch gallery");
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

  const handleFileChange = (e, type, key) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image') {
        setImageFiles(prev => ({ ...prev, [key]: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({ ...prev, [key]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        setVideoFiles(prev => ({ ...prev, [key]: file }));
        const videoUrl = URL.createObjectURL(file);
        setVideoPreviews(prev => ({ ...prev, [key]: videoUrl }));
      }
    }
  };

  const removeFile = (type, key) => {
    if (type === 'image') {
      setImagePreviews(prev => ({ ...prev, [key]: "" }));
      setImageFiles(prev => ({ ...prev, [key]: null }));
      if (fileInputRefs[key]?.current) {
        fileInputRefs[key].current.value = "";
      }
    } else if (type === 'video') {
      if (videoPreviews[key]) {
        URL.revokeObjectURL(videoPreviews[key]);
      }
      setVideoPreviews(prev => ({ ...prev, [key]: "" }));
      setVideoFiles(prev => ({ ...prev, [key]: null }));
      if (fileInputRefs[key]?.current) {
        fileInputRefs[key].current.value = "";
      }
    }
  };

  const openEditModal = () => {
    if (galleryData) {
      // Reset previews with current data
      if (galleryData.image1) {
        setImagePreviews(prev => ({ ...prev, image1: `${BASE_URL}${galleryData.image1}` }));
      }
      if (galleryData.image2) {
        setImagePreviews(prev => ({ ...prev, image2: `${BASE_URL}${galleryData.image2}` }));
      }
      if (galleryData.image3) {
        setImagePreviews(prev => ({ ...prev, image3: `${BASE_URL}${galleryData.image3}` }));
      }
      if (galleryData.video1) {
        setVideoPreviews(prev => ({ ...prev, video1: `${BASE_URL}${galleryData.video1}` }));
      }
      if (galleryData.video2) {
        setVideoPreviews(prev => ({ ...prev, video2: `${BASE_URL}${galleryData.video2}` }));
      }
      if (galleryData.video3) {
        setVideoPreviews(prev => ({ ...prev, video3: `${BASE_URL}${galleryData.video3}` }));
      }
      setFormData({
        image1Title: galleryData.image1Title || "",
        image1Alt: galleryData.image1Alt || "",
        image2Title: galleryData.image2Title || "",
        image2Alt: galleryData.image2Alt || "",
        image3Title: galleryData.image3Title || "",
        image3Alt: galleryData.image3Alt || "",
        video1Title: galleryData.video1Title || "",
        video1Description: galleryData.video1Description || "",
        video2Title: galleryData.video2Title || "",
        video2Description: galleryData.video2Description || "",
        video3Title: galleryData.video3Title || "",
        video3Description: galleryData.video3Description || "",
        isActive: galleryData.isActive !== undefined ? galleryData.isActive : true
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!isEditing) {
        if (!imageFiles.image1 || !imageFiles.image2 || !imageFiles.image3) {
          setError("All 3 images are required");
          setLoading(false);
          return;
        }
        if (!videoFiles.video1 || !videoFiles.video2 || !videoFiles.video3) {
          setError("All 3 videos are required");
          setLoading(false);
          return;
        }
      }

      const url = isEditing 
        ? `${API_URL}/admin/gallery/${galleryData._id}`
        : `${API_URL}/admin/gallery`;

      const method = isEditing ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('image1Title', formData.image1Title);
      formDataToSend.append('image1Alt', formData.image1Alt);
      formDataToSend.append('image2Title', formData.image2Title);
      formDataToSend.append('image2Alt', formData.image2Alt);
      formDataToSend.append('image3Title', formData.image3Title);
      formDataToSend.append('image3Alt', formData.image3Alt);
      formDataToSend.append('video1Title', formData.video1Title);
      formDataToSend.append('video1Description', formData.video1Description);
      formDataToSend.append('video2Title', formData.video2Title);
      formDataToSend.append('video2Description', formData.video2Description);
      formDataToSend.append('video3Title', formData.video3Title);
      formDataToSend.append('video3Description', formData.video3Description);
      formDataToSend.append('isActive', formData.isActive);

      if (imageFiles.image1) formDataToSend.append('image1', imageFiles.image1);
      if (imageFiles.image2) formDataToSend.append('image2', imageFiles.image2);
      if (imageFiles.image3) formDataToSend.append('image3', imageFiles.image3);
      if (videoFiles.video1) formDataToSend.append('video1', videoFiles.video1);
      if (videoFiles.video2) formDataToSend.append('video2', videoFiles.video2);
      if (videoFiles.video3) formDataToSend.append('video3', videoFiles.video3);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isEditing ? "Gallery updated successfully!" : "Gallery created successfully!");
        fetchGallery();
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
      const response = await fetch(`${API_URL}/admin/gallery/${galleryData._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchGallery();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the gallery?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/gallery/${galleryData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Gallery deleted successfully!");
        setGalleryData(null);
        setIsEditing(false);
        setFormData({
          image1Title: "",
          image1Alt: "",
          image2Title: "",
          image2Alt: "",
          image3Title: "",
          image3Alt: "",
          video1Title: "",
          video1Description: "",
          video2Title: "",
          video2Description: "",
          video3Title: "",
          video3Description: "",
          isActive: true
        });
        setImagePreviews({ image1: "", image2: "", image3: "" });
        setVideoPreviews({ video1: "", video2: "", video3: "" });
        setImageFiles({ image1: null, image2: null, image3: null });
        setVideoFiles({ video1: null, video2: null, video3: null });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete gallery");
    }
  };

  if (loading && !galleryData) {
    return (
      <div className="admin-gallery">
        <div className="loading">Loading Gallery...</div>
      </div>
    );
  }

  return (
    <div className="admin-gallery">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
  <span className="header-icon">🖼️</span>
  <div>
    <h1>Gallery</h1>
    <p>Manage your gallery images and videos</p>
  </div>
</div>
        <div className="page-header-right">
          {galleryData ? (
            <>
              <button 
                className={`status-btn ${galleryData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {galleryData.isActive ? '✅ Active' : '❌ Inactive'}
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
              ➕ Create Gallery
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {/* Display Content */}
      {galleryData ? (
        <div className="gallery-content">
          {/* Images Section */}
          <div className="content-card">
            <h2 className="content-title">📸 Images</h2>
            <div className="gallery-grid">
              {[1, 2, 3].map(num => {
                const imageKey = `image${num}`;
                const titleKey = `image${num}Title`;
                const altKey = `image${num}Alt`;
                return galleryData[imageKey] && (
                  <div key={num} className="gallery-item">
                    <img 
                      src={`${BASE_URL}${galleryData[imageKey]}`} 
                      alt={galleryData[altKey] || galleryData[titleKey] || `Image ${num}`}
                      className="gallery-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e8f0fe"/%3E%3Ctext x="50" y="100" font-family="Arial" font-size="16" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="gallery-item-info">
                      <p className="gallery-item-title">{galleryData[titleKey] || `Image ${num}`}</p>
                      {galleryData[altKey] && (
                        <span className="gallery-item-alt">{galleryData[altKey]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Videos Section */}
          <div className="content-card">
            <h2 className="content-title">🎬 Videos</h2>
            <div className="gallery-grid">
              {[1, 2, 3].map(num => {
                const videoKey = `video${num}`;
                const titleKey = `video${num}Title`;
                const descKey = `video${num}Description`;
                const videoUrl = galleryData[videoKey] ? `${BASE_URL}${galleryData[videoKey]}` : '';
                return galleryData[videoKey] && (
                  <div key={num} className="gallery-item video-item">
                    <div className="video-wrapper">
                      <video 
                        src={videoUrl}
                        controls 
                        className="gallery-video"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const errorMsg = document.createElement('p');
                          errorMsg.textContent = '⚠️ Video failed to load';
                          errorMsg.style.color = '#dc2626';
                          errorMsg.style.padding = '20px';
                          errorMsg.style.textAlign = 'center';
                          parent.appendChild(errorMsg);
                        }}
                      />
                    </div>
                    <div className="gallery-item-info">
                      <p className="gallery-item-title">{galleryData[titleKey] || `Video ${num}`}</p>
                      {galleryData[descKey] && (
                        <span className="gallery-item-desc">{galleryData[descKey]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="content-status">
            <span className="status-label">Status:</span>
            <span className={`status-badge ${galleryData.isActive ? 'active' : 'inactive'}`}>
              {galleryData.isActive ? '✅ Active' : '❌ Inactive'}
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🖼️</div>
          <h3>No Gallery Found</h3>
          <p>Create your gallery to showcase images and videos</p>
          <button className="create-btn-large" onClick={openEditModal}>
            ➕ Create Gallery
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? '✏️ Edit Gallery' : '➕ Create Gallery'}</h2>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Images Section */}
              <div className="form-card">
                <h3 className="form-card-title">📸 Images (3 Required)</h3>
                
                {[1, 2, 3].map(num => {
                  const imageKey = `image${num}`;
                  const titleKey = `image${num}Title`;
                  const altKey = `image${num}Alt`;
                  return (
                    <div key={num} className="file-group">
                      <label className="file-label">Image {num} {!isEditing && '*'}</label>
                      <div className="file-upload-row">
                        <div className="upload-box">
                          <input
                            type="file"
                            ref={fileInputRefs[imageKey]}
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image', imageKey)}
                            className="upload-input"
                          />
                          {imagePreviews[imageKey] ? (
                            <div className="preview-wrapper">
                              <img src={imagePreviews[imageKey]} alt={`Preview ${num}`} className="preview-image" />
                              <button
                                type="button"
                                className="preview-remove"
                                onClick={() => removeFile('image', imageKey)}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="upload-content">
                              <span className="upload-icon">🖼️</span>
                              <p>Click to upload image</p>
                              <small>JPG, PNG, GIF, WebP</small>
                            </div>
                          )}
                        </div>
                        <div className="file-meta">
                          <input
                            type="text"
                            name={titleKey}
                            value={formData[titleKey]}
                            onChange={handleChange}
                            placeholder={`Image ${num} Title`}
                            className="meta-input"
                          />
                          <input
                            type="text"
                            name={altKey}
                            value={formData[altKey]}
                            onChange={handleChange}
                            placeholder={`Image ${num} Alt Text`}
                            className="meta-input"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Videos Section */}
              <div className="form-card">
                <h3 className="form-card-title">🎬 Videos (3 Required)</h3>
                
                {[1, 2, 3].map(num => {
                  const videoKey = `video${num}`;
                  const titleKey = `video${num}Title`;
                  const descKey = `video${num}Description`;
                  return (
                    <div key={num} className="file-group">
                      <label className="file-label">Video {num} {!isEditing && '*'}</label>
                      <div className="file-upload-row">
                        <div className="upload-box video-upload">
                          <input
                            type="file"
                            ref={fileInputRefs[videoKey]}
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'video', videoKey)}
                            className="upload-input"
                          />
                          {videoPreviews[videoKey] ? (
                            <div className="preview-wrapper">
                              <video 
                                src={videoPreviews[videoKey]} 
                                controls 
                                className="video-preview"
                              />
                              <button
                                type="button"
                                className="preview-remove"
                                onClick={() => removeFile('video', videoKey)}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="upload-content">
                              <span className="upload-icon">🎬</span>
                              <p>Click to upload video</p>
                              <small>MP4, WebM, OGV</small>
                            </div>
                          )}
                        </div>
                        <div className="file-meta">
                          <input
                            type="text"
                            name={titleKey}
                            value={formData[titleKey]}
                            onChange={handleChange}
                            placeholder={`Video ${num} Title`}
                            className="meta-input"
                          />
                          <textarea
                            name={descKey}
                            value={formData[descKey]}
                            onChange={handleChange}
                            placeholder={`Video ${num} Description`}
                            className="meta-textarea"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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

export default AdminGallery;