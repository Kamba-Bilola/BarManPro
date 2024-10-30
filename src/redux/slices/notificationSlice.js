import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: 'info', // 'success', 'error', etc.
  visible: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },
    clearNotification: (state) => {
      state.message = '';
      state.type = 'info';
      state.visible = false;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
