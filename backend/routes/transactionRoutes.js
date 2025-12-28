const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createBorrow,
  returnBook,
  getOverdueBooks,
  getTransactionDetail,
  getUserTransactions,
  calculateFine,
  extendDueDate
} = require('../controllers/transactionController');
const { authenticate, authorizeLibrarian, authorizeAnyUser } = require('../middleware/auth');

// GET /api/transactions - Lấy tất cả giao dịch (Admin và Thủ thư)
router.get('/', authenticate, authorizeLibrarian, getAllTransactions);

// ✅ THÊM ENDPOINT MỚI: Lấy giao dịch của user hiện tại
router.get('/user/current', authenticate, authorizeAnyUser, getUserTransactions);

// GET /api/transactions/user/my-transactions - Lấy giao dịch của user hiện tại (Độc giả)
router.get('/user/my-transactions', authenticate, authorizeAnyUser, getUserTransactions);

// GET /api/transactions/overdue - Lấy sách quá hạn (Admin và Thủ thư)
router.get('/overdue', authenticate, authorizeLibrarian, getOverdueBooks);

// GET /api/transactions/:id - Lấy chi tiết giao dịch (Admin, Thủ thư và user liên quan)
router.get('/:id', authenticate, getTransactionDetail);

// GET /api/transactions/:id/calculate-fine - Tính phạt cho giao dịch (Admin, Thủ thư)
router.get('/:id/calculate-fine', authenticate, authorizeLibrarian, calculateFine);

// POST /api/transactions/borrow - Mượn sách (CHO CẢ ĐỘC GIẢ)
router.post('/borrow', authenticate, authorizeAnyUser, createBorrow);

// PUT /api/transactions/return/:id - Trả sách (Admin, Thủ thư)
router.put('/return/:id', authenticate, authorizeLibrarian, returnBook);

// PUT /api/transactions/:id/extend - Gia hạn mượn sách (Admin, Thủ thư)
router.put('/:id/extend', authenticate, authorizeLibrarian, extendDueDate);

module.exports = router;