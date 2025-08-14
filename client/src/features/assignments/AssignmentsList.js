import React from 'react';
import { useDispatch } from 'react-redux';
import { updateAssignmentStatus } from './assignmentsSlice';

const AssignmentsList = ({ assignments }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAssignmentStatus({ id, status: newStatus }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return '#ffa500';
      case 'ASSIGNED': return '#007bff';
      case 'COMPLETED': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="assignments-list">
      {assignments.length === 0 ? (
        <p>No assignments found</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment._id || assignment.hash} className="assignment-card">
            <div className="assignment-header">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(assignment.status) }}
              >
                {assignment.status}
              </span>
              <span className="coordinates">
                📍 [{assignment.area?.coordinates?.join(', ') || 'No location'}]
              </span>
            </div>
            
            <div className="assignment-supplies">
              <strong>Supplies needed:</strong> {assignment.supplies?.length || 0} items
            </div>

            {assignment.status === 'UPCOMING' && (
              <button 
                onClick={() => handleStatusChange(assignment._id, 'ASSIGNED')}
                className="assign-btn"
              >
                Accept Assignment
              </button>
            )}

            {assignment.status === 'ASSIGNED' && (
              <button 
                onClick={() => handleStatusChange(assignment._id, 'COMPLETED')}
                className="complete-btn"
              >
                Mark Complete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AssignmentsList;
