import api from '../utils/api';

export const reservationService = {
  create: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my-reservations'),
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  updateStatus: (id, data) => api.put(`/reservations/${id}/status`, data),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
};

export default reservationService;