import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createIncident } from '../features/incidents/incidentsSlice';

const ReportIncidentForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    severity: 'MEDIUM',
    location: { coordinates: [0, 0] },
    contactInfo: { phone: '', email: '' }
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
          setUseCurrentLocation(true);
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!useCurrentLocation && (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0)) {
      alert('Please set your location or use current location');
      return;
    }

    const incidentData = {
      ...formData,
      location: { type: 'Point', coordinates: formData.location.coordinates }
    };

    try {
      await dispatch(createIncident(incidentData)).unwrap();
      alert('Incident reported successfully!');
      onClose();
    } catch (error) {
      alert('Error reporting incident: ' + error);
    }
  };

  return (
    <div className="incident-form-overlay">
      <div className="incident-form">
        <h2>🚨 Report Emergency Incident</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Brief description of the emergency"
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="FIRE">🔥 Fire</option>
              <option value="FLOOD">🌊 Flood</option>
              <option value="EARTHQUAKE">🏠 Earthquake</option>
              <option value="MEDICAL">🏥 Medical Emergency</option>
              <option value="ACCIDENT">🚗 Accident</option>
              <option value="OTHER">⚠️ Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Severity*</label>
            <select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">🚨 Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={1000}
              rows={4}
              placeholder="Detailed description of the situation, number of people affected, immediate needs..."
            />
          </div>

          <div className="form-group">
            <label>Location*</label>
            <button type="button" onClick={getCurrentLocation} className="location-btn">
              📍 Use Current Location
            </button>
            {useCurrentLocation && (
              <p className="location-info">✅ Current location captured</p>
            )}
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="tel"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleChange}
              placeholder="Your email address"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">🚨 Report Incident</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIncidentForm;
