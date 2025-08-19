import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIncident } from '../features/incidents/incidentsSlice';
import { fetchSupplies } from '../features/supplies/suppliesSlice';
import './ReportIncidentForm.css';

const ReportIncidentForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const supplies = useSelector(state => state.supplies.items);
  const { loading } = useSelector(state => state.incidents);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    category: 'OTHER',
    contactInfo: {
      phone: '',
      email: ''
    },
    images: [],
    requestedSupplies: []
  });

  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSupplyModal, setShowSupplyModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSupplies());
    getCurrentLocation();
  }, [dispatch]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude]
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Default to a location if geolocation fails
          setLocation({
            type: 'Point',
            coordinates: [77.2090, 28.6139] // Delhi
          });
        }
      );
    } else {
      setLocation({
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Delhi
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contactInfo.phone && !phoneRegex.test(formData.contactInfo.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Email validation (if provided)
    if (formData.contactInfo.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactInfo.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (!location) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('severity', formData.severity);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', JSON.stringify(location));
      formDataToSend.append('contactInfo', JSON.stringify(formData.contactInfo));
      formDataToSend.append('requestedSupplies', JSON.stringify(formData.requestedSupplies));
      
      // Append images
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });
      
      await dispatch(createIncident(formDataToSend)).unwrap();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create incident' });
    }
  };

  const addSupply = (supply, quantity, people) => {
    const newSupply = {
      item: supply.name,
      quantity: parseInt(quantity),
      people: parseInt(people)
    };

    setFormData(prev => ({
      ...prev,
      requestedSupplies: [...prev.requestedSupplies, newSupply]
    }));
    setShowSupplyModal(false);
  };

  const removeSupply = (index) => {
    setFormData(prev => ({
      ...prev,
      requestedSupplies: prev.requestedSupplies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="incident-form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h2>🚨 Report New Incident</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Incident Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the incident"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
              >
                <option value="FIRE">🔥 Fire</option>
                <option value="FLOOD">🌊 Flood</option>
                <option value="EARTHQUAKE">🏠 Earthquake</option>
                <option value="MEDICAL">🏥 Medical Emergency</option>
                <option value="ACCIDENT">🚗 Accident</option>
                <option value="OTHER">⚠️ Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the incident, location details, and immediate help needed..."
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity *</label>
              <select 
                name="severity" 
                value={formData.severity} 
                onChange={handleInputChange}
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="CRITICAL">🔴 Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                placeholder="Your contact number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleInputChange}
              placeholder="Your email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Images/Evidence</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <small className="help-text">Upload photos showing the incident (max 8 images)</small>
          </div>

          {/* Supplies Section */}
          <div className="supplies-section">
            <div className="supplies-header">
              <label>Requested Supplies</label>
              <button 
                type="button" 
                className="add-supply-btn"
                onClick={() => setShowSupplyModal(true)}
              >
                + Add Supplies
              </button>
            </div>
            
            {formData.requestedSupplies.length > 0 && (
              <div className="selected-supplies">
                {formData.requestedSupplies.map((supply, index) => (
                  <div key={index} className="supply-chip">
                    <span className="supply-text">
                      {supply.item}: {supply.quantity} for {supply.people} people
                    </span>
                    <button 
                      type="button" 
                      onClick={() => removeSupply(index)}
                      className="remove-supply"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="location-info">
            <p>📍 Location: {location ? 'Detected' : 'Detecting...'}</p>
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Reporting...' : '🚨 Report Incident'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>

        {/* Supply Selection Modal */}
        {showSupplyModal && (
          <SupplySelectionModal 
            supplies={supplies}
            onClose={() => setShowSupplyModal(false)}
            onAdd={addSupply}
          />
        )}
      </div>
    </div>
  );
};

// Supply Selection Modal Component
const SupplySelectionModal = ({ supplies, onClose, onAdd }) => {
  const [selectedSupply, setSelectedSupply] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [people, setPeople] = useState(1);

  const handleAdd = () => {
    if (selectedSupply && quantity > 0 && people > 0) {
      const supply = supplies.find(s => s._id === selectedSupply);
      onAdd(supply, quantity, people);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="supply-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📦 Select Supply</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="supply-selection">
          <div className="form-group">
            <label>Available Supplies</label>
            <select 
              value={selectedSupply}
              onChange={(e) => setSelectedSupply(e.target.value)}
            >
              <option value="">Select a supply...</option>
              {supplies.map(supply => (
                <option key={supply._id} value={supply._id}>
                  {supply.name} ({supply.category}) - Available: {supply.quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity Needed</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Number of People</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="add-btn"
              onClick={handleAdd}
              disabled={!selectedSupply || quantity <= 0 || people <= 0}
            >
              Add Supply
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncidentForm;
