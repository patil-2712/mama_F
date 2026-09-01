// src/ecommerce/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";
  const getToken = () => localStorage.getItem("token");

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        console.log("🔍 Checking token:", token ? "Exists" : "Missing");
        
        if (!token) {
          console.log("❌ No token found, redirecting to login");
          navigate("/login");
          return;
        }

        const url = `${API_URL}/api/orders/user`;
        console.log("📡 Fetching orders from:", url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("📡 Response status:", response.status);

        const data = await response.json();
        console.log("📦 Orders data:", data);

        if (data.success) {
          setOrders(data.data || []);
          console.log(`✅ Loaded ${data.data?.length || 0} orders`);
        } else {
          setError(data.message || "Failed to fetch orders");
          console.error("❌ Error fetching orders:", data.message);
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, API_URL]);

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update order status in the list
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' } 
            : order
        ));
        alert("Order cancelled successfully!");
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close order modal
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    document.body.style.overflow = 'auto';
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeOrderModal();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeOrderModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  // Filter orders
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    return `${API_URL}/uploads/images/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-container">
          <h1 className="orders-title">My Orders</h1>
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {/* Filter */}
        <div className="orders-filter">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="order-count">{filteredOrders.length} orders</span>
        </div>

        {/* Error Message */}
        {error && <div className="orders-error">{error}</div>}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : `No ${statusFilter} orders found.`}
            </p>
            <Link to="/products" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order.orderId || order._id}</span>
                    <span className="order-date">{formatDate(order.orderDate || order.createdAt)}</span>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="order-total">{formatPrice(order.totals?.total || 0)}</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items && order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="order-item-thumb"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="28" font-family="Arial" font-size="10" fill="%23999"%3ENo%20Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="order-item-preview-info">
                        <div className="order-item-preview-name">{item.name}</div>
                        <div className="order-item-preview-qty">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <div className="order-more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => viewOrderDetails(order)}
                  >
                    View Details
                  </button>
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button 
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="order-modal-overlay" onClick={handleBackdropClick}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2>Order Details</h2>
              <button className="modal-close-btn" onClick={closeOrderModal}>✕</button>
            </div>
            
            <div className="order-modal-body">
              {/* Order Info */}
              <div className="order-detail-section">
                <div className="order-detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">#{selectedOrder.orderId || selectedOrder._id}</span>
                </div>
                <div className="order-detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}</span>
                </div>
                <div className="order-detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${getStatusBadge(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.customer && (
                <div className="order-detail-section">
                  <h3>Shipping Address</h3>
                  <div className="address-box">
                    <p className="address-name">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </p>
                    <p>{selectedOrder.customer.address?.street}</p>
                    <p>{selectedOrder.customer.address?.city}, {selectedOrder.customer.address?.state}</p>
                    <p>{selectedOrder.customer.address?.pincode}, {selectedOrder.customer.address?.country}</p>
                    <p className="address-phone">📞 {selectedOrder.customer.phone}</p>
                    <p className="address-email">📧 {selectedOrder.customer.email}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="order-detail-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-detail-item">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="order-detail-item-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect width="60" height="60" fill="%23f5f5f5"/%3E%3Ctext x="5" y="30" font-family="Arial" font-size="10" fill="%23999"%3ENo%20Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="order-detail-item-info">
                        <div className="order-detail-item-name">{item.name}</div>
                        <div className="order-detail-item-meta">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                          {item.discount > 0 && (
                            <span className="item-discount"> ({item.discount}% OFF)</span>
                          )}
                        </div>
                      </div>
                      <div className="order-detail-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              {selectedOrder.totals && (
                <div className="order-detail-section">
                  <h3>Order Summary</h3>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.totals.subtotal)}</span>
                    </div>
                    {selectedOrder.totals.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount</span>
                        <span>-{formatPrice(selectedOrder.totals.discount)}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{selectedOrder.totals.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.totals.shipping)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.totals.total)}</span>
                    </div>
                    {selectedOrder.payment && (
                      <div className="summary-row payment-method">
                        <span>Payment Method</span>
                        <span>{selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="order-modal-footer">
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <button 
                  className="cancel-order-btn-modal"
                  onClick={() => {
                    cancelOrder(selectedOrder._id);
                    closeOrderModal();
                  }}
                >
                  Cancel Order
                </button>
              )}
              <button className="close-modal-btn" onClick={closeOrderModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;