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
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      
      console.log("🔍 Fetching contact info...");
      const response = await fetch(`${API_URL}/admin/contact`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("📦 Contact data:", data);

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
        setFormData({
          address: "",
          email: "",
          phone: "",
          timing: "Mon - Sun : 10:00 AM - 07:00 PM",
          mapUrl: "",
          isActive: true
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate form data
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

      console.log("📤 Sending to:", url, method, payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (data.success) {
        setSuccess(isEditing ? "Contact info updated successfully!" : "Contact info created successfully!");
        fetchContact();
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
        setFormData({
          address: "",
          email: "",
          phone: "",
          timing: "Mon - Sun : 10:00 AM - 07:00 PM",
          mapUrl: "",
          isActive: true
        });
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
      <div className="admin-contact-loading">
        <div className="loader"></div>
        <p>Loading Contact Info...</p>
      </div>
    );
  }

  return (
    <div className="admin-contact">
      <div className="contact-header">
        <h1 className="contact-title">Contact Page Management</h1>
        <div className="contact-actions">
          {contactData && (
            <>
              <button 
                className={`status-toggle-btn ${contactData.isActive ? 'active' : 'inactive'}`}
                onClick={toggleStatus}
              >
                {contactData.isActive ? '🟢 Active' : '🔴 Inactive'}
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

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Address *</label>
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
            <label>Email *</label>
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
            <label>Phone *</label>
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
          <label>Timing</label>
          <input
            type="text"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            placeholder="e.g., Mon - Sun : 10:00 AM - 07:00 PM"
          />
        </div>

        <div className="form-group">
          <label>Google Maps Embed URL</label>
          <input
            type="url"
            name="mapUrl"
            value={formData.mapUrl}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <small className="form-hint">
            Get the embed URL from Google Maps (Share → Embed Map)
          </small>
        </div>

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

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Contact Info' : 'Create Contact Info'}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {contactData && (
        <div className="contact-preview">
          <h2 className="preview-title">Live Preview</h2>
          <div className="preview-content">
            <div className="preview-item">
              <h4>Address</h4>
              <p>{contactData.address}</p>
            </div>
            <div className="preview-item">
              <h4>Email</h4>
              <p>{contactData.email}</p>
            </div>
            <div className="preview-item">
              <h4>Phone</h4>
              <p>{contactData.phone}</p>
            </div>
            <div className="preview-item">
              <h4>Timing</h4>
              <p>{contactData.timing}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;