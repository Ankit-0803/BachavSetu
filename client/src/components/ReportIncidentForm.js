import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createIncident } from '../features/incidents/incidentsSlice';

const SUPPLY_OPTIONS = ['Rice', 'Medicine kit', 'Plastic Tripal', 'Teflon sheet', 'Stove'];

const ReportIncidentForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [severity, setSeverity] = useState('MEDIUM');
  const [location, setLocation] = useState({ type: 'Point', coordinates: [0, 0] });
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });
  const [requestedSupplies, setRequestedSupplies] = useState([
    { item: '', quantity: '', people: '' }
  ]);
  const [images, setImages] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setLocation({ type: 'Point', coordinates: coords });
        setUseCurrentLocation(true);
      },
      err => alert('Location error: ' + err.message)
    );
  };

  // Images
  const handleImagesChange = e => {
    setImages(prev => [...prev, ...Array.from(e.target.files)]);
  };
  const removeImage = idx => {
    setImages(imgs => imgs.filter((_, i) => i !== idx));
  };

  // Supplies
  const addSupply = () => setRequestedSupplies(prev => [...prev, { item: '', quantity: '', people: '' }]);
  const removeSupply = idx =>
    setRequestedSupplies(prev => prev.filter((_, i) => i !== idx));
  const handleSupplyChange = (idx, field, value) => {
    const copy = [...requestedSupplies];
    copy[idx][field] = value;
    setRequestedSupplies(copy);
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!useCurrentLocation && location.coordinates.every(c => c === 0)) {
      return alert('Please use current location or set manually');
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('severity', severity);
    formData.append('location', JSON.stringify(location));
    formData.append('contactInfo', JSON.stringify(contactInfo));
    formData.append('requestedSupplies', JSON.stringify(requestedSupplies));
    images.forEach(file => formData.append('images', file));

    try {
      await dispatch(createIncident(formData)).unwrap();
      alert('Incident reported successfully');
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="incident-form-overlay">
      <div className="incident-form">
        <h2>🚨 Report Emergency Incident</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title */}
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Severity */}
          <div className="form-group">
            <label>Category*</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="FIRE">🔥 Fire</option>
              <option value="FLOOD">🌊 Flood</option>
              <option value="EARTHQUAKE">🏠 Earthquake</option>
              <option value="MEDICAL">🏥 Medical</option>
              <option value="ACCIDENT">🚗 Accident</option>
              <option value="OTHER">⚠️ Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Severity*</label>
            <select value={severity} onChange={e => setSeverity(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description*</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location*</label>
            <button type="button" onClick={getCurrentLocation} className="location-btn">
              📍 Use Current Location
            </button>
            {useCurrentLocation && <p className="location-info">Location captured ✅</p>}
          </div>

          {/* Contact */}
          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
            />
          </div>

          {/* Supplies */}
          <div className="form-group">
            <label>Supplies Needed</label>
            {requestedSupplies.map((s, idx) => (
              <div key={idx} className="supply-row">
                <select
                  value={s.item}
                  onChange={e => handleSupplyChange(idx, 'item', e.target.value)}
                  required
                >
                  <option value="">Select Supply</option>
                  {SUPPLY_OPTIONS.map(opt => (
                    <option value={opt} key={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={s.quantity}
                  min={1}
                  required
                  onChange={e => handleSupplyChange(idx, 'quantity', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="# People"
                  value={s.people}
                  min={1}
                  required
                  onChange={e => handleSupplyChange(idx, 'people', e.target.value)}
                />
                {idx > 0 && (
                  <button type="button" onClick={() => removeSupply(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSupply}>Add Another Supply</button>
          </div>

          {/* Images */}
          <div className="form-group">
            <label>Incident Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
            <div className="image-preview-list">
              {images.map((img, idx) => (
                <div key={idx} className="image-preview">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview ${idx}`}
                    width={80}
                  />
                  <button type="button" onClick={() => removeImage(idx)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <small>First image will be the cover photo.</small>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">Report Incident</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIncidentForm;
