import React from 'react';
import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="user-info">
        <p>👤 Not logged in | <a href="/login">Login</a></p>
      </div>
    );
  }

  return (
    <div className="user-info">
      <p>👤 Welcome, {user.name} {user.isAdmin && '(Admin)'}</p>
      <p>📍 Location: [{user.geometry?.coordinates?.join(', ') || 'Unknown'}]</p>
    </div>
  );
};

export default UserInfo;
