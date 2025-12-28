const express = require('express');
const router = express.Router();
const {
    getLibrarians,
    getLibrarianById,
    createLibrarian,
    updateLibrarian,
    deleteLibrarian,
    changeLibrarianPassword
} = require('../controllers/librarianController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Tất cả routes đều yêu cầu xác thực và quyền admin
router.use(authenticate);
router.use(authorizeAdmin);

// Routes cho quản lý thủ thư
router.get('/', getLibrarians);
router.get('/:id', getLibrarianById);
router.post('/', createLibrarian);
router.put('/:id', updateLibrarian);
router.delete('/:id', deleteLibrarian);
router.put('/:id/password', changeLibrarianPassword);

module.exports = router;