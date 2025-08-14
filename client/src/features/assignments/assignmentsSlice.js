import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentsAPI } from './assignmentsAPI';

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async () => {
    // assignmentsAPI.getAllAssignments() already returns an array
    return await assignmentsAPI.getAllAssignments();
  }
);

export const updateAssignmentStatus = createAsyncThunk(
  'assignments/updateStatus',
  async ({ id, status }) => {
    // assignmentsAPI.updateAssignment returns the updated object
    return await assignmentsAPI.updateAssignment(id, { status });
  }
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        // payload is an array from API
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      });
  },
});

export default assignmentsSlice.reducer;
