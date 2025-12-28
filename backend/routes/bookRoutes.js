const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookStats
} = require('../controllers/bookController');

const { authenticate, authorizeLibrarian, authorizeAdmin, authorizeReader } = require('../middleware/auth');

// ✅ THÊM: Cấu hình Multer
const uploadDir = path.join(__dirname, '../uploads/books');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads/books directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ✅ Tên file: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // ✅ Chỉ chấp nhận ảnh
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Routes
// GET /api/books - Lấy tất cả sách
router.get('/', authenticate, authorizeReader, getAllBooks);

// GET /api/books/stats - Thống kê sách
router.get('/stats', authenticate, authorizeLibrarian, getBookStats);

// GET /api/books/:id - Lấy sách theo ID
router.get('/:id', authenticate, authorizeReader, getBookById);

// ✅ SỬA: POST /api/books - Thêm sách mới + upload ảnh
router.post('/', authenticate, authorizeLibrarian, upload.single('image'), createBook);

// ✅ SỬA: PUT /api/books/:id - Cập nhật sách + upload ảnh (nếu có)
router.put('/:id', authenticate, authorizeLibrarian, upload.single('image'), updateBook);

// DELETE /api/books/:id - Xóa sách
router.delete('/:id', authenticate, authorizeAdmin, deleteBook);

module.exports = router;