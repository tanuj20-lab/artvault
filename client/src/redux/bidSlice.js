import { createSlice } from '@reduxjs/toolkit';

const bidSlice = createSlice({
  name: 'bids',
  initialState: { bids: [], myBids: [], loading: false, error: null },
  reducers: {
    setBids: (state, action) => { state.bids = action.payload; state.loading = false; },
    setMyBids: (state, action) => { state.myBids = action.payload; state.loading = false; },
    addBid: (state, action) => { state.bids.unshift(action.payload); },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
  },
});

export const { setBids, setMyBids, addBid, setLoading, setError } = bidSlice.actions;
export default bidSlice.reducer;
