import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Footer from './Footer';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              🚒 <span className="brand">BachavSetu</span>
            </h1>
            <p className="hero-subtitle"><strong>Disaster Relief Platform</strong></p>
            <p className="hero-description">
              <strong>Bridging communities with essential resources in times of need. 
              Join our network of volunteers and administrators working together for emergency preparedness.</strong>
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📋</span>
                <span>Real-time Incident Reporting</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📦</span>
                <span>Supply Chain Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗺️</span>
                <span>Assignment Coordination</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Volunteer Network</span>
              </div>
            </div>
          </div>

          <div className="auth-section">
            <div className="auth-buttons">
              <button 
                className="auth-btn login-btn"
                onClick={() => navigate('/login')}
              >
                🔑 Sign In
              </button>
              <button 
                className="auth-btn signup-btn"
                onClick={() => navigate('/signup')}
              >
                ✨ Sign Up
              </button>
            </div>
            
            <div className="demo-section">
              <p className="demo-text">Quick Demo Access:</p>
              <div className="demo-buttons">
                <button 
                  className="demo-btn admin-demo"
                  onClick={() => navigate('/login?demo=admin')}
                >
                  👨‍💼 Admin Demo
                </button>
                <button 
                  className="demo-btn user-demo"
                  onClick={() => navigate('/login?demo=user')}
                >
                  👤 User Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-content">
          <h2>How BachavSetu Works</h2>
          <div className="workflow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Report Incidents</h3>
                <p>Citizens report disasters and emergencies with photos and location data</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Coordinate Resources</h3>
                <p>Administrators manage supply chains and allocate resources efficiently</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Deploy Teams</h3>
                <p>Volunteers receive assignments and coordinate response efforts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
         {/* Render the Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
