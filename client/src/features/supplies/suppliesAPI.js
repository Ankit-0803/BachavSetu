const API_BASE = 'http://localhost:5000';

export const suppliesAPI = {
  getAllSupplies: async () => {
    const response = await fetch(`${API_BASE}/supplies`);
    if (!response.ok) {
      throw new Error('Failed to fetch supplies');
    }
    return { data: await response.json() };
  },
};
