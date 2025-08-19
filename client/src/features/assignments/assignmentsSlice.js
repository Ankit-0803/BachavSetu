import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentsAPI } from './assignmentsAPI';

export const fetchAssignments = createAsyncThunk('assignments/fetch', async () =>
  assignmentsAPI.getAllAssignments()
);

export const updateAssignmentStatus = createAsyncThunk(
  'assignments/updateStatus',
  async ({ id, status }, { dispatch }) => {
    const updated = await assignmentsAPI.updateAssignment(id, { status });
    dispatch(fetchAssignments());
    return updated;
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (id, { dispatch }) => {
    await assignmentsAPI.deleteAssignment(id);
    dispatch(fetchAssignments());
    return id;
  }
);

export const createAssignmentFromIncident = createAsyncThunk(
  'assignments/createFromIncident',
  async ({ id, supplies }, { dispatch }) => {
    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const res = await fetch(`${API_BASE}/incidents/${id}/create-assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ supplies }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create assignment');
    }

    const assignment = await res.json();
    dispatch(fetchAssignments());
    return assignment;
  }
);

const slice = createSlice({
  name: 'assignments',
  initialState: { assignments: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAssignments.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchAssignments.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.assignments = payload;
      })
      .addCase(fetchAssignments.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      .addCase(updateAssignmentStatus.pending, state => { state.loading = true; })
      .addCase(updateAssignmentStatus.fulfilled, state => { state.loading = false; })
      .addCase(updateAssignmentStatus.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      .addCase(createAssignmentFromIncident.pending, state => { state.loading = true; })
      .addCase(createAssignmentFromIncident.fulfilled, state => { state.loading = false; })
      .addCase(createAssignmentFromIncident.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      .addCase(deleteAssignment.pending, state => { state.loading = true; })
      .addCase(deleteAssignment.fulfilled, state => { state.loading = false; })
      .addCase(deleteAssignment.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      });
  }
});

export default slice.reducer;
