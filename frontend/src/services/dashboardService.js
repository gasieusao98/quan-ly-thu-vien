import api from '../utils/api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getPopularBooks: () => api.get('/dashboard/popular-books')
};

export default dashboardService;