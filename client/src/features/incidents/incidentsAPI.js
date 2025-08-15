const API_BASE = 'http://localhost:5000';

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const incidentsAPI = {
  getAllIncidents: async () => {
    const response = await fetch(`${API_BASE}/incidents`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch incidents');
    }
    return await response.json();
  },

  getMyIncidents: async () => {
    const response = await fetch(`${API_BASE}/incidents/my`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch my incidents');
    }
    return await response.json();
  },

  createIncident: async (incidentData) => {
    const response = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(incidentData)
    });
    if (!response.ok) {
      throw new Error('Failed to create incident');
    }
    return await response.json();
  },

  updateIncident: async (id, updates) => {
    const response = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      throw new Error('Failed to update incident');
    }
    return await response.json();
  },

  createAssignmentFromIncident: async (id, supplies) => {
    const response = await fetch(`${API_BASE}/incidents/${id}/create-assignment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ supplies })
    });
    if (!response.ok) {
      throw new Error('Failed to create assignment from incident');
    }
    return await response.json();
  }
};
