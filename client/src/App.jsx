import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import ArtworkDetails from './pages/ArtworkDetails';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import UploadArtwork from './pages/UploadArtwork';
import ArtistDashboard from './pages/ArtistDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />

          {/* Artist Only */}
          <Route path="/upload-artwork" element={
            <ProtectedRoute allowedRoles={['artist']}><UploadArtwork /></ProtectedRoute>
          } />
          <Route path="/artist-dashboard" element={
            <ProtectedRoute allowedRoles={['artist']}><ArtistDashboard /></ProtectedRoute>
          } />

          {/* Buyer Only */}
          <Route path="/buyer-dashboard" element={
            <ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>
          } />

          {/* Admin Only */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          {/* Any logged-in user */}
          <Route path="/notifications" element={
            <ProtectedRoute><Notifications /></ProtectedRoute>
          } />

          {/* Orders (redirect to buyer dashboard) */}
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['buyer']}><Navigate to="/buyer-dashboard" replace /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16161f',
              color: '#f0ece4',
              border: '1px solid rgba(212, 175, 55,0.2)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#0a0a0f' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
