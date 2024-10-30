import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  confset: null,
  userState: null,
  mainRole: null,
  associated: null,
  subscStatus: null,
  preShift: null,
  dailyState: null,
  postShift: null,
  gap: null,
  shared: null,
  subscLevel: null,
  sync: null,
  notification: { message: '', type: '' },  // New notification state
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setConfset: (state, action) => {
      state.confset = action.payload;
    },
    setUserState: (state, action) => {
      state.userState = action.payload;
    },
    setMainRole: (state, action) => {
      state.mainRole = action.payload;
    },
    setAssociated: (state, action) => {
      state.associated = action.payload;
    },
    setSubscStatus: (state, action) => {
      state.subscStatus = action.payload;
    },
    setPreShift: (state, action) => {
      state.preShift = action.payload;
    },
    setDailyState: (state, action) => {
      state.dailyState = action.payload;
    },
    setPostShift: (state, action) => {
      state.postShift = action.payload;
    },
    setGap: (state, action) => {
      state.gap = action.payload;
    },
    setShared: (state, action) => {
      state.shared = action.payload;
    },
    setSubscLevel: (state, action) => {
      state.subscLevel = action.payload;
    },
    setSync: (state, action) => {
      state.sync = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

export const {
  setConfset, setUserState, setMainRole, setAssociated,
  setSubscStatus, setPreShift, setDailyState, setPostShift,
  setGap, setShared, setSubscLevel, setSync,setNotification,
} = globalSlice.actions;

export default globalSlice.reducer;