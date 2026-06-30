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
      
      console.log("🔍 Fetching gallery...");
      const response = await fetch(`${API_URL}/admin/gallery`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("📦 Gallery data:", data);

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
          console.log("🎬 Video 1 URL:", `${BASE_URL}${data.data.video1}`);
        }
        if (data.data.video2) {
          setVideoPreviews(prev => ({ ...prev, video2: `${BASE_URL}${data.data.video2}` }));
          console.log("🎬 Video 2 URL:", `${BASE_URL}${data.data.video2}`);
        }
        if (data.data.video3) {
          setVideoPreviews(prev => ({ ...prev, video3: `${BASE_URL}${data.data.video3}` }));
          console.log("🎬 Video 3 URL:", `${BASE_URL}${data.data.video3}`);
        }
        setIsEditing(true);
      } else if (data.message === "Gallery not found") {
        setIsEditing(false);
        setGalleryData(null);
        console.log("📋 No gallery found, ready to create new one");
      } else {
        setError(data.message || "Failed to fetch gallery");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
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
      console.log(`📁 ${type} file selected:`, file.name, file.size, file.type);
      
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
        console.log(`🎬 Video preview URL created:`, videoUrl);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("📝 Submitting form...");
      
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

      console.log("📤 Sending request to:", url);
      console.log("📤 Method:", method);

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
        setSuccess(isEditing ? "Gallery updated successfully!" : "Gallery created successfully!");
        fetchGallery();
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
      console.error("❌ Submit error:", err);
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
      <div className="admin-gallery-loading">
        <div className="loader"></div>
        <p>Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className="admin-gallery">
      <div className="gallery-header">
        <h1 className="gallery-title">Gallery Management</h1>
        <div className="gallery-actions">
          {galleryData && (
            <>
              <button 
                className={`status-toggle-btn ${galleryData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {galleryData.isActive ? '🟢 Active' : '🔴 Inactive'}
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="gallery-form">
        {/* Images Section */}
        <div className="gallery-section">
          <h2 className="section-title">Images (3 Images Required)</h2>
          
          {[1, 2, 3].map(num => {
            const imageKey = `image${num}`;
            const titleKey = `image${num}Title`;
            const altKey = `image${num}Alt`;
            return (
              <div key={num} className="file-upload-group">
                <h3 className="file-label">Image {num} {!isEditing && '*'}</h3>
                <div className="file-upload-row">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      ref={fileInputRefs[imageKey]}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image', imageKey)}
                      className="file-input"
                    />
                    {imagePreviews[imageKey] ? (
                      <div className="file-preview-wrapper">
                        <img src={imagePreviews[imageKey]} alt={`Preview ${num}`} />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile('image', imageKey)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">🖼️</span>
                        <p>Click to upload image</p>
                        <small>JPG, PNG, GIF, WebP supported</small>
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
        <div className="gallery-section">
          <h2 className="section-title">Videos (3 Videos Required - MP4, WebM, OGV)</h2>
          
          {[1, 2, 3].map(num => {
            const videoKey = `video${num}`;
            const titleKey = `video${num}Title`;
            const descKey = `video${num}Description`;
            return (
              <div key={num} className="file-upload-group">
                <h3 className="file-label">Video {num} {!isEditing && '*'}</h3>
                <div className="file-upload-row">
                  <div className="file-upload-area video-upload">
                    <input
                      type="file"
                      ref={fileInputRefs[videoKey]}
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video', videoKey)}
                      className="file-input"
                    />
                    {videoPreviews[videoKey] ? (
                      <div className="file-preview-wrapper">
                        <video 
                          src={videoPreviews[videoKey]} 
                          controls 
                          className="video-preview"
                          onError={(e) => {
                            console.error(`❌ Video preview error:`, e);
                          }}
                        />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile('video', videoKey)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">🎬</span>
                        <p>Click to upload video</p>
                        <small>MP4, WebM, OGV supported</small>
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
        <div className="form-group checkbox-group">
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

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Gallery' : 'Create Gallery'}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {galleryData && (
        <div className="gallery-preview">
          <h2 className="preview-title">Live Preview</h2>
          
          <div className="preview-images">
            <h3>Images</h3>
            <div className="preview-image-grid">
              {[1, 2, 3].map(num => {
                const imageKey = `image${num}`;
                const titleKey = `image${num}Title`;
                const altKey = `image${num}Alt`;
                return galleryData[imageKey] && (
                  <div key={num} className="preview-image-item">
                    <img 
                      src={`${BASE_URL}${galleryData[imageKey]}`} 
                      alt={galleryData[altKey] || galleryData[titleKey] || `Image ${num}`}
                      onError={(e) => {
                        console.error(`❌ Failed to load image ${num}:`, galleryData[imageKey]);
                        e.target.src = 'https://via.placeholder.com/300x200/cccccc/666666?text=Image+Not+Found';
                      }}
                    />
                    {galleryData[titleKey] && <p className="preview-file-title">{galleryData[titleKey]}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="preview-videos">
            <h3>Videos</h3>
            <div className="preview-video-grid">
              {[1, 2, 3].map(num => {
                const videoKey = `video${num}`;
                const titleKey = `video${num}Title`;
                const descKey = `video${num}Description`;
                const videoUrl = galleryData[videoKey] ? `${BASE_URL}${galleryData[videoKey]}` : '';
                
                console.log(`🎬 Video ${num} URL:`, videoUrl);
                
                return galleryData[videoKey] && (
                  <div key={num} className="preview-video-item">
                    <div className="video-wrapper">
                      <video 
                        src={videoUrl}
                        controls 
                        className="preview-video"
                        style={{ width: '100%', height: '100%' }}
                        onError={(e) => {
                          console.error(`❌ Failed to load video ${num}:`, videoUrl);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const errorMsg = document.createElement('p');
                          errorMsg.textContent = '⚠️ Video failed to load';
                          errorMsg.style.color = 'red';
                          errorMsg.style.padding = '20px';
                          errorMsg.style.textAlign = 'center';
                          parent.appendChild(errorMsg);
                        }}
                        onLoadedData={() => {
                          console.log(`✅ Video ${num} loaded successfully:`, videoUrl);
                        }}
                      />
                    </div>
                    {galleryData[titleKey] && <p className="preview-video-title">{galleryData[titleKey]}</p>}
                    {galleryData[descKey] && <p className="preview-video-desc">{galleryData[descKey]}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;