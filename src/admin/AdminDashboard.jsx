// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/products")) return "Products";
    if (path.includes("/admin/orders")) return "Orders";
    if (path.includes("/admin/users")) return "Users";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/testimonials")) return "Testimonials";
    if (path.includes("/admin/settings")) return "Settings";
    return "Admin Panel";
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      {/* <div className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-logo">
          <h2>{isSidebarOpen ? 'Admin Panel' : 'AP'}</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={location.pathname === "/admin/dashboard" ? "active" : ""}>
              <Link to="/admin/dashboard">
                <span className="nav-icon">📊</span>
                {isSidebarOpen && <span className="nav-text">Dashboard</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/products" ? "active" : ""}>
              <Link to="/admin/products">
                <span className="nav-icon">📦</span>
                {isSidebarOpen && <span className="nav-text">Products</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/orders" ? "active" : ""}>
              <Link to="/admin/orders">
                <span className="nav-icon">🛒</span>
                {isSidebarOpen && <span className="nav-text">Orders</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/users" ? "active" : ""}>
              <Link to="/admin/users">
                <span className="nav-icon">👤</span>
                {isSidebarOpen && <span className="nav-text">Users</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/categories" ? "active" : ""}>
              <Link to="/admin/categories">
                <span className="nav-icon">📝</span>
                {isSidebarOpen && <span className="nav-text">Categories</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/testimonials" ? "active" : ""}>
              <Link to="/admin/testimonials">
                <span className="nav-icon">💬</span>
                {isSidebarOpen && <span className="nav-text">Testimonials</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/settings" ? "active" : ""}>
              <Link to="/admin/settings">
                <span className="nav-icon">⚙️</span>
                {isSidebarOpen && <span className="nav-text">Settings</span>}
              </Link>
            </li>
            <li onClick={handleLogout} className="logout-item">
              <span className="nav-icon">🚪</span>
              {isSidebarOpen && <span className="nav-text">Logout</span>}
            </li>
          </ul>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className={`admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        {/* Top Header */}
        {/* <div className="admin-top-header">
          <div className="header-left">
            <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? '◀' : '▶'}
            </button>
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <span className="admin-user-name">👋 Welcome, {user?.name || "Admin"}!</span>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div> */}

        {/* Dashboard Content */}
        <div className="admin-page-content">
          {/* Stats Cards */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-info">
                <h3>Total Users</h3>
                <p className="stat-number">1,234</p>
                <span className="stat-change positive">↑ 12.5%</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <h3>Total Orders</h3>
                <p className="stat-number">567</p>
                <span className="stat-change positive">↑ 8.3%</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Revenue</h3>
                <p className="stat-number">₹45,678</p>
                <span className="stat-change positive">↑ 15.2%</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>Products</h3>
                <p className="stat-number">89</p>
                <span className="stat-change positive">↑ 5.7%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-recent">
            <div className="recent-orders">
              <h2>Recent Orders</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#ORD-001</td>
                    <td>John Doe</td>
                    <td>₹1,299</td>
                    <td><span className="status completed">Completed</span></td>
                    <td>2024-01-15</td>
                  </tr>
                  <tr>
                    <td>#ORD-002</td>
                    <td>Jane Smith</td>
                    <td>₹2,499</td>
                    <td><span className="status pending">Pending</span></td>
                    <td>2024-01-14</td>
                  </tr>
                  <tr>
                    <td>#ORD-003</td>
                    <td>Mike Johnson</td>
                    <td>₹899</td>
                    <td><span className="status shipped">Shipped</span></td>
                    <td>2024-01-14</td>
                  </tr>
                  <tr>
                    <td>#ORD-004</td>
                    <td>Sarah Wilson</td>
                    <td>₹3,499</td>
                    <td><span className="status completed">Completed</span></td>
                    <td>2024-01-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;