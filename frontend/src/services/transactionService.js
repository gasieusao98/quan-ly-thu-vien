import api from '../utils/api';

export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  getUserTransactions: () => api.get('/transactions/user/my-transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  borrow: (data) => api.post('/transactions/borrow', data),
  return: (id) => api.put(`/transactions/return/${id}`),
  extend: (id, data) => api.put(`/transactions/${id}/extend`, data),
  calculateFine: (id) => api.get(`/transactions/${id}/calculate-fine`),
  getOverdue: () => api.get('/transactions/overdue')
};

export default transactionService;