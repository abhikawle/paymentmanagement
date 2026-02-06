import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');

// Payment APIs
export const addPayment = (data) => API.post('/payments', data);
export const getUserPayments = () => API.get('/payments');
export const getPayment = (id) => API.get(`/payments/${id}`);
export const updatePayment = (id, data) => API.patch(`/payments/${id}`, data);
export const deletePayment = (id) => API.delete(`/payments/${id}`);

// Admin APIs
export const getAllPayments = () => API.get('/admin/payments/all');
export const searchPayments = (filters) => API.get('/admin/payments/search', { params: filters });

export default API;
