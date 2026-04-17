import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    // Only force-logout on 401 for protected routes, NOT for the login/register endpoints
    // themselves — otherwise the error toast gets swallowed by the redirect.
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Artworks
export const getArtworks = (params) => API.get('/artworks', { params });
export const getArtworkById = (id) => API.get(`/artworks/${id}`);
export const getMyArtworks = () => API.get('/artworks/my');
export const createArtwork = (formData) => API.post('/artworks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateArtwork = (id, data) => API.put(`/artworks/${id}`, data);
export const deleteArtwork = (id) => API.delete(`/artworks/${id}`);

// Auctions
export const getAuctions = (params) => API.get('/auctions', { params });
export const getAuctionById = (id) => API.get(`/auctions/${id}`);
export const getMyAuctions = () => API.get('/auctions/my');
export const createAuction = (data) => API.post('/auctions', data);
export const endAuction = (id) => API.put(`/auctions/${id}/end`);

// Bids
export const placeBid = (data) => API.post('/bids', data);
export const getBidsByAuction = (auctionId) => API.get(`/bids/auction/${auctionId}`);
export const getMyBids = () => API.get('/bids/my');

// Orders
export const getMyOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const payOrder = (id) => API.put(`/orders/${id}/pay`);
export const updateDelivery = (id, data) => API.put(`/orders/${id}/ship`, data);
export const getAllOrders = () => API.get('/orders');

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllRead = () => API.put('/notifications/read-all');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminArtworks = () => API.get('/admin/artworks');
