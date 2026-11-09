import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ccp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (err) =>
  err.response?.data?.error?.message ||
  err.response?.data?.message ||
  (err.request ? 'Cannot reach the server. Is the backend running?' : err.message);

export const loginRequest = (payload) => api.post('/api/auth/login', payload);
export const registerRequest = (payload) => api.post('/api/auth/register', payload);
export const fetchAssignments = () => api.get('/api/assignments');
export const createAssignment = (payload) => api.post('/api/assignments', payload);
export const submitAssignment = (id) => api.put(`/api/assignments/${id}/submit`);
export const deleteAssignment = (id) => api.delete(`/api/assignments/${id}`);
export const fetchUsers = () => api.get('/api/auth/users');

export default api;
