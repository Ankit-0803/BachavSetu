import React, { useState, useEffect } from 'react';
import './SupplyForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { createSupply, updateSupply } from '../features/supplies/suppliesSlice';

const SupplyForm = ({ supply, onClose, onSave }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // Move all hooks to the top - before any conditional logic
  const [form, setForm] = useState({
    name: '',
    category: 'FOOD',
    quantity: 0,
    threshold: 10,
    location: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supply) {
      setForm({
        name: supply.name || '',
        category: supply.category || 'FOOD',
        quantity: supply.quantity || 0,
        threshold: supply.threshold || 10,
        location: supply.location || '',
        description: supply.description || ''
      });
    }
  }, [supply]);

  // Now do the conditional check after all hooks
  if (!user?.isAdmin) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (form.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (form.threshold < 0) {
      newErrors.threshold = 'Threshold cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'quantity' || name === 'threshold' ? parseInt(value) || 0 : value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (supply) {
        await dispatch(updateSupply({ id: supply._id, updates: form })).unwrap();
      } else {
        await dispatch(createSupply(form)).unwrap();
      }
      onSave();
    } catch (error) {
      alert('Error saving supply: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="supply-form-overlay" onClick={onClose}>
      <div className="supply-form" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h3>{supply ? 'Edit Supply' : 'Add New Supply'}</h3>
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supply Name *</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Rice Bags, First Aid Kit"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="FOOD">🍚 Food</option>
              <option value="CLOTHES">👕 Clothes</option>
              <option value="SHELTER">🏠 Shelter</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Quantity *</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                min={0}
                required
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label>Alert Threshold *</label>
              <input
                name="threshold"
                type="number"
                value={form.threshold}
                onChange={handleChange}
                min={0}
                required
              />
              {errors.threshold && <span className="error-text">{errors.threshold}</span>}
              <small className="help-text">Alert when quantity falls below this number</small>
            </div>
          </div>

          <div className="form-group">
            <label>Storage Location *</label>
            <input
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Warehouse A, Room 101"
              required
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Additional details about this supply..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (supply ? 'Update Supply' : 'Add Supply')}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplyForm;
