import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { fetchSupplies } from './features/supplies/suppliesSlice';
import AssignmentsList from './features/assignments/AssignmentsList';
import SuppliesList from './features/supplies/SuppliesList';
import UserInfo from './components/UserInfo';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { assignments, loading: assignmentsLoading } = useSelector((state) => state.assignments);
  const { supplies, loading: suppliesLoading } = useSelector((state) => state.supplies);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAssignments());
      dispatch(fetchSupplies());
    }
  }, [dispatch, isAuthenticated]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App">
        <LoginForm />
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚨 Disaster Management System</h1>
        <UserInfo />
      </header>
      
      <main className="dashboard">
        <div className="dashboard-section">
          <h2>📋 Current Assignments</h2>
          {assignmentsLoading ? (
            <p>Loading assignments...</p>
          ) : (
            <AssignmentsList assignments={assignments} />
          )}
        </div>

        <div className="dashboard-section">
          <h2>📦 Available Supplies</h2>
          {suppliesLoading ? (
            <p>Loading supplies...</p>
          ) : (
            <SuppliesList supplies={supplies} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
