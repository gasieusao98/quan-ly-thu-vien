const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { exportBooksToExcel, importBooksFromExcel } = require('../controllers/excelController');
const { authenticate, authorizeLibrarian } = require('../middleware/auth');

// Cấu hình multer để upload file Excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `excel_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép file Excel
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// GET /api/excel/export - Xuất danh sách sách ra Excel (Admin/Thủ thư)
router.get('/export', authenticate, authorizeLibrarian, exportBooksToExcel);

// POST /api/excel/import - Nhập dữ liệu sách từ Excel (Admin/Thủ thư)
router.post('/import', authenticate, authorizeLibrarian, upload.single('file'), importBooksFromExcel);

module.exports = router;