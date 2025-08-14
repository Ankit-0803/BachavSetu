import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { suppliesAPI } from './suppliesAPI';

const initialState = {
  supplies: [],
  loading: false,
  error: null,
};

export const fetchSupplies = createAsyncThunk(
  'supplies/fetchSupplies',
  async () => {
    const response = await suppliesAPI.getAllSupplies();
    return response.data;
  }
);

const suppliesSlice = createSlice({
  name: 'supplies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupplies.fulfilled, (state, action) => {
        state.loading = false;
        state.supplies = action.payload;
      })
      .addCase(fetchSupplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default suppliesSlice.reducer;
