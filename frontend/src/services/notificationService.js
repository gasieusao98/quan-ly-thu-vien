import api from '../utils/api';

export const notificationService = {
  // Lấy tất cả thông báo
  getAll: (params) => api.get('/notifications', { params }),

  // Lấy sách sắp hạn
  getUpcomingDue: () => api.get('/notifications/upcoming-due'),

  // Lấy sách quá hạn
  getOverdue: () => api.get('/notifications/overdue-borrowings'),

  // Gửi thông báo cho 1 giao dịch
  sendNotification: (transactionId, notificationType = 'REMINDER') => 
    api.post('/notifications/send', {
      transactionId,
      notificationType
    }),

  // Gửi thông báo nhắc nhở hàng loạt
  sendBulkReminders: () => api.post('/notifications/send-bulk-reminders'),

  // Gửi thông báo quá hạn hàng loạt
  sendBulkOverdue: () => api.post('/notifications/send-bulk-overdue'),

  // Xóa thông báo
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default notificationService;