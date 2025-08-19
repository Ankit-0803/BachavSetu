import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignupForm /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          
          {/* Fallback redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
