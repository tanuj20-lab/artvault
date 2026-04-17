import { createSlice } from '@reduxjs/toolkit';

const artworkSlice = createSlice({
  name: 'artworks',
  initialState: { artworks: [], artwork: null, myArtworks: [], loading: false, error: null },
  reducers: {
    setArtworks: (state, action) => { state.artworks = action.payload; state.loading = false; },
    setArtwork: (state, action) => { state.artwork = action.payload; state.loading = false; },
    setMyArtworks: (state, action) => { state.myArtworks = action.payload; state.loading = false; },
    addArtwork: (state, action) => { state.myArtworks.unshift(action.payload); },
    removeArtwork: (state, action) => { state.myArtworks = state.myArtworks.filter(a => a._id !== action.payload); },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
  },
});

export const { setArtworks, setArtwork, setMyArtworks, addArtwork, removeArtwork, setLoading, setError } = artworkSlice.actions;
export default artworkSlice.reducer;
