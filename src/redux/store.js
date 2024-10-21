// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import indicationReducer from './slices/indicationSlice';
import globalReducer from './slices/globalStateSlice';
import notificationReducer from './slices/notificationSlice';

// Create and configure the store
const store = configureStore({
  reducer: {
    indication: indicationReducer,
    global: globalReducer,
    notification: notificationReducer,
    // Add other slices here if needed
  },
});

export default store;
