import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartpark_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('smartpark_token');
      localStorage.removeItem('smartpark_user');
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Parking
export const getParkingAreas = (params) => API.get('/parking', { params });
export const getParkingArea = (id) => API.get(`/parking/${id}`);
export const getSlots = (id) => API.get(`/parking/${id}/slots`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminBookings = () => API.get('/admin/bookings');
export const createParkingArea = (data) => API.post('/admin/parking', data);
export const updateParkingArea = (id, data) => API.put(`/admin/parking/${id}`, data);
export const deleteParkingArea = (id) => API.delete(`/admin/parking/${id}`);

export default API;
