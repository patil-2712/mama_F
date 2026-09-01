// src/admin/AdminUsers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000/api/admin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    },
    role: "user",
    status: "active"
  });

  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
    return null;
  };

  const checkAdminAccess = () => {
    const token = getToken();
    const user = getUserData();
    
    if (!token || !user) return false;
    if (user.role !== "admin") return false;
    return true;
  };

  const fetchUsers = async (page = 1) => {
    try {
      if (!checkAdminAccess()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError("");
      
      let url = `${API_URL}/users?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedRole) url += `&role=${selectedRole}`;
      if (selectedStatus) url += `&status=${selectedStatus}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.total || 0);
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to fetch users. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      if (!checkAdminAccess()) return;

      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setUserStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }

    fetchUsers();
    fetchUserStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedRole, selectedStatus]);

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
  };

  const openModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
        country: user.address?.country || ""
      },
      role: user.role || "user",
      status: user.status || "active"
    });
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError("");
    setSuccess("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("User updated successfully!");
        fetchUsers(currentPage);
        fetchUserStats();
        setTimeout(() => {
          closeModal();
          setSuccess("");
        }, 1500);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setSuccess("User deleted successfully!");
        fetchUsers(currentPage);
        fetchUserStats();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete user");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
    fetchUsers(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'suspended': return 'status-suspended';
      default: return '';
    }
  };

  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="header-icon">👥</span>
          <div>
            <h1>Users</h1>
            <p>Manage all registered users</p>
          </div>
        </div>
        <div className="page-header-right">
          <span className="user-total-badge">📊 Total: {totalUsers} users</span>
        </div>
      </div>

      {/* Stats Row */}
      {userStats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-label">Total Users</span>
              <span className="stat-number">{userStats.totalUsers || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">Active</span>
              <span className="stat-number active">{userStats.activeUsers || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏸️</div>
            <div className="stat-content">
              <span className="stat-label">Inactive</span>
              <span className="stat-number inactive">{userStats.inactiveUsers || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <span className="stat-label">Suspended</span>
              <span className="stat-number suspended">{userStats.suspendedUsers || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <span className="stat-label">New (30 days)</span>
              <span className="stat-number">{userStats.newUsers || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-content">
              <span className="stat-label">Admins</span>
              <span className="stat-number admin">{userStats.adminUsers || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="reset-btn" onClick={resetFilters}>↺ Reset</button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert error">❌ {error}</div>}
      {success && <div className="alert success">✅ {success}</div>}

      {/* Users Table */}
      {loading ? (
        <div className="loading">⏳ Loading users...</div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-row">
                    <div className="empty-state">
                      <div className="empty-icon">👤</div>
                      <h3>No users found</h3>
                      <p>Users will appear here when they register</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="user-index">{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{user.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-phone">{user.phone || '—'}</td>
                    <td className="user-address">
                      {user.address?.street || ''} 
                      {user.address?.city ? `, ${user.address.city}` : ''}
                      {user.address?.state ? `, ${user.address.state}` : ''}
                      {user.address?.pincode ? ` - ${user.address.pincode}` : ''}
                      {!user.address?.street && !user.address?.city && '—'}
                    </td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(user.status)}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="user-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => openModal(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(user._id, user.name)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => fetchUsers(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="page-info">📄 Page {currentPage} of {totalPages}</span>
              <button 
                className="page-btn"
                onClick={() => fetchUsers(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit User</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>👤 Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>📧 Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>📞 Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-section">
                <h4>📍 Address Details</h4>
                
                <div className="form-group">
                  <label>Street</label>
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
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
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
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '⏳ Updating...' : '✏️ Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;