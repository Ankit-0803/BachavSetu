import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { fetchSupplies } from './features/supplies/suppliesSlice';
import { fetchIncidents, fetchMyIncidents } from './features/incidents/incidentsSlice';
import AssignmentsList from './features/assignments/AssignmentsList';
import SuppliesList from './features/supplies/SuppliesList';
import IncidentsList from './components/IncidentsList';
import ReportIncidentForm from './components/ReportIncidentForm';
import UserInfo from './components/UserInfo';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { assignments, loading: assignmentsLoading } = useSelector((state) => state.assignments);
  const { supplies, loading: suppliesLoading } = useSelector((state) => state.supplies);
  const { incidents, myIncidents, loading: incidentsLoading } = useSelector((state) => state.incidents);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('assignments');
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAssignments());
      dispatch(fetchSupplies());
      
      // Fetch incidents based on user role
      if (user?.isAdmin) {
        dispatch(fetchIncidents());
      } else {
        dispatch(fetchMyIncidents());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App">
        <LoginForm />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'assignments':
        return (
          <div className="dashboard-section">
            <h2>📋 Current Assignments</h2>
            {assignmentsLoading ? (
              <p>Loading assignments...</p>
            ) : (
              <AssignmentsList assignments={assignments} />
            )}
          </div>
        );
      
      case 'supplies':
        return (
          <div className="dashboard-section">
            <h2>📦 Available Supplies</h2>
            {suppliesLoading ? (
              <p>Loading supplies...</p>
            ) : (
              <SuppliesList supplies={supplies} />
            )}
          </div>
        );
      
      case 'incidents':
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>🚨 {user?.isAdmin ? 'All Incidents' : 'My Reported Incidents'}</h2>
              {!user?.isAdmin && (
                <button 
                  onClick={() => setShowReportForm(true)}
                  className="report-incident-btn"
                >
                  📝 Report New Incident
                </button>
              )}
            </div>
            {incidentsLoading ? (
              <p>Loading incidents...</p>
            ) : (
              <IncidentsList 
                incidents={user?.isAdmin ? incidents : myIncidents} 
                isAdmin={user?.isAdmin}
              />
            )}
          </div>
        );
      
      default:
        return renderContent();
    }
  };

  // Show dashboard if authenticated
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚨 Disaster Management System</h1>
        <UserInfo />
      </header>
      
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'assignments' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('assignments')}
        >
          📋 Assignments
        </button>
        <button 
          className={activeTab === 'supplies' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('supplies')}
        >
          📦 Supplies
        </button>
        <button 
          className={activeTab === 'incidents' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('incidents')}
        >
          🚨 Incidents
        </button>
      </nav>
      
      <main className="dashboard">
        {renderContent()}
      </main>

      {showReportForm && (
        <ReportIncidentForm onClose={() => setShowReportForm(false)} />
      )}
    </div>
  );
}

export default App;
