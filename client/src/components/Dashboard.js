import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserInfo from './UserInfo';
import IncidentsList from './IncidentsList';
import ReportIncidentForm from './ReportIncidentForm';
import SupplyManagement from './SupplyManagement';
import SupplyRequests from './SupplyRequests';
import AssignmentsList from './AssignmentsList';
import { fetchIncidents, fetchMyIncidents } from '../features/incidents/incidentsSlice';
import { fetchAssignments } from '../features/assignments/assignmentsSlice';
import { fetchSupplyRequests } from '../features/supplyRequests/supplyRequestsSlice';
import { verifyToken } from '../features/auth/authSlice';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const incidents = useSelector(state => state.incidents.incidents);
  const myIncidents = useSelector(state => state.incidents.myIncidents);
  
  const [showReportForm, setShowReportForm] = useState(false);

  // Verify token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isAdmin) {
        dispatch(fetchIncidents());
        dispatch(fetchAssignments());
        dispatch(fetchSupplyRequests());
      } else {
        dispatch(fetchMyIncidents());
      }
    }
  }, [isAuthenticated, user?.isAdmin, dispatch, user]);

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/incidents')) return 'incidents';
    if (path.includes('/supplies')) return 'supplies';
    if (path.includes('/assignments')) return 'assignments';
    if (path.includes('/supply-requests')) return 'supply-requests';
    return 'incidents';
  };

  const navigateToTab = (tab) => {
    const prefix = user?.isAdmin ? '/dashboard/admin' : '/dashboard/user';
    navigate(`${prefix}/${tab}`);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚒 bachavSetu - Disaster Management System</h1>
        <UserInfo />
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-navigation">
        <button 
          className={`nav-btn ${getCurrentTab() === 'incidents' ? 'active' : ''}`}
          onClick={() => navigateToTab('incidents')}
        >
          📋 Incidents
        </button>
        
        <button 
          className={`nav-btn ${getCurrentTab() === 'supplies' ? 'active' : ''}`}
          onClick={() => navigateToTab('supplies')}
        >
          📦 Supplies
        </button>
        
        {/* Admin-only tabs */}
        {user?.isAdmin && (
          <>
            <button 
              className={`nav-btn ${getCurrentTab() === 'assignments' ? 'active' : ''}`}
              onClick={() => navigateToTab('assignments')}
            >
              📋 Assignments
            </button>
            
            <button 
              className={`nav-btn ${getCurrentTab() === 'supply-requests' ? 'active' : ''}`}
              onClick={() => navigateToTab('supply-requests')}
            >
              🔄 Supply Requests
            </button>
          </>
        )}
      </nav>

      {/* Content Area with Routing */}
      <main className="dashboard-content">
        <Routes>
          {/* Admin Routes */}
          {user?.isAdmin ? (
            <>
              <Route path="/admin/incidents" element={
                <div className="dashboard-section">
                  <h2>📋 All Incidents</h2>
                  <IncidentsList incidents={incidents} isAdmin={true} />
                </div>
              } />
              <Route path="/admin/supplies" element={
                <div className="dashboard-section">
                  <h2>📦 Supply Management</h2>
                  <SupplyManagement />
                </div>
              } />
              <Route path="/admin/assignments" element={
                <div className="dashboard-section">
                  <h2>📋 Assignment Management</h2>
                  <AssignmentsList />
                </div>
              } />
              <Route path="/admin/supply-requests" element={
                <div className="dashboard-section">
                  <h2>🔄 Supply Requests</h2>
                  <SupplyRequests />
                </div>
              } />
              {/* Default redirect for admin */}
              <Route path="/" element={<Navigate to="/dashboard/admin/incidents" replace />} />
              <Route path="*" element={<Navigate to="/dashboard/admin/incidents" replace />} />
            </>
          ) : (
            /* User Routes */
            <>
              <Route path="/user/incidents" element={
                <div className="dashboard-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>📋 My Incidents</h2>
                    <button 
                      className="report-incident-btn"
                      onClick={() => setShowReportForm(true)}
                    >
                      🚨 Report Incident
                    </button>
                  </div>
                  <IncidentsList incidents={myIncidents} isAdmin={false} />
                </div>
              } />
              <Route path="/user/supplies" element={
                <div className="dashboard-section">
                  <h2>📦 Available Supplies</h2>
                  <SupplyManagement />
                </div>
              } />
              {/* Default redirect for user */}
              <Route path="/" element={<Navigate to="/dashboard/user/incidents" replace />} />
              <Route path="*" element={<Navigate to="/dashboard/user/incidents" replace />} />
            </>
          )}
        </Routes>
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

export default Dashboard;
