import { createSlice } from '@reduxjs/toolkit';

const auctionSlice = createSlice({
  name: 'auctions',
  initialState: { auctions: [], auction: null, myAuctions: [], loading: false, error: null },
  reducers: {
    setAuctions: (state, action) => { state.auctions = action.payload; state.loading = false; },
    setAuction: (state, action) => { state.auction = action.payload; state.loading = false; },
    setMyAuctions: (state, action) => { state.myAuctions = action.payload; state.loading = false; },
    updateAuctionBid: (state, action) => {
      const { auctionId, bidAmount, bidder } = action.payload;
      if (state.auction && state.auction._id === auctionId) {
        state.auction.currentHighestBid = bidAmount;
        state.auction.highestBidderId = { name: bidder };
      }
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
  },
});

export const { setAuctions, setAuction, setMyAuctions, updateAuctionBid, setLoading, setError } = auctionSlice.actions;
export default auctionSlice.reducer;
