import React from 'react';
import { useDispatch } from 'react-redux';
import { createAssignmentFromIncident, updateIncidentStatus } from '../features/incidents/incidentsSlice';

const IncidentsList = ({ incidents, isAdmin }) => {
  const dispatch = useDispatch();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'LOW': return '#28a745';
      case 'MEDIUM': return '#ffc107';
      case 'HIGH': return '#fd7e14';
      case 'CRITICAL': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REPORTED': return '#007bff';
      case 'ASSIGNED': return '#17a2b8';
      case 'IN_PROGRESS': return '#ffc107';
      case 'RESOLVED': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'FIRE': return '🔥';
      case 'FLOOD': return '🌊';
      case 'EARTHQUAKE': return '🏠';
      case 'MEDICAL': return '🏥';
      case 'ACCIDENT': return '🚗';
      default: return '⚠️';
    }
  };

  const handleCreateAssignment = (incidentId) => {
    if (window.confirm('Create an assignment from this incident?')) {
      dispatch(createAssignmentFromIncident({ id: incidentId, supplies: [] }));
    }
  };

  const handleStatusChange = (incidentId, newStatus) => {
    dispatch(updateIncidentStatus({ id: incidentId, status: newStatus }));
  };

  return (
    <div className="incidents-list">
      {incidents.length === 0 ? (
        <p>No incidents reported yet</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            <div className="incident-header">
              <div className="incident-title">
                <span className="category-icon">{getCategoryIcon(incident.category)}</span>
                <h4>{incident.title}</h4>
              </div>
              <div className="incident-badges">
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(incident.severity) }}
                >
                  {incident.severity}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(incident.status) }}
                >
                  {incident.status}
                </span>
              </div>
            </div>

            <div className="incident-body">
              <p className="incident-description">{incident.description}</p>
              
              <div className="incident-details">
                <div className="detail-item">
                  <strong>Reported by:</strong> {incident.reportedBy?.name} (@{incident.reportedBy?.userName})
                </div>
                <div className="detail-item">
                  <strong>Location:</strong> 📍 [{incident.location.coordinates.join(', ')}]
                </div>
                <div className="detail-item">
                  <strong>Reported:</strong> {new Date(incident.createdAt).toLocaleString()}
                </div>
                {incident.contactInfo?.phone && (
                  <div className="detail-item">
                    <strong>Contact:</strong> {incident.contactInfo.phone}
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="incident-actions">
                {incident.status === 'REPORTED' && (
                  <button 
                    onClick={() => handleCreateAssignment(incident._id)}
                    className="create-assignment-btn"
                  >
                    📋 Create Assignment
                  </button>
                )}
                
                {incident.status !== 'RESOLVED' && (
                  <select 
                    value={incident.status} 
                    onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="REPORTED">Reported</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                )}

                {incident.assignmentCreated && (
                  <span className="assignment-link">
                    ✅ Assignment Created
                  </span>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default IncidentsList;
