// src/admin/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";
  const getToken = () => localStorage.getItem("token");

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/orders?page=${page}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.totalPages);
        setStats(data.stats || {});
        setCurrentPage(page);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to update order status to ${newStatus}?`)) return;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Order status updated to ${newStatus}`);
        fetchOrders(currentPage);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Close order modal
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const classes = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
  };

  // Get status label
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="loading-container">
          <div className="loading-spinner">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Manage Orders</h1>
        <div className="orders-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total || 0}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-value">{stats.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item processing">
            <span className="stat-value">{stats.processing || 0}</span>
            <span className="stat-label">Processing</span>
          </div>
          <div className="stat-item shipped">
            <span className="stat-value">{stats.shipped || 0}</span>
            <span className="stat-label">Shipped</span>
          </div>
          <div className="stat-item delivered">
            <span className="stat-value">{stats.delivered || 0}</span>
            <span className="stat-label">Delivered</span>
          </div>
          <div className="stat-item cancelled">
            <span className="stat-value">{stats.cancelled || 0}</span>
            <span className="stat-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn" onClick={() => fetchOrders(1)}>Search</button>
        </div>
        <div className="filter-right">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchOrders(1);
            }}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="reset-btn" onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
            fetchOrders(1);
          }}>Reset</button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Orders Table */}
      <div className="orders-table-wrapper">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id-cell">#{order.orderId}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customer.firstName} {order.customer.lastName}</div>
                      <div className="customer-email">{order.customer.email}</div>
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td className="order-total">{formatPrice(order.totals.total)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge ${order.payment.status}`}>
                      {order.payment.method === 'cod' ? 'COD' : 'Online'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => fetchOrders(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button 
            className="page-btn"
            onClick={() => fetchOrders(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="order-modal-overlay" onClick={closeOrderModal}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2>Order Details - #{selectedOrder.orderId}</h2>
              <button className="modal-close" onClick={closeOrderModal}>✕</button>
            </div>
            
            <div className="order-modal-body">
              {/* Customer Info */}
              <div className="order-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span>{selectedOrder.customer.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Address:</span>
                    <span>
                      {selectedOrder.customer.address.street},<br />
                      {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}<br />
                      {selectedOrder.customer.address.pincode}, {selectedOrder.customer.address.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <img 
                        src={item.image?.startsWith('http') ? item.image : `${API_URL.split('/admin')[0]}${item.image}`}
                        alt={item.name} 
                        className="order-item-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="28" font-family="Arial" font-size="10" fill="%23999"%3ENo%20Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="order-item-details">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-meta">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                          {item.discount > 0 && <span className="item-discount">({item.discount}% OFF)</span>}
                        </div>
                      </div>
                      <div className="order-item-total">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-section">
                <h3>Order Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.totals.subtotal)}</span>
                  </div>
                  {selectedOrder.totals.discount > 0 && (
                    <div className="summary-item discount">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.totals.discount)}</span>
                    </div>
                  )}
                  <div className="summary-item">
                    <span>Shipping</span>
                    <span>{selectedOrder.totals.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.totals.shipping)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="order-section">
                <h3>Payment & Status</h3>
                <div className="info-grid two-col">
                  <div className="info-item">
                    <span className="label">Payment Method:</span>
                    <span>{selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Payment Status:</span>
                    <span className={`payment-status ${selectedOrder.payment.status}`}>
                      {selectedOrder.payment.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Order Status:</span>
                    <span className={`status-badge ${getStatusBadge(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Order Date:</span>
                    <span>{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <button className="close-btn" onClick={closeOrderModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;