// src/admin/LoginRegister.jsx - Updated version

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError("");
  };

  // API Base URL - Make sure this is correct
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL = `${API_BASE_URL}/api/admin/auth`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const fullUrl = `${API_URL}${endpoint}`;
      
      console.log("Making request to:", fullUrl); // Debug log

      let payload = isLogin 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || "",
            address: formData.address
          };

      // Validation
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!isLogin && (!formData.name || !formData.email || formData.password.length < 6)) {
        setError("Please fill all required fields correctly");
        setLoading(false);
        return;
      }

      // For login, validate email and password
      if (isLogin && (!formData.email || !formData.password)) {
        setError("Please enter email and password");
        setLoading(false);
        return;
      }

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        
        setSuccess(isLogin ? "Login successful!" : "Registration successful!");
        
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        if (data.errors) {
          setError(data.errors.map(err => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Network error: ${error.message}. Please check if server is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h2 className="auth-title">{isLogin ? "Admin Login" : "Admin Registration"}</h2>
            <p className="auth-subtitle">
              {isLogin ? "Welcome back Admin!" : "Create your admin account"}
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-section">
                  <h4 className="form-section-title">Address Details</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        className="form-input"
                        placeholder="Street address"
                        value={formData.address.street}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="address.city"
                        className="form-input"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="address.state"
                        className="form-input"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        name="address.pincode"
                        className="form-input"
                        placeholder="Pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      className="form-input"
                      placeholder="Country"
                      value={formData.address.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="role-info">
                  <span className="role-badge">🔑 Role: Admin</span>
                  <small className="role-hint">All registered users will have admin access</small>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <small className="form-hint">Password must be at least 6 characters</small>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Please wait..." : (isLogin ? "Login" : "Register as Admin")}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch-text">
              {isLogin ? "Don't have an admin account?" : "Already have an admin account?"}
              <span 
                className="auth-switch-link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  // Clear form data when switching
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    phone: "",
                    address: {
                      street: "",
                      city: "",
                      state: "",
                      pincode: "",
                      country: ""
                    }
                  });
                }}
              >
                {isLogin ? " Register" : " Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;