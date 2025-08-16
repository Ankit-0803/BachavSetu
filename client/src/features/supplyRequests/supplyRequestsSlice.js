// src/features/supplyRequests/supplyRequestsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// Fetch all supply requests (admin)
export const fetchSupplyRequests = createAsyncThunk(
  'supplyRequests/fetchAll',
  async () => {
    const response = await axios.get(`${API}/supplyRequests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
);

// Approve a supply request
export const approveRequest = createAsyncThunk(
  'supplyRequests/approve',
  async (requestId) => {
    const response = await axios.post(
      `${API}/supplyRequests/${requestId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  }
);

// Reject a supply request
export const rejectRequest = createAsyncThunk(
  'supplyRequests/reject',
  async (requestId) => {
    const response = await axios.post(
      `${API}/supplyRequests/${requestId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  }
);

const supplyRequestsSlice = createSlice({
  name: 'supplyRequests',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSupplyRequests.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchSupplyRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSupplyRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(req => req._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(req => req._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      });
  }
});

export default supplyRequestsSlice.reducer;
