const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
  getReservationById
} = require('../controllers/reservationController');
const { authenticate, authorizeAdmin, authorizeLibrarian } = require('../middleware/auth');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Reader routes - tất cả user đã đăng nhập đều có thể đặt sách
router.post('/', createReservation);
router.get('/my-reservations', getMyReservations);
router.put('/:id/cancel', cancelReservation);
router.get('/:id', getReservationById);

// Admin/Librarian routes
router.get('/', authorizeLibrarian, getAllReservations);
router.put('/:id/status', authorizeLibrarian, updateReservationStatus);

module.exports = router;