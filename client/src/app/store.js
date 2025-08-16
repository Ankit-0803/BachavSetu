import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import suppliesReducer from '../features/supplies/suppliesSlice';
import authReducer from '../features/auth/authSlice';
import incidentsReducer from '../features/incidents/incidentsSlice';
import supplyRequestsReducer from '../features/supplyRequests/supplyRequestsSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    supplies: suppliesReducer,
    auth: authReducer,
    incidents: incidentsReducer,
    supplyRequests: supplyRequestsReducer,
  },
});
