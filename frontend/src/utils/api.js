import axios from 'axios';

// Localhost cho browser, Docker sẽ proxy qua nginx
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // ✅ THAY: localStorage → sessionStorage (DEV)
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      console.log('📤 Request with FormData detected, removing Content-Type header');
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // ✅ THAY: localStorage → sessionStorage (DEV)
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🔐 AUTH API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// 📚 Book API
export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  getStats: () => api.get('/books/stats')
};

// 👥 Member API
export const memberAPI = {
  getAll: (params) => api.get('/members', { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`)
};

// 🔄 Transaction API
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getUserTransactions: () => api.get('/transactions/user/my-transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  borrow: (data) => api.post('/transactions/borrow', data),
  return: (id) => api.put(`/transactions/return/${id}`),
  extend: (id, data) => api.put(`/transactions/${id}/extend`, data),
  calculateFine: (id) => api.get(`/transactions/${id}/calculate-fine`),
  getOverdue: () => api.get('/transactions/overdue')
};

// 📊 Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getPopularBooks: () => api.get('/dashboard/popular-books')
};

// 🔄 Reservation API
export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my-reservations'),
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  updateStatus: (id, data) => api.put(`/reservations/${id}/status`, data),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
};

// 👨‍💼 LIBRARIAN API
export const librarianAPI = {
  getAll: (params) => api.get('/librarians', { params }),
  getById: (id) => api.get(`/librarians/${id}`),
  create: (data) => api.post('/librarians', data),
  update: (id, data) => api.put(`/librarians/${id}`, data),
  delete: (id) => api.delete(`/librarians/${id}`),
  changePassword: (id, data) => api.put(`/librarians/${id}/password`, data)
};

// 📊 Excel API
export const excelAPI = {
  exportBooks: () => api.get('/excel/books/export', { responseType: 'blob' }),
  importBooks: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/excel/books/import', formData);
  }
};

// 📧 Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default api;