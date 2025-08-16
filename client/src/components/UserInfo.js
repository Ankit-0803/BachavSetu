import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const UserInfo = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
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
      return 'Not set';
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="user-info">
        <p>👤 Not logged in</p>
      </div>
    );
  }

  return (
    <div className="user-info">
      <div className="user-details">
        <p className="user-name">
          👤 Welcome, <strong>{user.name}</strong>
          {user.isAdmin && <span className="admin-badge">ADMIN</span>}
        </p>
        <p className="user-location">
          📍 Location: [{formatCoordinates(user.geometry?.coordinates)}]
        </p>
        <p className="user-id">
          🆔 ID: {user.userName || user.id}
        </p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default UserInfo;
