import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSupplyRequests,
  approveRequest,
  rejectRequest
} from '../features/supplyRequests/supplyRequestsSlice';
import { fetchSupplies } from '../features/supplies/suppliesSlice';
import './SupplyRequests.css';

const SupplyRequests = () => {
  const dispatch = useDispatch();
  const { items: requests, status, error } = useSelector(state => state.supplyRequests);

  useEffect(() => {
    dispatch(fetchSupplyRequests());
  }, [dispatch]);

  const handleApprove = async (requestId) => {
    if (window.confirm('Approve this supply request? This will deduct items from inventory.')) {
      try {
        await dispatch(approveRequest(requestId)).unwrap();
        // Refresh supplies to show updated quantities
        dispatch(fetchSupplies());
        alert('Supply request approved successfully!');
      } catch (error) {
        alert('Error approving request: ' + error.message);
      }
    }
  };

  const handleReject = async (requestId) => {
    const adminComments = prompt('Reason for rejection (optional):');
    try {
      await dispatch(rejectRequest(requestId)).unwrap();
      alert('Supply request rejected.');
    } catch (error) {
      alert('Error rejecting request: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'APPROVED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      case 'PARTIAL': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'PARTIAL': return '⚡';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return <div className="supply-requests-loading">🔄 Loading supply requests...</div>;
  }

  if (error) {
    return <div className="supply-requests-error">❌ Error: {error}</div>;
  }

  return (
    <div className="supply-requests">
      <div className="requests-header">
        <div className="requests-stats">
          <div className="stat-card total">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
            <span className="stat-icon">📋</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">{requests.filter(r => r.status === 'PENDING').length}</span>
            <span className="stat-label">Pending</span>
            <span className="stat-icon">⏳</span>
          </div>
          <div className="stat-card approved">
            <span className="stat-number">{requests.filter(r => r.status === 'APPROVED').length}</span>
            <span className="stat-label">Approved</span>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-card rejected">
            <span className="stat-number">{requests.filter(r => r.status === 'REJECTED').length}</span>
            <span className="stat-label">Rejected</span>
            <span className="stat-icon">❌</span>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="requests-empty">
          <div className="empty-icon">📝</div>
          <h3>No Supply Requests Yet</h3>
          <p>Supply requests will appear here when users report incidents with supply needs</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(req => (
            <div key={req._id} className="request-card">
              <div className="request-header">
                <div className="request-id">
                  <h3>Request #{req._id.slice(-6)}</h3>
                  <span className="request-date">{formatDate(req.createdAt)}</span>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(req.status) }}
                >
                  {getStatusIcon(req.status)} {req.status}
                </span>
              </div>

              <div className="request-details">
                <div className="detail-section incident-info">
                  <h4 className="detail-title">📋 Related Incident</h4>
                  <div className="incident-summary">
                    <p className="incident-title">{req.incident?.title || 'Unknown Incident'}</p>
                    <div className="incident-meta">
                      <span className="incident-category">{req.incident?.category || 'Unknown'}</span>
                      <span className="incident-severity">{req.incident?.severity || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section requester-info">
                  <h4 className="detail-title">👤 Requested By</h4>
                  <p className="requester-name">{req.requestedBy?.name || 'Unknown User'}</p>
                </div>

                <div className="detail-section supplies-info">
                  <h4 className="detail-title">📦 Requested Supplies</h4>
                  <div className="supplies-list">
                    {req.requestedSupplies?.map((item, i) => (
                      <div key={i} className="supply-item">
                        <div className="supply-details">
                          <span className="supply-name">
                            {item.supply?.name || 'Unknown Supply'}
                          </span>
                          <span className="supply-category">
                            {item.supply?.category || 'Unknown Category'}
                          </span>
                        </div>
                        <span className="supply-quantity">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {req.status === 'APPROVED' && req.approvedSupplies?.length > 0 && (
                  <div className="detail-section approved-section">
                    <h4 className="detail-title">✅ Approved Supplies</h4>
                    <div className="supplies-list">
                      {req.approvedSupplies.map((item, i) => (
                        <div key={i} className="supply-item approved">
                          <div className="supply-details">
                            <span className="supply-name">
                              {item.supply?.name || 'Unknown Supply'}
                            </span>
                          </div>
                          <span className="supply-quantity supplied">
                            Supplied: {item.quantitySupplied}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {req.adminComments && (
                  <div className="detail-section comments-section">
                    <h4 className="detail-title">💬 Admin Comments</h4>
                    <p className="admin-comments">{req.adminComments}</p>
                  </div>
                )}

                {req.handledBy && (
                  <div className="detail-section handler-info">
                    <h4 className="detail-title">👨‍💼 Handled By</h4>
                    <p>{req.handledBy.name || 'Unknown Admin'}</p>
                  </div>
                )}
              </div>

              {req.status === 'PENDING' && (
                <div className="request-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(req._id)}
                  >
                    ✅ Approve Request
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(req._id)}
                  >
                    ❌ Reject Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplyRequests;
