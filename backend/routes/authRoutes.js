const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get('/me', authenticate, getMe);

// @route   POST /api/auth/logout
// @desc    Đăng xuất
// @access  Private
router.post('/logout', authenticate, logout);

module.exports = router;