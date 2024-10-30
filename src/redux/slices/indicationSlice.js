// src/redux/slices/indicationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const indicationSlice = createSlice({
  name: 'indication',
  initialState: {
    dayStarted: false,
    startDate: null,
    startAmount: 10000,
    currentAmount: 0,
    sales: [],
    showSalesModal: false,
  },
  reducers: {
    toggleDay(state) {
      state.dayStarted = !state.dayStarted;
      if (!state.dayStarted) {
        state.startDate = null;
        state.startAmount += state.currentAmount;
        state.currentAmount = 0;
      } else {
        state.startDate = new Date().toLocaleString();
      }
    },
    updateAmounts(state, action) {
      state.currentAmount = action.payload.currentAmount;
      state.startAmount = action.payload.startAmount;
    },
    addItem(state, action) {
      state.sales.push(action.payload);
      state.currentAmount += action.payload.price;
    },
    removeItem(state, action) {
      const updatedSales = state.sales.filter((sale) => sale.id !== action.payload.id);
      state.sales = updatedSales;
      state.currentAmount -= action.payload.price;
    },
    showSalesModal(state, action) {
      state.showSalesModal = action.payload;
    },
  },
});

export const { toggleDay, updateAmounts, addItem, removeItem, showSalesModal } = indicationSlice.actions;
export default indicationSlice.reducer;
