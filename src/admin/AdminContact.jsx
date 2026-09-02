// src/admin/AdminContact.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminContact.css";

const AdminContact = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in/api";

  const [formData, setFormData] = useState({
    address: "",
    email: "",
    phone: "",
    timing: "Mon - Sun : 10:00 AM - 07:00 PM",
    mapUrl: "",
    isActive: true
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_URL}/admin/contact`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setContactData(data.data);
        setFormData({
          address: data.data.address || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          timing: data.data.timing || "Mon - Sun : 10:00 AM - 07:00 PM",
          mapUrl: data.data.mapUrl || "",
          isActive: data.data.isActive !== undefined ? data.data.isActive : true
        });
        setIsEditing(true);
      } else if (data.message === "Contact info not found") {
        setIsEditing(false);
        setContactData(null);
      } else {
        setError(data.message || "Failed to fetch contact info");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch contact info");
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

  const openEditModal = () => {
    if (contactData) {
      setFormData({
        address: contactData.address || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
        timing: contactData.timing || "Mon - Sun : 10:00 AM - 07:00 PM",
        mapUrl: contactData.mapUrl || "",
        isActive: contactData.isActive !== undefined ? contactData.isActive : true
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
      if (!formData.address.trim()) {
        setError("Address is required");
        setLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      if (!formData.phone.trim()) {
        setError("Phone number is required");
        setLoading(false);
        return;
      }

      const url = isEditing 
        ? `${API_URL}/admin/contact/${contactData._id}`
        : `${API_URL}/admin/contact`;

      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        timing: formData.timing,
        mapUrl: formData.mapUrl,
        isActive: formData.isActive
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isEditing ? "Contact info updated successfully!" : "Contact info created successfully!");
        fetchContact();
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
      const response = await fetch(`${API_URL}/admin/contact/${contactData._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchContact();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the contact info?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/contact/${contactData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Contact info deleted successfully!");
        setContactData(null);
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete contact info");
    }
  };

  if (loading && !contactData) {
    return (
      <div className="admin-contact">
        <div className="loading">Loading Contact Info...</div>
      </div>
    );
  }

  return (
    <div className="admin-contact">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>📞 Contact Information</h1>
          <p>Manage your business contact details</p>
        </div>
        <div className="page-header-right">
          {contactData ? (
            <>
              <button 
                className={`status-btn ${contactData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {contactData.isActive ? '🟢 Active' : '🔴 Inactive'}
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
              ➕ Create Contact
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {/* Contact Cards */}
      {contactData ? (
        <div className="contact-cards-grid">
          {/* Address Card */}
          <div className="contact-card">
            <div className="contact-card-icon">📍</div>
            <h3>Address</h3>
            <p>{contactData.address}</p>
          </div>

          {/* Email Card */}
          <div className="contact-card">
            <div className="contact-card-icon">📧</div>
            <h3>Email</h3>
            <p>{contactData.email}</p>
          </div>

          {/* Phone Card */}
          <div className="contact-card">
            <div className="contact-card-icon">📞</div>
            <h3>Phone</h3>
            <p>{contactData.phone}</p>
          </div>

          {/* Timing Card */}
          <div className="contact-card">
            <div className="contact-card-icon">🕐</div>
            <h3>Business Hours</h3>
            <p>{contactData.timing}</p>
          </div>

          {/* Status Card */}
          <div className="contact-card status-card">
            <div className="contact-card-icon">📊</div>
            <h3>Status</h3>
            <span className={`status-badge ${contactData.isActive ? 'active' : 'inactive'}`}>
              {contactData.isActive ? '✅ Active' : '❌ Inactive'}
            </span>
          </div>

          {/* Map Card */}
          {contactData.mapUrl && (
            <div className="contact-card map-card">
              <div className="contact-card-icon">🗺️</div>
              <h3>Location Map</h3>
              <div className="map-container">
                <iframe
                  src={contactData.mapUrl}
                  title="Location Map"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📞</div>
          <h3>No Contact Information</h3>
          <p>Create contact details to display on your website</p>
          <button className="create-btn-large" onClick={openEditModal}>
            ➕ Create Contact
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? '✏️ Edit Contact' : '➕ Create Contact'}</h2>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>📍 Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter full office address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>📧 Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>📞 Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>🕐 Business Hours</label>
                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleChange}
                  placeholder="e.g., Mon - Sun : 10:00 AM - 07:00 PM"
                />
              </div>

              <div className="form-group">
                <label>🗺️ Google Maps Embed URL</label>
                <input
                  type="url"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <small className="form-hint">
                  💡 Get the embed URL from Google Maps (Share → Embed Map)
                </small>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  ✅ Active (Show on website)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeEditModal}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;