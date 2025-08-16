import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, updateAssignmentStatus } from '../features/assignments/assignmentsSlice';
import './AssignmentsList.css';

const AssignmentsList = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(state => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleStatusUpdate = (assignmentId, newStatus) => {
    dispatch(updateAssignmentStatus({ id: assignmentId, status: newStatus }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return '#007bff';
      case 'ASSIGNED': return '#17a2b8';
      case 'COMPLETED': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UPCOMING': return '📅';
      case 'ASSIGNED': return '👷';
      case 'COMPLETED': return '✅';
      default: return '📋';
    }
  };

  // Fixed formatCoordinates function
  const formatCoordinates = (coordinates) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="assignments-loading">📋 Loading assignments...</div>;
  if (error) return <div className="assignments-error">❌ Error: {error}</div>;

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <div className="assignments-stats">
          <div className="stat-card">
            <span className="stat-number">{assignments.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card upcoming">
            <span className="stat-number">{assignments.filter(a => a.status === 'UPCOMING').length}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-card assigned">
            <span className="stat-number">{assignments.filter(a => a.status === 'ASSIGNED').length}</span>
            <span className="stat-label">Assigned</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-number">{assignments.filter(a => a.status === 'COMPLETED').length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="assignments-empty">
          <div className="empty-icon">📋</div>
          <h3>No Assignments Yet</h3>
          <p>Assignments will appear here when created from incidents</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map(assignment => (
            <div key={assignment._id} className="assignment-card">
              <div className="assignment-header">
                <div className="assignment-id">
                  <span className="assignment-icon">🎯</span>
                  <h3>Assignment #{assignment.hash || assignment._id.slice(-6)}</h3>
                </div>
                <div className="status-section">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(assignment.status) }}
                  >
                    {getStatusIcon(assignment.status)} {assignment.status}
                  </span>
                </div>
              </div>

              <div className="assignment-details">
                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <div className="detail-content">
                    <strong>Location:</strong>
                    <span className="coordinates">
                      {formatCoordinates(assignment.area?.coordinates)}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">📦</span>
                  <div className="detail-content">
                    <strong>Supplies:</strong>
                    <span>{assignment.supplies?.length || 0} items assigned</span>
                  </div>
                </div>

                {assignment.image && (
                  <div className="detail-row">
                    <span className="detail-icon">📸</span>
                    <div className="detail-content">
                      <strong>Evidence:</strong>
                      <span>Image attached</span>
                    </div>
                  </div>
                )}

                <div className="detail-row">
                  <span className="detail-icon">🕒</span>
                  <div className="detail-content">
                    <strong>Created:</strong>
                    <span>{formatDate(assignment.createdAt)}</span>
                  </div>
                </div>

                {assignment.updatedAt !== assignment.createdAt && (
                  <div className="detail-row">
                    <span className="detail-icon">🔄</span>
                    <div className="detail-content">
                      <strong>Last Updated:</strong>
                      <span>{formatDate(assignment.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="assignment-actions">
                <label className="status-label">Update Status:</label>
                <select
                  value={assignment.status}
                  onChange={(e) => handleStatusUpdate(assignment._id, e.target.value)}
                  className="status-select"
                >
                  <option value="UPCOMING">📅 Upcoming</option>
                  <option value="ASSIGNED">👷 Assigned</option>
                  <option value="COMPLETED">✅ Completed</option>
                </select>
              </div>

              {assignment.supplies && assignment.supplies.length > 0 && (
                <div className="supplies-section">
                  <h4 className="supplies-title">📋 Assigned Supplies:</h4>
                  <ul className="supplies-list">
                    {assignment.supplies.map((supply, index) => (
                      <li key={index} className="supply-item">
                        {supply.name || `Supply ${index + 1}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
