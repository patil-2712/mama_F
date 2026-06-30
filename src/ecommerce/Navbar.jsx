// src/ecommerce/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import "./Navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data || []);
          console.log(`✅ Loaded ${data.count || 0} categories`);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          "Sports Nutrition",
          "Health Drinks",
          "Organic Tea",
          "Organic Spices",
          "Superfoods"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("🔍 Navbar - Token:", token ? "Exists" : "Missing");
    console.log("🔍 Navbar - User:", userData ? "Exists" : "Missing");
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const openLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowLoginPopup(false);
    window.location.reload();
  };

  const handleCategoryClick = (category) => {
    navigate(`/categories/${encodeURIComponent(category)}`);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar-full">
        <div className="nav-container-full">
          {/* Left: Brand */}
          <div className="nav-brand">
            <div className="logo-wrapper">
              <img 
                src="/logo.jpeg" 
                alt="Assure Organic Zone Logo" 
                className="brand-logo"
              />
              <Link to="/" className="brand-name">maisfood</Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Center: Navigation */}
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            
            <div 
              className="nav-link dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span>Categories <span className="arrow">▼</span></span>
              {isDropdownOpen && (
                <div className="dropdown-menu categories-dropdown">
                  {loading ? (
                    <div className="dropdown-loading">Loading...</div>
                  ) : categories.length > 0 ? (
                    categories.map((category, index) => (
                      <Link 
                        key={index}
                        to={`/categories/${encodeURIComponent(category)}`}
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category}
                      </Link>
                    ))
                  ) : (
                    <div className="dropdown-empty">No categories available</div>
                  )}
                </div>
              )}
            </div>
            
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>
            <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>Gallery</Link>
            
            <div 
              className="nav-link dropdown"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <span>More <span className="arrow">▼</span></span>
              {isMoreOpen && (
                <div className="dropdown-menu">
                  <Link to="/blog">Blog</Link>
                  <Link to="/faq">FAQ</Link>
                  <Link to="/contact">Contact</Link>
                  <Link to="/testimonials">Testimonials</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Search, Cart, and Login */}
          <div className="nav-right">
            {/* Search Bar */}
            <div className="search-wrapper">
              <input 
                type="text" 
                placeholder="What are you searching for?" 
                className="search-input"
              />
              <button className="search-btn">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="cart-icon-wrapper">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </Link>

            {/* Login/User Profile */}
            {isLoggedIn ? (
              <div className="user-profile">
                <span className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <span>👤</span> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    <span>📦</span> My Orders
                  </Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={openLoginPopup} className="login-nav-btn">
                <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="login-text">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          onClose={closeLoginPopup} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;