// src/admin/AdminAbout.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAbout.css";

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [image1Preview, setImage1Preview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate form data
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

      // Check if images are provided for new about page
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
      <div className="admin-about-loading">
        <div className="loader"></div>
        <p>Loading About Page...</p>
      </div>
    );
  }

  return (
    <div className="admin-about">
      <div className="about-header">
        <h1 className="about-title">About Page Management</h1>
        <div className="about-actions">
          {aboutData && (
            <>
              <button 
                className={`status-toggle-btn ${aboutData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {aboutData.isActive ? '🟢 Active' : '🔴 Inactive'}
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

      <form onSubmit={handleSubmit} className="about-form">
        {/* Section 1 */}
        <div className="about-section">
          <h2 className="section-title">Section 1</h2>
          
          <div className="form-group">
            <label>Title 1 *</label>
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
            <label>Paragraph 1 *</label>
            <textarea
              name="paragraph1"
              value={formData.paragraph1}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter paragraph for section 1"
            />
          </div>

          <div className="form-group">
            <label>Image 1 {!isEditing && '*'}</label>
            <input
              type="file"
              ref={fileInput1Ref}
              accept="image/*"
              onChange={handleImage1Change}
              className="file-input"
            />
            <small className="file-hint">Supported: JPG, PNG, GIF, WebP (Max 5MB)</small>
            {image1Preview && (
              <div className="image-preview">
                <img src={image1Preview} alt="Preview 1" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setImage1Preview("");
                    setImage1File(null);
                    if (fileInput1Ref.current) {
                      fileInput1Ref.current.value = "";
                    }
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 */}
        <div className="about-section">
          <h2 className="section-title">Section 2</h2>
          
          <div className="form-group">
            <label>Title 2 *</label>
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
            <label>Paragraph 2 *</label>
            <textarea
              name="paragraph2"
              value={formData.paragraph2}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter paragraph for section 2"
            />
          </div>

          <div className="form-group">
            <label>Image 2 {!isEditing && '*'}</label>
            <input
              type="file"
              ref={fileInput2Ref}
              accept="image/*"
              onChange={handleImage2Change}
              className="file-input"
            />
            <small className="file-hint">Supported: JPG, PNG, GIF, WebP (Max 5MB)</small>
            {image2Preview && (
              <div className="image-preview">
                <img src={image2Preview} alt="Preview 2" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setImage2Preview("");
                    setImage2File(null);
                    if (fileInput2Ref.current) {
                      fileInput2Ref.current.value = "";
                    }
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
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
            {loading ? 'Saving...' : isEditing ? 'Update About Page' : 'Create About Page'}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {aboutData && (
        <div className="about-preview">
          <h2 className="preview-title">Live Preview</h2>
          <div className="preview-content">
            <div className="preview-section">
              <h3>{aboutData.title1}</h3>
              <p>{aboutData.paragraph1}</p>
              {aboutData.image1 && (
                <img 
                  src={`${BASE_URL}${aboutData.image1}`} 
                  alt={aboutData.title1}
                  className="preview-image"
                />
              )}
            </div>
            <div className="preview-section">
              <h3>{aboutData.title2}</h3>
              <p>{aboutData.paragraph2}</p>
              {aboutData.image2 && (
                <img 
                  src={`${BASE_URL}${aboutData.image2}`} 
                  alt={aboutData.title2}
                  className="preview-image"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;