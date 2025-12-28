import api from '../utils/api';

export const librarianService = {
  getAll: (params) => api.get('/librarians', { params }),
  getById: (id) => api.get(`/librarians/${id}`),
  create: (data) => api.post('/librarians', data),
  update: (id, data) => api.put(`/librarians/${id}`, data),
  delete: (id) => api.delete(`/librarians/${id}`),
  changePassword: (id, data) => api.put(`/librarians/${id}/password`, data)
};

export default librarianService;