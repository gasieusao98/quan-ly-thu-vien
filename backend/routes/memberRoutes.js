const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { authenticate, authorizeLibrarian, authorizeAdmin } = require('../middleware/auth');

// GET /api/members - Lấy tất cả thành viên (Admin và Thủ thư)
router.get('/', authenticate, authorizeLibrarian, getAllMembers);

// GET /api/members/:id - Lấy thành viên theo ID (Admin và Thủ thư)
router.get('/:id', authenticate, authorizeLibrarian, getMemberById);

// POST /api/members - Thêm thành viên mới (Admin và Thủ thư)
router.post('/', authenticate, authorizeLibrarian, createMember);

// PUT /api/members/:id - Cập nhật thành viên (Admin và Thủ thư)
router.put('/:id', authenticate, authorizeLibrarian, updateMember);

// DELETE /api/members/:id - Xóa thành viên (Chỉ Admin)
router.delete('/:id', authenticate, authorizeAdmin, deleteMember);

module.exports = router;