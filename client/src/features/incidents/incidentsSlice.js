import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incidentsAPI } from './incidentsAPI';

const initialState = {
  incidents: [],
  myIncidents: [],
  loading: false,
  error: null,
};

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async () => {
    return await incidentsAPI.getAllIncidents();
  }
);

export const fetchMyIncidents = createAsyncThunk(
  'incidents/fetchMyIncidents',
  async () => {
    return await incidentsAPI.getMyIncidents();
  }
);

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incidentData) => {
    return await incidentsAPI.createIncident(incidentData);
  }
);

export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ id, status, assignmentCreated }) => {
    return await incidentsAPI.updateIncident(id, { status, assignmentCreated });
  }
);

export const createAssignmentFromIncident = createAsyncThunk(
  'incidents/createAssignment',
  async ({ id, supplies }) => {
    return await incidentsAPI.createAssignmentFromIncident(id, supplies);
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyIncidents.fulfilled, (state, action) => {
        state.myIncidents = action.payload;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.myIncidents.unshift(action.payload);
        if (state.incidents.length > 0) {
          state.incidents.unshift(action.payload);
        }
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.incidents.findIndex(i => i._id === updated._id);
        if (index !== -1) {
          state.incidents[index] = updated;
        }
      })
      .addCase(createAssignmentFromIncident.fulfilled, (state, action) => {
        const { incident } = action.payload;
        const index = state.incidents.findIndex(i => i._id === incident._id);
        if (index !== -1) {
          state.incidents[index] = incident;
        }
      });
  },
});

export const { clearError } = incidentsSlice.actions;
export default incidentsSlice.reducer;
