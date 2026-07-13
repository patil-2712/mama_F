// src/admin/AdminOrders.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printFormat, setPrintFormat] = useState("a4");
  const printRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("token");

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

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const openPrintModal = (order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  const closePrintModal = () => {
    setShowPrintModal(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const styles = document.querySelectorAll('style');
    let styleTags = '';
    styles.forEach(style => {
      styleTags += style.innerHTML;
    });

    const isThermal = printFormat === "thermal";
    const pageSize = isThermal ? '80mm' : 'A4';
    const pageMargin = isThermal ? '5mm' : '10mm';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${selectedOrder?.orderId || 'Invoice'}</title>
          <style>
            ${styleTags}
            
            /* Print specific styles */
            .print-container {
              max-width: ${isThermal ? '80mm' : '210mm'};
              margin: 0 auto;
              padding: ${isThermal ? '5px' : '20px'};
              font-family: ${isThermal ? "'Courier New', monospace" : "Arial, sans-serif"};
              font-size: ${isThermal ? '10px' : '12px'};
              background: white;
            }
            
            @page {
              size: ${pageSize};
              margin: ${pageMargin};
            }
            
            .print-header {
              text-align: center;
              border-bottom: ${isThermal ? '1px dashed #333' : '2px solid #333'};
              padding-bottom: ${isThermal ? '8px' : '15px'};
              margin-bottom: ${isThermal ? '10px' : '20px'};
            }
            
            .print-header h1 {
              font-size: ${isThermal ? '14px' : '24px'};
              margin: 0;
              color: #1a56db;
            }
            
            .print-header p {
              margin: ${isThermal ? '2px 0' : '5px 0'};
              color: #666;
              font-size: ${isThermal ? '9px' : '12px'};
            }
            
            .print-row {
              display: flex;
              justify-content: space-between;
              padding: ${isThermal ? '3px 0' : '8px 0'};
              border-bottom: ${isThermal ? '1px dotted #ddd' : '1px solid #eee'};
              font-size: ${isThermal ? '9px' : '12px'};
            }
            
            .print-row.total {
              font-weight: bold;
              border-top: ${isThermal ? '2px solid #333' : '2px solid #333'};
              border-bottom: none;
              font-size: ${isThermal ? '12px' : '16px'};
              margin-top: ${isThermal ? '5px' : '10px'};
              padding-top: ${isThermal ? '5px' : '10px'};
            }
            
            .print-section {
              margin-bottom: ${isThermal ? '8px' : '15px'};
            }
            
            .print-section h3 {
              font-size: ${isThermal ? '11px' : '14px'};
              margin: ${isThermal ? '5px 0' : '10px 0'};
              color: #333;
              border-bottom: ${isThermal ? '1px dotted #ddd' : '1px solid #ddd'};
              padding-bottom: ${isThermal ? '3px' : '5px'};
            }
            
            .print-section .label {
              font-weight: bold;
              color: #555;
            }
            
            .print-items {
              width: 100%;
              border-collapse: collapse;
              font-size: ${isThermal ? '9px' : '12px'};
            }
            
            .print-items th {
              text-align: left;
              padding: ${isThermal ? '3px 4px' : '8px 10px'};
              border-bottom: ${isThermal ? '1px solid #333' : '2px solid #333'};
              font-size: ${isThermal ? '8px' : '11px'};
              text-transform: uppercase;
              color: #555;
            }
            
            .print-items td {
              padding: ${isThermal ? '3px 4px' : '6px 10px'};
              border-bottom: ${isThermal ? '1px dotted #ddd' : '1px solid #eee'};
            }
            
            .print-items tr:last-child td {
              border-bottom: none;
            }
            
            .print-footer {
              text-align: center;
              margin-top: ${isThermal ? '10px' : '20px'};
              padding-top: ${isThermal ? '8px' : '15px'};
              border-top: ${isThermal ? '1px dashed #333' : '2px solid #333'};
              font-size: ${isThermal ? '8px' : '11px'};
              color: #888;
            }
            
            .print-address {
              font-size: ${isThermal ? '9px' : '12px'};
              line-height: 1.6;
              padding: ${isThermal ? '5px' : '10px'};
              background: ${isThermal ? 'transparent' : '#f9fafb'};
              border-radius: ${isThermal ? '0' : '8px'};
            }
            
            .status-badge-print {
              display: inline-block;
              padding: ${isThermal ? '1px 6px' : '3px 10px'};
              border-radius: ${isThermal ? '2px' : '12px'};
              font-size: ${isThermal ? '8px' : '11px'};
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .status-badge-print.pending { color: #d97706; }
            .status-badge-print.processing { color: #2563eb; }
            .status-badge-print.shipped { color: #7c3aed; }
            .status-badge-print.delivered { color: #059669; }
            .status-badge-print.cancelled { color: #dc2626; }
            
            .print-customer-info {
              display: grid;
              grid-template-columns: ${isThermal ? '1fr' : '1fr 1fr'};
              gap: ${isThermal ? '5px' : '15px'};
            }
            
            .print-totals {
              margin-top: ${isThermal ? '5px' : '10px'};
            }
            
            .barcode {
              text-align: center;
              font-family: 'Courier New', monospace;
              letter-spacing: 2px;
              font-size: ${isThermal ? '12px' : '16px'};
              padding: ${isThermal ? '5px' : '10px'};
              background: #f9fafb;
              margin: ${isThermal ? '5px 0' : '10px 0'};
            }
            
            .thank-you {
              text-align: center;
              font-size: ${isThermal ? '11px' : '18px'};
              font-weight: bold;
              color: #1a56db;
              margin-top: ${isThermal ? '8px' : '15px'};
            }
            
            /* Hide non-print elements */
            .no-print {
              display: none !important;
            }
            
            @media print {
              body { 
                background: white; 
                margin: 0;
                padding: 0;
              }
              .print-container {
                max-width: 100%;
                padding: ${isThermal ? '2mm' : '10mm'};
              }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container" id="print-content">
            ${generatePrintContent(selectedOrder, isThermal)}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
    closePrintModal();
  };

  const generatePrintContent = (order, isThermal) => {
    if (!order) return '';

    const formatPrice = (price) => {
      return `₹${parseFloat(price).toLocaleString('en-IN')}`;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return `
      <div class="print-header">
        <h1>🛍️ Assure Organic Zone</h1>
        <p>Order Invoice</p>
        <p><strong>Order #${order.orderId}</strong></p>
        <p>${formatDate(order.orderDate)}</p>
      </div>

      <div class="print-section">
        <div class="print-customer-info">
          <div>
            <h3>👤 Customer Details</h3>
            <p><span class="label">Name:</span> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><span class="label">Email:</span> ${order.customer.email}</p>
            <p><span class="label">Phone:</span> ${order.customer.phone}</p>
          </div>
          <div>
            <h3>📍 Shipping Address</h3>
            <div class="print-address">
              ${order.customer.address.street}<br>
              ${order.customer.address.city}, ${order.customer.address.state}<br>
              Pincode: ${order.customer.address.pincode}<br>
              ${order.customer.address.country}
            </div>
          </div>
        </div>
      </div>

      <div class="print-section">
        <h3>📦 Order Items</h3>
        <table class="print-items">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:right;">${formatPrice(item.price)}</td>
                <td style="text-align:right;">${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="print-section print-totals">
        <div class="print-row">
          <span>Subtotal</span>
          <span>${formatPrice(order.totals.subtotal)}</span>
        </div>
        ${order.totals.discount > 0 ? `
          <div class="print-row" style="color:#059669;">
            <span>Discount</span>
            <span>-${formatPrice(order.totals.discount)}</span>
          </div>
        ` : ''}
        <div class="print-row">
          <span>Shipping</span>
          <span>${order.totals.shipping === 0 ? 'FREE' : formatPrice(order.totals.shipping)}</span>
        </div>
        <div class="print-row total">
          <span>Total</span>
          <span>${formatPrice(order.totals.total)}</span>
        </div>
      </div>

      <div class="print-section">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:5px; padding:5px 0;">
          <div>
            <span class="label">Payment:</span> 
            <span>${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
          </div>
          <div>
            <span class="label">Status:</span>
            <span class="status-badge-print ${order.status}">${order.status.toUpperCase()}</span>
          </div>
          <div>
            <span class="label">Payment Status:</span>
            <span>${order.payment.status === 'completed' ? '✅ Paid' : '⏳ Pending'}</span>
          </div>
        </div>
      </div>

      ${isThermal ? `
        <div class="barcode">
          ||||||||| ${order.orderId} |||||||||
        </div>
      ` : `
        <div style="text-align:center; margin:15px 0;">
          <div style="display:inline-block; padding:5px 15px; background:#f9fafb; border-radius:4px; font-family:'Courier New',monospace; letter-spacing:2px; font-size:14px;">
            ${order.orderId}
          </div>
        </div>
      `}

      <div class="thank-you">
        🙏 Thank You For Your Order!
      </div>

      <div class="print-footer">
        <p>Assure Organic Zone | Quality Products, Trusted Service</p>
        <p>${isThermal ? 'Visit: assureorganic.com' : 'Website: www.assureorganic.com | Email: support@assureorganic.com'}</p>
        ${isThermal ? '' : '<p>This is a system generated invoice</p>'}
      </div>
    `;
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <span className="header-icon">📋</span>
          <div>
            <h1>Orders</h1>
            <p>Manage all customer orders</p>
          </div>
        </div>
        <div className="page-header-right">
          <span className="order-total-badge">📊 Total: {stats.total || 0} orders</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <span className="stat-number">{stats.total || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-number pending">{stats.pending || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <span className="stat-label">Processing</span>
            <span className="stat-number processing">{stats.processing || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <span className="stat-label">Shipped</span>
            <span className="stat-number shipped">{stats.shipped || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Delivered</span>
            <span className="stat-number delivered">{stats.delivered || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <span className="stat-label">Cancelled</span>
            <span className="stat-number cancelled">{stats.cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by order ID, customer name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="search-btn" onClick={() => fetchOrders(1)}>🔍 Search</button>
        </div>
        <div className="filters-right">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchOrders(1);
            }}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="processing">⚙️ Processing</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">✅ Delivered</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
          <button className="reset-btn" onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
            fetchOrders(1);
          }}>↺ Reset</button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="alert error">❌ {error}</div>}
      {success && <div className="alert success">✅ {success}</div>}

      {/* Orders Table */}
      <div className="table-wrapper">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No orders found</h3>
            <p>Orders will appear here once customers place them</p>
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
                  <td className="order-id">#{order.orderId}</td>
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
                        className="btn-view"
                        onClick={() => viewOrderDetails(order)}
                      >
                        👁️ View
                      </button>
                      <button 
                        className="btn-print"
                        onClick={() => openPrintModal(order)}
                      >
                        🖨️ Print
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
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
            ← Previous
          </button>
          <span className="page-info">📄 Page {currentPage} of {totalPages}</span>
          <button 
            className="page-btn"
            onClick={() => fetchOrders(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-icon">📋</span>
                <div>
                  <h2>Order Details</h2>
                  <span className="modal-order-id">#{selectedOrder.orderId}</span>
                </div>
              </div>
              <div className="modal-header-right">
                <span className={`status-badge ${getStatusBadge(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
                <button className="modal-close" onClick={closeOrderModal}>✕</button>
              </div>
            </div>

            <div className="modal-body">
              {/* Order Info Bar */}
              <div className="order-info-bar">
                <div className="info-item">
                  <span className="label">📅 Order Date</span>
                  <span className="value">{formatDate(selectedOrder.orderDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">💳 Payment Method</span>
                  <span className="value">{selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
                <div className="info-item">
                  <span className="label">📊 Payment Status</span>
                  <span className={`payment-status ${selectedOrder.payment.status}`}>
                    {selectedOrder.payment.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                  </span>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="modal-two-col">
                {/* Left Column - Customer & Shipping */}
                <div className="modal-col">
                  <div className="order-section">
                    <h3>👤 Customer Information</h3>
                    <div className="info-list">
                      <div className="info-row">
                        <span className="label">Name</span>
                        <span className="value">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Email</span>
                        <span className="value">{selectedOrder.customer.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Phone</span>
                        <span className="value">{selectedOrder.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-section">
                    <h3>📍 Shipping Address</h3>
                    <div className="address-box">
                      <p>{selectedOrder.customer.address.street}</p>
                      <p>{selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}</p>
                      <p>Pincode: {selectedOrder.customer.address.pincode}</p>
                      <p>{selectedOrder.customer.address.country}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="modal-col">
                  <div className="order-section">
                    <h3>💰 Order Summary</h3>
                    <div className="summary-list">
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
                    </div>
                  </div>

                  <div className="order-section">
                    <h3>📦 Order Status</h3>
                    <div className="status-timeline">
                      <div className={`status-step ${selectedOrder.status === 'pending' ? 'active' : 'completed'}`}>
                        <span className="step-icon">📝</span>
                        <span className="step-label">Pending</span>
                      </div>
                      <div className={`status-step ${selectedOrder.status === 'processing' ? 'active' : selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                        <span className="step-icon">⚙️</span>
                        <span className="step-label">Processing</span>
                      </div>
                      <div className={`status-step ${selectedOrder.status === 'shipped' ? 'active' : selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                        <span className="step-icon">🚚</span>
                        <span className="step-label">Shipped</span>
                      </div>
                      <div className={`status-step ${selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                        <span className="step-icon">✅</span>
                        <span className="step-label">Delivered</span>
                      </div>
                    </div>
                    {selectedOrder.status === 'cancelled' && (
                      <div className="cancelled-badge">❌ Order Cancelled</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items - Full Width */}
              <div className="order-section full-width">
                <h3>🛒 Order Items ({selectedOrder.items.length})</h3>
                <div className="items-table">
                  <div className="items-header">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-product">
                        <img 
                          src={item.image?.startsWith('http') ? item.image : `${BASE_URL}${item.image || '/uploads/images/default.jpg'}`}
                          alt={item.name} 
                          className="item-image"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23e8f0fe"/%3E%3Ctext x="5" y="28" font-family="Arial" font-size="10" fill="%236b7280"%3ENo%20Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          {item.discount > 0 && (
                            <span className="item-discount-badge">-{item.discount}% OFF</span>
                          )}
                        </div>
                      </div>
                      <div className="item-price">{formatPrice(item.price)}</div>
                      <div className="item-qty">×{item.quantity}</div>
                      <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-print-modal" onClick={() => {
                closeOrderModal();
                openPrintModal(selectedOrder);
              }}>
                🖨️ Print Bill
              </button>
              <button className="btn-close" onClick={closeOrderModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && selectedOrder && (
        <div className="modal-overlay" onClick={closePrintModal}>
          <div className="modal print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-icon">🖨️</span>
                <div>
                  <h2>Print Bill</h2>
                  <span className="modal-order-id">Order #{selectedOrder.orderId}</span>
                </div>
              </div>
              <button className="modal-close" onClick={closePrintModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="print-options">
                <div className="print-option-group">
                  <label className="print-option-label">Select Print Format:</label>
                  <div className="print-format-buttons">
                    <button 
                      className={`format-btn ${printFormat === 'a4' ? 'active' : ''}`}
                      onClick={() => setPrintFormat('a4')}
                    >
                      📄 A4 Size
                    </button>
                    <button 
                      className={`format-btn ${printFormat === 'thermal' ? 'active' : ''}`}
                      onClick={() => setPrintFormat('thermal')}
                    >
                      🧾 Thermal (80mm)
                    </button>
                  </div>
                </div>

                <div className="print-preview-info">
                  <div className="preview-details">
                    <h4>Preview Information</h4>
                    <ul>
                      <li><strong>Format:</strong> {printFormat === 'a4' ? 'A4 Paper (210mm x 297mm)' : 'Thermal (80mm x 297mm)'}</li>
                      <li><strong>Order:</strong> #{selectedOrder.orderId}</li>
                      <li><strong>Customer:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</li>
                      <li><strong>Total:</strong> {formatPrice(selectedOrder.totals.total)}</li>
                      <li><strong>Items:</strong> {selectedOrder.items.length} products</li>
                    </ul>
                  </div>
                </div>

                <div className="print-actions">
                  <button className="btn-cancel-print" onClick={closePrintModal}>
                    Cancel
                  </button>
                  <button className="btn-print-final" onClick={handlePrint}>
                    🖨️ Print Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;