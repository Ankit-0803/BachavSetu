import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import suppliesReducer from '../features/supplies/suppliesSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    supplies: suppliesReducer,
    auth: authReducer,
  },
});
