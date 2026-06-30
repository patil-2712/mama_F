// src/ecommerce/LoginPopup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./LoginPopup.css";

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

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

  // API URL for User routes
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const url = `${API_URL}${endpoint}`;

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

      // Validate password match for registration
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Validate required fields for registration
      if (!isLogin) {
        if (!formData.name) {
          setError("Full name is required");
          setLoading(false);
          return;
        }
        if (!formData.email) {
          setError("Email is required");
          setLoading(false);
          return;
        }
        if (!formData.password || formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
      }

      console.log("📤 Sending request to:", url);
      console.log("📤 Payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📦 Response:", data);

      if (data.success) {
        // Store token and user data with multiple keys for compatibility
        const token = data.token;
        const userData = data.data;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Set cookies with expiry (7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        
        document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
        document.cookie = `user=${JSON.stringify(userData)}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
        document.cookie = `isLoggedIn=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        console.log("✅ User logged in successfully");
        console.log("🔑 Token saved:", token ? "Yes" : "No");
        console.log("👤 User saved:", userData ? "Yes" : "No");
        console.log("🍪 Cookies set with expiry:", expiryDate.toLocaleDateString());

        setSuccess(isLogin ? "Login successful!" : "Registration successful!");
        
        // Update auth context
        if (login) {
          login(userData, token);
        }

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(userData);
          }
          onClose();
          // Reload the page to update all components
          window.location.reload();
        }, 1000);
      } else {
        if (data.errors) {
          setError(data.errors.map(err => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="login-popup-overlay" onClick={handleBackdropClick}>
      <div className="login-popup">
        {/* Close Button */}
        <button className="popup-close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="popup-header">
          <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
          <p>{isLogin ? "Login to your account" : "Join us today!"}</p>
        </div>

        {/* Messages */}
        {error && <div className="popup-alert error">{error}</div>}
        {success && <div className="popup-alert success">{success}</div>}

        {/* Form */}
        <form className="popup-form" onSubmit={handleSubmit}>
          {/* Register Fields */}
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address Section */}
              <details className="address-details">
                <summary>📍 Address Details (Optional)</summary>
                <div className="address-fields">
                  <div className="form-group">
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </>
          )}

          {/* Email */}
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <small className="form-hint">Password must be at least 6 characters</small>
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Remember Me (Login only) */}
          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="popup-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="popup-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span 
              className="toggle-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
            >
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;