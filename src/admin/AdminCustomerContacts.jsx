// admin/AdminCustomerContacts.jsx
import React, { useState, useEffect } from 'react';
import './AdminCustomerContacts.css';

const AdminCustomerContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    isRead: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    archived: 0,
    unread: 0
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://103.154.233.113:8000/api';
  const token = localStorage.getItem('token');

  // Fetch contacts with filters
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.isRead !== '' && { isRead: filters.isRead }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`${API_URL}/admin/customer-contacts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data.data);
      setPagination({
        ...pagination,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch single contact details
  const fetchContactDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch contact details');

      const data = await response.json();
      setSelectedContact(data.data);
      setShowDetailModal(true);
      
      // Refresh the list to update read status
      fetchContacts();
      fetchStats();
    } catch (err) {
      console.error('Error fetching contact details:', err);
      setError(err.message);
    }
  };

  // Update contact status
  const updateStatus = async (id, status, notes = '') => {
    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === id ? data.data : contact
      ));
      
      // Update selected contact if modal is open
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(data.data);
      }
      
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      const data = await response.json();
      setContacts(contacts.map(contact => 
        contact._id === id ? data.data : contact
      ));
      fetchStats();
    } catch (err) {
      console.error('Error marking as read:', err);
      setError(err.message);
    }
  };

  // Mark as replied
  const markAsReplied = async (id, notes = '') => {
    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/${id}/replied`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) throw new Error('Failed to mark as replied');

      const data = await response.json();
      setContacts(contacts.map(contact => 
        contact._id === id ? data.data : contact
      ));
      
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(data.data);
      }
      
      fetchStats();
    } catch (err) {
      console.error('Error marking as replied:', err);
      setError(err.message);
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/customer-contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      setContacts(contacts.filter(contact => contact._id !== id));
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
        setShowDetailModal(false);
      }
      fetchStats();
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(err.message);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Apply filters and fetch data
  useEffect(() => {
    fetchContacts();
  }, [pagination.page, filters]);

  // Initial load
  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge-pending';
      case 'read': return 'status-badge-read';
      case 'replied': return 'status-badge-replied';
      case 'archived': return 'status-badge-archived';
      default: return 'status-badge-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏰';
      case 'read': return '👁️';
      case 'replied': return '✉️';
      case 'archived': return '📦';
      default: return '⏰';
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-contacts-container">
      {/* Header */}
      <div className="contacts-header">
        <div className="contacts-header-left">
          <h2>📬 Customer Messages</h2>
          <span className="contacts-count">{stats.total} total</span>
        </div>
        <button 
          className="refresh-btn"
          onClick={() => { fetchContacts(); fetchStats(); }}
        >
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="contacts-stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📨</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card stat-unread">
          <div className="stat-icon">📩</div>
          <div className="stat-info">
            <span className="stat-value">{stats.unread}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card stat-replied">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.replied}</span>
            <span className="stat-label">Replied</span>
          </div>
        </div>
        <div className="stat-card stat-archived">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <span className="stat-value">{stats.archived}</span>
            <span className="stat-label">Archived</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="contacts-filters">
        <div className="filter-group">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">⏰ Pending</option>
            <option value="read">👁️ Read</option>
            <option value="replied">✉️ Replied</option>
            <option value="archived">📦 Archived</option>
          </select>
          
          <select
            value={filters.isRead}
            onChange={(e) => handleFilterChange('isRead', e.target.value)}
            className="filter-select"
          >
            <option value="">All Read Status</option>
            <option value="true">✅ Read</option>
            <option value="false">📩 Unread</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError('')} className="error-close">
            ✕
          </button>
        </div>
      )}

      {/* Contacts Table */}
      <div className="contacts-table-wrapper">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '48px' }}>📭</span>
            <h3>No messages found</h3>
            <p>No customer messages match your filters</p>
          </div>
        ) : (
          <>
            <table className="contacts-table">
              <thead>
                <tr>
                  <th className="col-name">Name</th>
                  <th className="col-email">Email</th>
                  <th className="col-phone">Phone</th>
                  <th className="col-message">Message</th>
                  <th className="col-status">Status</th>
                  <th className="col-date">Received</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr 
                    key={contact._id} 
                    className={!contact.isRead ? 'unread-row' : ''}
                  >
                    <td className="col-name">
                      <div className="name-cell">
                        <span>👤</span>
                        <span>{contact.name}</span>
                        {!contact.isRead && <span className="unread-dot"></span>}
                      </div>
                    </td>
                    <td className="col-email">
                      <a href={`mailto:${contact.email}`} className="email-link">
                        <span>✉️</span>
                        {contact.email}
                      </a>
                    </td>
                    <td className="col-phone">
                      <a href={`tel:${contact.phone}`} className="phone-link">
                        <span>📞</span>
                        {contact.phone}
                      </a>
                    </td>
                    <td className="col-message">
                      <div className="message-preview">
                        {contact.message.length > 60 
                          ? contact.message.substring(0, 60) + '...' 
                          : contact.message}
                      </div>
                    </td>
                    <td className="col-status">
                      <span className={`status-badge ${getStatusBadgeClass(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="col-date">
                      <span>📅</span>
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => fetchContactDetails(contact._id)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {!contact.isRead && (
                          <button 
                            className="action-btn read-btn"
                            onClick={() => markAsRead(contact._id)}
                            title="Mark as Read"
                          >
                            ✅
                          </button>
                        )}
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => deleteContact(contact._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="page-btn"
                >
                  ◀
                </button>
                <span className="page-info">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="page-btn"
                >
                  ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Message Details</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <p>👤 {selectedContact.name}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>✉️ {selectedContact.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>📞 {selectedContact.phone}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge ${getStatusBadgeClass(selectedContact.status)}`}>
                      {getStatusIcon(selectedContact.status)}
                      {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="detail-item full-width">
                  <label>Message</label>
                  <p className="message-full">{selectedContact.message}</p>
                </div>
                <div className="detail-item">
                  <label>Received</label>
                  <p>📅 {formatDate(selectedContact.createdAt)}</p>
                </div>
                {selectedContact.readAt && (
                  <div className="detail-item">
                    <label>Read At</label>
                    <p>👁️ {formatDate(selectedContact.readAt)}</p>
                  </div>
                )}
                {selectedContact.repliedAt && (
                  <div className="detail-item">
                    <label>Replied At</label>
                    <p>✉️ {formatDate(selectedContact.repliedAt)}</p>
                  </div>
                )}
                {selectedContact.notes && (
                  <div className="detail-item full-width">
                    <label>Admin Notes</label>
                    <p className="notes-text">{selectedContact.notes}</p>
                  </div>
                )}
                
              </div>

              <div className="modal-actions">
                <div className="status-actions">
                  <button
                    className="action-btn-primary status-pending"
                    onClick={() => updateStatus(selectedContact._id, 'pending')}
                    disabled={selectedContact.status === 'pending'}
                  >
                    ⏰ Pending
                  </button>
                  <button
                    className="action-btn-primary status-read"
                    onClick={() => updateStatus(selectedContact._id, 'read')}
                    disabled={selectedContact.status === 'read'}
                  >
                    👁️ Mark Read
                  </button>
                  <button
                    className="action-btn-primary status-replied"
                    onClick={() => {
                      const notes = prompt('Add reply notes (optional):');
                      if (notes !== null) {
                        markAsReplied(selectedContact._id, notes);
                      }
                    }}
                    disabled={selectedContact.status === 'replied'}
                  >
                    ✉️ Mark Replied
                  </button>
                  <button
                    className="action-btn-primary status-archived"
                    onClick={() => updateStatus(selectedContact._id, 'archived')}
                    disabled={selectedContact.status === 'archived'}
                  >
                    📁 Archive
                  </button>
                </div>
                <button
                  className="action-btn-danger"
                  onClick={() => deleteContact(selectedContact._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerContacts;