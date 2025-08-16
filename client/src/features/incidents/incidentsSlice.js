import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const initialState = {
  incidents: [],
  myIncidents: [],
  loading: false,
  error: null,
};

// Fetch all incidents (admin)
export const fetchIncidents = createAsyncThunk(
  'incidents/fetchAll',
  async () => {
    const response = await axios.get(`${API}/incidents`, { headers: authHeader() });
    return response.data;
  }
);

// Fetch my incidents (user)
export const fetchMyIncidents = createAsyncThunk(
  'incidents/fetchMy',
  async () => {
    const response = await axios.get(`${API}/incidents/my`, { headers: authHeader() });
    return response.data;
  }
);

// Create incident
export const createIncident = createAsyncThunk(
  'incidents/create',
  async (formData) => {
    const response = await axios.post(`${API}/incidents`, formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

// Update incident status
export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ id, status }) => {
    const response = await axios.patch(`${API}/incidents/${id}`, { status }, { headers: authHeader() });
    return response.data;
  }
);

// Create assignment from incident
export const createAssignmentFromIncident = createAsyncThunk(
  'incidents/createAssignment',
  async ({ id, supplies }) => {
    const response = await axios.post(`${API}/incidents/${id}/create-assignment`, { supplies }, { headers: authHeader() });
    return response.data;
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all incidents
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
      
      // Fetch my incidents
      .addCase(fetchMyIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.myIncidents = action.payload;
      })
      .addCase(fetchMyIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create incident
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.myIncidents.unshift(action.payload);
        state.incidents.unshift(action.payload);
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update incident status
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        
        // Update in incidents array
        const incidentIndex = state.incidents.findIndex(inc => inc._id === updated._id);
        if (incidentIndex !== -1) {
          state.incidents[incidentIndex] = updated;
        }
        
        // Update in myIncidents array
        const myIncidentIndex = state.myIncidents.findIndex(inc => inc._id === updated._id);
        if (myIncidentIndex !== -1) {
          state.myIncidents[myIncidentIndex] = updated;
        }
      })
      
      // Create assignment from incident
      .addCase(createAssignmentFromIncident.fulfilled, (state, action) => {
        const { incident } = action.payload;
        
        if (incident) {
          // Update in incidents array
          const incidentIndex = state.incidents.findIndex(inc => inc._id === incident._id);
          if (incidentIndex !== -1) {
            state.incidents[incidentIndex] = incident;
          }
          
          // Update in myIncidents array
          const myIncidentIndex = state.myIncidents.findIndex(inc => inc._id === incident._id);
          if (myIncidentIndex !== -1) {
            state.myIncidents[myIncidentIndex] = incident;
          }
        }
      });
  },
});

export const { clearError } = incidentsSlice.actions;
export default incidentsSlice.reducer;
