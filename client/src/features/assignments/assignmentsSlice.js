import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentsAPI } from './assignmentsAPI';

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

// Fetch all assignments
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async () => {
    return await assignmentsAPI.getAllAssignments();
  }
);

// Update assignment status
export const updateAssignmentStatus = createAsyncThunk(
  'assignments/updateStatus',
  async ({ id, status }) => {
    return await assignmentsAPI.updateAssignment(id, { status });
  }
);

// Create assignment from incident
export const createAssignmentFromIncident = createAsyncThunk(
  'assignments/createFromIncident',
  async ({ id, supplies }) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/incidents/${id}/create-assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ supplies })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create assignment');
    }
    
    return await response.json();
  }
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addAssignment: (state, action) => {
      state.assignments.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update assignment status
      .addCase(updateAssignmentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(updateAssignmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create assignment from incident
      .addCase(createAssignmentFromIncident.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAssignmentFromIncident.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.assignment) {
          state.assignments.unshift(action.payload.assignment);
        }
      })
      .addCase(createAssignmentFromIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, addAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
