// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      revenue: 0,
      totalProducts: 0
    },
    recentOrders: [],
    orderStats: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  const navigate = useNavigate();
  
  // Use the same pattern as AdminOrders
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch orders with stats (using the same endpoint as AdminOrders)
      const ordersResponse = await fetch(`${API_URL}/orders?page=1&limit=5`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const ordersData = await ordersResponse.json();

      // Fetch users
      const usersResponse = await fetch(`${API_URL}/users?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const usersData = await usersResponse.json();

      // Fetch products
      const productsResponse = await fetch(`${API_URL}/products?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const productsData = await productsResponse.json();

      if (ordersData.success) {
        const orders = ordersData.data || [];
        const stats = ordersData.stats || {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        };

        // Calculate total revenue from delivered orders
        const totalRevenue = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.totals?.total || 0), 0);

        // Get total counts from pagination
        const totalOrders = ordersData.pagination?.total || 0;
        const totalUsers = usersData.pagination?.total || 0;
        const totalProducts = productsData.pagination?.total || 0;

        setDashboardData({
          stats: {
            totalUsers,
            totalOrders,
            revenue: totalRevenue,
            totalProducts
          },
          recentOrders: orders.slice(0, 5),
          orderStats: stats
        });
      } else {
        setError(ordersData.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentOrders, orderStats } = dashboardData;

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-content">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || 'Admin'}! Here's what's happening with your store.</p>
          </div>
          <div className="header-right">
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
              <span className="stat-sub">Registered Users</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
              <div className="stat-breakdown">
                <span className="badge pending">{orderStats.pending}</span>
                <span className="badge processing">{orderStats.processing}</span>
                <span className="badge shipped">{orderStats.shipped}</span>
                <span className="badge delivered">{orderStats.delivered}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Revenue</h3>
              <p className="stat-number">{formatCurrency(stats.revenue)}</p>
              <span className="stat-sub">From Delivered Orders</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Products</h3>
              <p className="stat-number">{stats.totalProducts.toLocaleString()}</p>
              <span className="stat-sub">Available Products</span>
            </div>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="order-status-summary">
          <h2>Order Status Overview</h2>
          <div className="status-bars">
            <div className="status-bar-item">
              <span className="status-label">Pending</span>
              <div className="status-bar">
                <div 
                  className="status-fill pending" 
                  style={{ width: `${(orderStats.pending / (stats.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{orderStats.pending}</span>
            </div>
            <div className="status-bar-item">
              <span className="status-label">Processing</span>
              <div className="status-bar">
                <div 
                  className="status-fill processing" 
                  style={{ width: `${(orderStats.processing / (stats.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{orderStats.processing}</span>
            </div>
            <div className="status-bar-item">
              <span className="status-label">Shipped</span>
              <div className="status-bar">
                <div 
                  className="status-fill shipped" 
                  style={{ width: `${(orderStats.shipped / (stats.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{orderStats.shipped}</span>
            </div>
            <div className="status-bar-item">
              <span className="status-label">Delivered</span>
              <div className="status-bar">
                <div 
                  className="status-fill delivered" 
                  style={{ width: `${(orderStats.delivered / (stats.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{orderStats.delivered}</span>
            </div>
            <div className="status-bar-item">
              <span className="status-label">Cancelled</span>
              <div className="status-bar">
                <div 
                  className="status-fill cancelled" 
                  style={{ width: `${(orderStats.cancelled / (stats.totalOrders || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{orderStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-recent">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id || order.orderId}>
                      <td className="order-id">
                        <span className="order-id-text">{order.orderId || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </span>
                          <span className="customer-email">
                            {order.customer?.email}
                          </span>
                        </div>
                      </td>
                      <td className="amount">
                        {formatCurrency(order.totals?.total || 0)}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>{formatDate(order.orderDate || order.createdAt)}</td>
                      <td>
                        <Link 
                          to={`/admin/orders/${order._id}`} 
                          className="view-order-link"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;