// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import indicationReducer from './slices/indicationSlice';

// Create and configure the store
const store = configureStore({
  reducer: {
    indication: indicationReducer,
    // Add other slices here if needed
  },
});

export default store;
