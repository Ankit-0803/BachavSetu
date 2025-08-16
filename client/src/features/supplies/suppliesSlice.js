import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const fetchSupplies = createAsyncThunk('supplies/fetch', async () => {
  const res = await axios.get(`${API}/supplies`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
});
export const createSupply = createAsyncThunk('supplies/create', async data => {
  const res = await axios.post(`${API}/supplies`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
});
export const updateSupply = createAsyncThunk('supplies/update', async ({ id, updates }) => {
  const res = await axios.patch(`${API}/supplies/${id}`, updates, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
});
export const deleteSupply = createAsyncThunk('supplies/delete', async id => {
  await axios.delete(`${API}/supplies/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return id;
});
export const changeSupplyQuantity = createAsyncThunk('supplies/quantity', async ({ id, action, amount }) => {
  const res = await axios.post(`${API}/supplies/${id}/quantity`, { action, amount }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return res.data;
});

const suppliesSlice = createSlice({
  name: 'supplies',
  initialState: { items: [], loading: false },
  extraReducers: builder => {
    builder
      .addCase(fetchSupplies.fulfilled, (state, { payload }) => { state.items = payload; })
      .addCase(createSupply.fulfilled, (state, { payload }) => { state.items.push(payload); })
      .addCase(updateSupply.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex(i => i._id === payload._id);
        if (idx >= 0) state.items[idx] = payload;
      })
      .addCase(deleteSupply.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(i => i._id !== payload);
      })
      .addCase(changeSupplyQuantity.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex(i => i._id === payload._id);
        if (idx >= 0) state.items[idx].quantity = payload.quantity;
      });
  }
});

export default suppliesSlice.reducer;
