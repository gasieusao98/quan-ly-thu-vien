const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getUpcomingDueBorrowings,
  getOverdueBorrowings,
  sendNotificationForTransaction,
  sendBulkReminders,
  sendBulkOverdueNotifications,
  deleteNotification
} = require('../controllers/notificationController');
const { authenticate, authorizeLibrarian } = require('../middleware/auth');

// GET /api/notifications - Lấy tất cả thông báo (Admin/Thủ thư)
router.get('/', authenticate, authorizeLibrarian, getAllNotifications);

// GET /api/notifications/upcoming-due - Lấy sách sắp hạn (Admin/Thủ thư)
router.get('/upcoming-due', authenticate, authorizeLibrarian, getUpcomingDueBorrowings);

// GET /api/notifications/overdue-borrowings - Lấy sách quá hạn (Admin/Thủ thư)
router.get('/overdue-borrowings', authenticate, authorizeLibrarian, getOverdueBorrowings);

// POST /api/notifications/send - Gửi thông báo cho 1 giao dịch (Admin/Thủ thư)
router.post('/send', authenticate, authorizeLibrarian, sendNotificationForTransaction);

// POST /api/notifications/send-bulk-reminders - Gửi nhắc nhở hàng loạt (Admin/Thủ thư)
router.post('/send-bulk-reminders', authenticate, authorizeLibrarian, sendBulkReminders);

// POST /api/notifications/send-bulk-overdue - Gửi cảnh báo quá hạn hàng loạt (Admin/Thủ thư)
router.post('/send-bulk-overdue', authenticate, authorizeLibrarian, sendBulkOverdueNotifications);

// DELETE /api/notifications/:id - Xóa thông báo (Admin/Thủ thư)
router.delete('/:id', authenticate, authorizeLibrarian, deleteNotification);

module.exports = router;