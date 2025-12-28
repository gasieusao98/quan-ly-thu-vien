const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getPopularBooks,
  getActiveMembers  // 🆕 THÊM
} = require('../controllers/dashboardController');
const { authenticate, authorizeLibrarian, authorizeAnyUser } = require('../middleware/auth');

// ✅ SỬA: Tách riêng route cho admin/librarian và reader
router.get('/stats', authenticate, (req, res, next) => {
  // Nếu là admin hoặc librarian -> dùng authorizeLibrarian
  if (req.user.role === 'admin' || req.user.role === 'librarian') {
    return authorizeLibrarian(req, res, next);
  }
  // Nếu là reader -> dùng authorizeAnyUser (cho phép truy cập)
  return authorizeAnyUser(req, res, next);
}, getDashboardStats);

// GET /api/dashboard/popular-books - Sách mượn nhiều nhất (chỉ admin/librarian)
router.get('/popular-books', authenticate, authorizeLibrarian, getPopularBooks);

// 🆕 THÊM: GET /api/dashboard/active-members - Độc giả tích cực nhất (chỉ admin/librarian)
router.get('/active-members', authenticate, authorizeLibrarian, getActiveMembers);

module.exports = router;