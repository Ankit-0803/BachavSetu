import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssignments,
  updateAssignmentStatus,
  deleteAssignment
} from '../features/assignments/assignmentsSlice';
import './AssignmentsList.css';

const AssignmentsList = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(state => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments());
    const interval = setInterval(() => dispatch(fetchAssignments()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateAssignmentStatus({ id, status }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      dispatch(deleteAssignment(id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'REPORTED': return '#6c757d';
      case 'ASSIGNED': return '#17a2b8';
      case 'IN_PROGRESS': return '#ffc107';
      case 'RESOLVED': return '#28a745';
      case 'COMPLETED': return '#343a40';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'REPORTED': return '📋';
      case 'ASSIGNED': return '👷';
      case 'IN_PROGRESS': return '🏃';
      case 'RESOLVED': return '🔒';
      case 'COMPLETED': return '✅';
      default: return '📋';
    }
  };

  const formatCoords = (coords) => {
    if(!Array.isArray(coords) || coords.length !== 2) return 'Unknown';
    const [lng, lat] = coords.map(Number);
    if(isNaN(lng) || isNaN(lat)) return 'Invalid';
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  if (loading) return <div className="assignments-loading">Loading assignments…</div>;
  if (error) return <div className="assignments-error">Error: {error}</div>;

  if(assignments.length === 0){
    return (
      <div className="assignments-empty">
        <div className="empty-icon">📋</div>
        <h3>No Assignments Found</h3>
      </div>
    );
  }

  return (
    <div className="assignments-container">
      <div className="assignments-grid">
        {assignments.map(assignment => (
          <div key={assignment._id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-id">
                <span className="assignment-icon">🎯</span>
                <h3>#{assignment._id.slice(-6)}</h3>
              </div>
              <div className="status-section">
                <span className="status-badge" style={{backgroundColor: getStatusColor(assignment.status)}}>
                  {getStatusIcon(assignment.status)} {assignment.status.replace('_',' ')}
                </span>
                <button className="menu-btn" onClick={() => handleDelete(assignment._id)}>⋮</button>
              </div>
            </div>

            <div className="assignment-details">
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <span className="detail-content">{formatCoords(assignment.area?.coordinates)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-icon">📦</span>
                <span className="detail-content">{assignment.supplies?.length || 0} items</span>
              </div>
              <div className="assignment-actions">
                <select
                  className="status-select"
                  value={assignment.status}
                  onChange={e => handleStatusChange(assignment._id, e.target.value)}
                >
                  {['REPORTED','ASSIGNED','IN_PROGRESS','RESOLVED','COMPLETED'].map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsList;
