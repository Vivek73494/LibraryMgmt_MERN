import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books API
export const fetchBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

// Borrow APIs
export const fetchBorrowRecords = async () => {
  const response = await api.get('/borrow');
  return response.data;
};

export const issueBook = async (borrowData) => {
  const response = await api.post('/borrow', borrowData);
  return response.data;
};

export const returnBook = async (recordId) => {
  const response = await api.put(`/borrow/${recordId}/return`);
  return response.data;
};

// Dashboard API
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export default api;
