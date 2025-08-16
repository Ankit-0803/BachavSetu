import React from 'react';
import './Modal.css';

const IncidentModal = ({ incident, onClose, backendUrl }) => {
  if (!incident) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = sev => {
    switch (sev) {
      case 'LOW': return '#28a745';
      case 'MEDIUM': return '#ffc107';
      case 'HIGH': return '#fd7e14';
      case 'CRITICAL': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'REPORTED': return '#007bff';
      case 'ASSIGNED': return '#17a2b8';
      case 'IN_PROGRESS': return '#ffc107';
      case 'RESOLVED': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">{incident.title}</h2>
          <div className="modal-badges">
            <span 
              className="modal-badge severity"
              style={{ backgroundColor: getSeverityColor(incident.severity) }}
            >
              {incident.severity}
            </span>
            <span 
              className="modal-badge status"
              style={{ backgroundColor: getStatusColor(incident.status) }}
            >
              {incident.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        {incident.images && incident.images.length > 0 && (
          <div className="modal-images-section">
            <img 
              src={`${backendUrl}${incident.images[0]}`} 
              alt="Incident" 
              className="modal-cover" 
            />
          </div>
        )}
        
        <div className="incident-details">
          <div className="detail-section">
            <h3 className="section-title">📝 Description</h3>
            <p className="section-content">{incident.description}</p>
          </div>

          <div className="detail-section">
            <h3 className="section-title">📊 Incident Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Category:</strong> 
                <span className="category-tag">{incident.category}</span>
              </div>
              <div className="info-item">
                <strong>Severity:</strong> 
                <span 
                  className="severity-tag"
                  style={{ backgroundColor: getSeverityColor(incident.severity), color: 'white' }}
                >
                  {incident.severity}
                </span>
              </div>
              <div className="info-item">
                <strong>Status:</strong> 
                <span className="status-tag">{incident.status.replace('_', ' ')}</span>
              </div>
              <div className="info-item">
                <strong>Reported:</strong> 
                <span>{formatDate(incident.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Supply Display */}
          {incident.requestedSupplies && incident.requestedSupplies.length > 0 && (
            <div className="detail-section supplies-section">
              <h3 className="section-title">🎒 Requested Supplies</h3>
              <div className="supplies-grid">
                {incident.requestedSupplies.map((supply, index) => (
                  <div key={index} className="supply-detail-card">
                    <div className="supply-icon">📦</div>
                    <div className="supply-info">
                      <div className="supply-name">{supply.item}</div>
                      <div className="supply-metrics">
                        <span className="supply-quantity">Qty: {supply.quantity}</span>
                        <span className="supply-people">For: {supply.people} people</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3 className="section-title">👤 Reporter Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong> 
                <span>{incident.reportedBy?.name || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <strong>Username:</strong> 
                <span>{incident.reportedBy?.userName || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong> 
                <span>{incident.contactInfo?.phone || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong> 
                <span>{incident.contactInfo?.email || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">📍 Location Details</h3>
            <div className="location-info">
              <p>
                <strong>Coordinates:</strong> 
                <span className="coordinates-text">
                  {incident.location?.coordinates?.join(', ') || 'Unknown'}
                </span>
              </p>
              <p className="location-note">
                💡 Coordinates are in [Longitude, Latitude] format
              </p>
            </div>
          </div>

          {incident.assignmentCreated && (
            <div className="detail-section assignment-section">
              <h3 className="section-title">🎯 Assignment Status</h3>
              <div className="assignment-status">
                ✅ An assignment has been created for this incident
              </div>
            </div>
          )}

          {incident.supplyRequest && (
            <div className="detail-section supply-request-section">
              <h3 className="section-title">📋 Supply Request Status</h3>
              <div className="supply-request-status">
                🔄 Supply request has been submitted to admin for approval
              </div>
            </div>
          )}

          {incident.images && incident.images.length > 1 && (
            <div className="detail-section">
              <h3 className="section-title">📸 Additional Images</h3>
              <div className="modal-images-grid">
                {incident.images.slice(1).map((img, index) => (
                  <img 
                    key={index + 1}
                    src={`${backendUrl}${img}`} 
                    alt={`Incident ${index + 2}`} 
                    className="modal-image-item"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;
