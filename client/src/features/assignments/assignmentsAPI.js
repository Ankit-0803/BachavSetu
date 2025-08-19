const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const assignmentsAPI = {
  getAllAssignments: async () => {
    const res = await fetch(`${API_BASE}/assignments`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },
  updateAssignment: async (id, updates) => {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update assignment');
    return res.json();
  },
  deleteAssignment: async (id) => {
    const res = await fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete assignment');
    return res.json();
  }
};
