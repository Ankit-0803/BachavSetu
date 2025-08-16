import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createAssignmentFromIncident,
  updateIncidentStatus
} from '../features/incidents/incidentsSlice';
import { addAssignment } from '../features/assignments/assignmentsSlice';
import IncidentModal from './IncidentModal';
import './IncidentsList.css';

const BACKEND_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const IncidentsList = ({ incidents, isAdmin }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);

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

  const getCategoryIcon = category => {
    const icons = {
      FIRE: '🔥',
      FLOOD: '🌊',
      EARTHQUAKE: '🏠',
      MEDICAL: '🏥',
      ACCIDENT: '🚗',
      OTHER: '⚠️'
    };
    return icons[category] || '⚠️';
  };

  // Fixed formatLocation function
  const formatLocation = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return 'Unknown';
    }
    
    const [longitude, latitude] = coordinates;
    
    // Check if both values are valid numbers
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return 'Invalid coordinates';
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateAssignment = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Create an assignment from this incident?')) {
      try {
        const result = await dispatch(createAssignmentFromIncident({ id, supplies: [] })).unwrap();
        
        // Add the new assignment to assignments list
        if (result.assignment) {
          dispatch(addAssignment(result.assignment));
        }
        
        alert('Assignment created successfully!');
      } catch (error) {
        alert('Error creating assignment: ' + error.message);
      }
    }
  };

  const handleStatusUpdate = (e, id) => {
    e.stopPropagation();
    dispatch(updateIncidentStatus({ id, status: e.target.value }));
  };

  // Handle cases where incidents might be null or undefined
  if (!incidents || incidents.length === 0) {
    return (
      <div className="incidents-list">
        <div className="incidents-empty">
          <div className="empty-icon">📋</div>
          <h3>No Incidents Found</h3>
          <p>{isAdmin ? 'No incidents have been reported yet' : 'You haven\'t reported any incidents yet'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="incidents-list">
        {incidents.map(inc => (
          <div
            key={inc._id}
            className="incident-card"
            onClick={() => setSelected(inc)}
          >
            <div className="cover-container">
              <img
                src={
                  inc.images?.[0]
                    ? `${BACKEND_URL}${inc.images}`
                    : '/default-incident.png'
                }
                alt="Incident cover"
                className="cover-photo"
                onError={(e) => {
                  e.target.src = '/default-incident.png';
                }}
              />
              <div className="severity-overlay">
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(inc.severity) }}
                >
                  {inc.severity}
                </span>
              </div>
            </div>

            <div className="incident-summary">
              <div className="incident-title">
                <span className="category-icon">
                  {getCategoryIcon(inc.category)}
                </span>
                <h3>{inc.title}</h3>
              </div>
              
              <p className="incident-description">{inc.description}</p>
              
              {/* Supply Preview */}
              {inc.requestedSupplies && inc.requestedSupplies.length > 0 && (
                <div className="supplies-preview">
                  <h5>🎒 Supplies Requested:</h5>
                  <div className="supplies-list">
                    {inc.requestedSupplies.slice(0, 3).map((supply, idx) => (
                      <span key={idx} className="supply-item">
                        {supply.item}: {supply.quantity} for {supply.people} people
                      </span>
                    ))}
                    {inc.requestedSupplies.length > 3 && (
                      <span className="supply-item more">
                        +{inc.requestedSupplies.length - 3} more items
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="badges">
                <span
                  className="badge status"
                  style={{ backgroundColor: getStatusColor(inc.status) }}
                >
                  {inc.status.replace('_', ' ')}
                </span>
                <span className="badge category">
                  {inc.category}
                </span>
              </div>

              <div className="incident-metadata">
                <div className="metadata-row">
                  <span className="metadata-icon">📍</span>
                  <span className="metadata-text">{formatLocation(inc.location?.coordinates)}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-icon">👤</span>
                  <span className="metadata-text">{inc.reportedBy?.name || 'Unknown'}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-icon">🕒</span>
                  <span className="metadata-text">{formatDate(inc.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="incident-actions">
                {inc.status === 'REPORTED' && !inc.assignmentCreated && (
                  <button
                    className="action-btn create-assignment"
                    onClick={e => handleCreateAssignment(e, inc._id)}
                  >
                    🎯 Create Assignment
                  </button>
                )}
                
                {inc.assignmentCreated && (
                  <div className="assignment-info">
                    ✅ Assignment Created
                  </div>
                )}
                
                {inc.status !== 'RESOLVED' && (
                  <select
                    className="status-select"
                    value={inc.status}
                    onChange={e => handleStatusUpdate(e, inc._id)}
                    onClick={e => e.stopPropagation()}
                  >
                    {['REPORTED','ASSIGNED','IN_PROGRESS','RESOLVED'].map(s => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Incident Modal */}
      {selected && (
        <IncidentModal
          incident={selected}
          onClose={() => setSelected(null)}
          backendUrl={BACKEND_URL}
        />
      )}
    </>
  );
};

export default IncidentsList;
