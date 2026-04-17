import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import artworkReducer from './artworkSlice';
import auctionReducer from './auctionSlice';
import bidReducer from './bidSlice';
import orderReducer from './orderSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    artworks: artworkReducer,
    auctions: auctionReducer,
    bids: bidReducer,
    orders: orderReducer,
    notifications: notificationReducer,
  },
});

export default store;
