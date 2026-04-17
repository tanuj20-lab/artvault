import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
      state.loading = false;
    },
    markOneRead: (state, action) => {
      state.notifications = state.notifications.map(n =>
        n._id === action.payload ? { ...n, isRead: true } : n
      );
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    setLoading: (state, action) => { state.loading = action.payload; },
  },
});

export const { setNotifications, markOneRead, markAllRead, setLoading } = notificationSlice.actions;
export default notificationSlice.reducer;
