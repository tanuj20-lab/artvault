import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: userFromStorage, loading: false, error: null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
    clearError: (state) => { state.error = null; },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
