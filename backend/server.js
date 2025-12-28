const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ========== CORS CONFIGURATION FOR PRODUCTION ==========
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://library-frontend-sv.onrender.com' // Production frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// =======================================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Phục vụ thư mục uploads dưới dạng static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/librarians', require('./routes/librarianRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 🆕 THÊM: Excel Routes
app.use('/api/excel', require('./routes/excelRoutes'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hệ thống Quản lý Thư viện API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books',
            members: '/api/members',
            transactions: '/api/transactions',
            dashboard: '/api/dashboard',
            reservations: '/api/reservations',
            librarians: '/api/librarians',
            notifications: '/api/notifications',
            excel: '/api/excel',
            uploads: '/uploads'
        }
    });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('\n❌ ===== SERVER ERROR =====');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('===========================\n');
    
    res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra trên server',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} không tồn tại`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`📧 Notifications: http://localhost:${PORT}/api/notifications`);
  console.log(`📊 Excel: http://localhost:${PORT}/api/excel`);
});

// Xử lý lỗi không được bắt
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});