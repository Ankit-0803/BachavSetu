import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from './features/auth/authSlice';
import LoginForm from './components/LoginForm';
import UserInfo from './components/UserInfo';
import IncidentsList from './components/IncidentsList';
import ReportIncidentForm from './components/ReportIncidentForm';
import SupplyManagement from './components/SupplyManagement';
import SupplyRequests from './components/SupplyRequests';
import AssignmentsList from './components/AssignmentsList';
import { fetchIncidents, fetchMyIncidents } from './features/incidents/incidentsSlice';
import { fetchAssignments } from './features/assignments/assignmentsSlice';
import { fetchSupplyRequests } from './features/supplyRequests/supplyRequestsSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const incidents = useSelector(state => state.incidents.incidents);
  const myIncidents = useSelector(state => state.incidents.myIncidents);
  const assignments = useSelector(state => state.assignments.assignments);
  
  const [activeTab, setActiveTab] = useState('incidents');
  const [showReportForm, setShowReportForm] = useState(false);

  // Check for stored token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // Auto-login if token exists but user not authenticated
      // You might want to verify token with backend here
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isAdmin) {
        dispatch(fetchIncidents());
        dispatch(fetchAssignments());
        dispatch(fetchSupplyRequests());
      } else {
        dispatch(fetchMyIncidents());
      }
    }
  }, [isAuthenticated, user?.isAdmin, dispatch]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'incidents':
        return (
          <div className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>📋 {user?.isAdmin ? 'All Incidents' : 'My Incidents'}</h2>
              {!user?.isAdmin && (
                <button 
                  className="add-btn report-incident-btn"
                  onClick={() => setShowReportForm(true)}
                >
                  🚨 Report Incident
                </button>
              )}
            </div>
            <IncidentsList 
              incidents={user?.isAdmin ? incidents : myIncidents} 
              isAdmin={user?.isAdmin || false}
            />
          </div>
        );
      
      case 'supplies':
        return (
          <div className="dashboard-section">
            <h2>📦 Supply Management</h2>
            <SupplyManagement />
          </div>
        );
      
      case 'assignments':
        // Only render for admin
        if (!user?.isAdmin) return null;
        return (
          <div className="dashboard-section">
            <h2>📋 Assignment Management</h2>
            <AssignmentsList />
          </div>
        );
      
      case 'supply-requests':
        // Only render for admin
        if (!user?.isAdmin) return null;
        return (
          <div className="dashboard-section">
            <h2>🔄 Supply Requests</h2>
            <SupplyRequests />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚒 bachavSetu - Disaster Management System</h1>
        <UserInfo />
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          📋 Incidents
        </button>
        
        <button 
          className={`tab-btn ${activeTab === 'supplies' ? 'active' : ''}`}
          onClick={() => setActiveTab('supplies')}
        >
          📦 Supplies
        </button>
        
        {/* Admin-only tabs */}
        {user?.isAdmin && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              📋 Assignments
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'supply-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('supply-requests')}
            >
              🔄 Supply Requests
            </button>
          </>
        )}
      </nav>

      {/* Content Area */}
      <main className="main-content">
        {renderTabContent()}
      </main>

      {/* Report Incident Modal */}
      {showReportForm && (
        <ReportIncidentForm 
          onClose={() => setShowReportForm(false)} 
        />
      )}
    </div>
  );
}

export default App;
