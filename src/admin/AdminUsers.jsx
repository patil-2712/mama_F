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
  const [authError, setAuthError] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

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

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token from localStorage:", token ? token.substring(0, 30) + "..." : "No token");
    return token;
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("👤 User data from localStorage:", user);
        return user;
      }
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
    return null;
  };

  // Check if user is admin
  const checkAdminAccess = () => {
    const token = getToken();
    const user = getUserData();
    
    if (!token || !user) {
      console.log("❌ No token or user data");
      return false;
    }
    
    if (user.role !== "admin") {
      console.log("❌ User is not admin. Role:", user.role);
      return false;
    }
    
    console.log("✅ Admin access granted");
    return true;
  };

  // Fetch users from backend
  const fetchUsers = async (page = 1) => {
    try {
      // Check admin access
      if (!checkAdminAccess()) {
        console.log("❌ Admin access check failed, redirecting to login");
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
      setAuthError(false);
      
      let url = `${API_URL}/users?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedRole) url += `&role=${selectedRole}`;
      if (selectedStatus) url += `&status=${selectedStatus}`;

      console.log("📡 Fetching users from:", url);
      console.log("🔑 Using token:", token.substring(0, 20) + "...");

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("📡 Response status:", response.status);

      // If unauthorized, redirect to login
      if (response.status === 401 || response.status === 403) {
        console.log("🔒 Unauthorized - clearing token and redirecting");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthError(true);
        navigate("/login");
        return;
      }

      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.total || 0);
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("❌ Fetch users error:", err);
      setError("Failed to fetch users. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      // Check admin access
      if (!checkAdminAccess()) {
        return;
      }

      const token = getToken();
      if (!token) return;

      console.log("📊 Fetching user stats...");
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
      console.log("📊 Stats response:", data);
      
      if (data.success) {
        setUserStats(data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user stats:", err);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("🔐 Component mounted - Token exists:", !!token);
    console.log("👤 User data exists:", !!userData);
    
    if (!token || !userData) {
      console.log("❌ No token or user data, redirecting to login");
      navigate("/login");
      return;
    }

    // Check if user is admin
    try {
      const user = JSON.parse(userData);
      console.log("👤 User role:", user.role);
      if (user.role !== "admin") {
        console.log("❌ User is not admin, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (e) {
      console.log("❌ Error parsing user data:", e);
      navigate("/login");
      return;
    }

    // Fetch data
    console.log("✅ Admin authenticated, fetching data...");
    fetchUsers();
    fetchUserStats();
  }, []);

  // Handle search and filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "" || selectedRole !== "" || selectedStatus !== "") {
        fetchUsers(1);
      } else {
        fetchUsers(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedRole, selectedStatus]);

  // Handle form input changes
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

  // Open modal for edit
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

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError("");
    setSuccess("");
  };

  // Handle update user
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

      console.log("📝 Updating user:", editingUser._id);
      console.log("📝 Update data:", formData);

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
        setSuccess("✅ User updated successfully!");
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
      console.error("❌ Update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
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
        setSuccess("✅ User deleted successfully!");
        fetchUsers(currentPage);
        fetchUserStats();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Failed to delete user");
    }
  };

  // Reset filters
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

  // If not authenticated, show nothing
  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="admin-users">
      {/* Statistics Cards */}
      {userStats && (
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{userStats.totalUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Active</h3>
              <p className="stat-number">{userStats.activeUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏸️</div>
            <div className="stat-info">
              <h3>Inactive</h3>
              <p className="stat-number">{userStats.inactiveUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-info">
              <h3>Suspended</h3>
              <p className="stat-number">{userStats.suspendedUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <h3>New (30 days)</h3>
              <p className="stat-number">{userStats.newUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👑</div>
            <div className="stat-info">
              <h3>Admins</h3>
              <p className="stat-number">{userStats.adminUsers || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="user-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-filter"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
        <div className="filter-right">
          <span className="user-count">Total: {totalUsers} users</span>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Users Table */}
      {loading ? (
        <div className="loading-spinner">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
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
                  <td colSpan="9" className="no-data">No users found. Users will appear here when they register from the ecommerce site.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="user-name-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      {user.name || 'Unknown'}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td className="address-cell">
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
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit"
                          onClick={() => openModal(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete"
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
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button 
                className="page-btn"
                onClick={() => fetchUsers(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleUpdate} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
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
                  <label>Email *</label>
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
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Address Details</h4>
                
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
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update User'}
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