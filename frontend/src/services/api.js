import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books APIs
export const fetchBooks = async (search = '', section = '') => {
  const params = new URLSearchParams();
  if (search && search.trim()) params.append('search', search.trim());
  if (section && section.trim() && section !== 'ALL') params.append('section', section.trim());
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get(`/books${query}`);
  return response.data;
};

export const fetchSections = async () => {
  const response = await api.get('/books/sections');
  return response.data;
};

export const fetchBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
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
