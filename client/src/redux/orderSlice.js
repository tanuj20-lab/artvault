import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], order: null, loading: false, error: null },
  reducers: {
    setOrders: (state, action) => { state.orders = action.payload; state.loading = false; },
    setOrder: (state, action) => { state.order = action.payload; state.loading = false; },
    updateOrder: (state, action) => {
      state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o);
      state.order = action.payload;
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
  },
});

export const { setOrders, setOrder, updateOrder, setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer;
