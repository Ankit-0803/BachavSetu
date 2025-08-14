// src/features/assignments/assignmentsAPI.js

const API_BASE = 'http://localhost:5000';

export const assignmentsAPI = {
  getAllAssignments: async () => {
    const response = await fetch(`${API_BASE}/assignments`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }
    // Return the array of assignments directly (no wrapping)
    return await response.json();
  },

  updateAssignment: async (id, updates) => {
    const response = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update assignment');
    }
    // Return the updated assignment object directly
    return await response.json();
  },
};
