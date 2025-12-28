const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực token
const authenticate = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không có token, truy cập bị từ chối'
            });
        }

        // ✅ FIX: Xác thực token - nếu token hết hạn, jwt.verify sẽ throw error
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (jwtError) {
            console.log('❌ Token verification failed:', jwtError.message);
            return res.status(401).json({
                success: false,
                message: 'Token hết hạn hoặc không hợp lệ'
            });
        }

        // Lấy đầy đủ thông tin user từ DB
        const user = await User.findById(decoded.userId).select('-password'); 
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        // ✅ FIX: Kiểm tra account bị khóa
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản của bạn đã bị khóa'
            });
        }

        // Gắn thông tin user vào request
        req.user = {
            userId: decoded.userId || user._id,
            username: user.username,
            email: user.email,
            role: decoded.role || user.role,
            fullName: user.fullName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            _id: user._id,
            isActive: user.isActive
        };
        
        console.log('✅ User authenticated:', req.user.username);
        next();

    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
};

// Middleware phân quyền Admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Yêu cầu quyền Quản trị viên'
        });
    }
    next();
};

// Middleware phân quyền Librarian
const authorizeLibrarian = (req, res, next) => {
    if (!['admin', 'librarian'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Yêu cầu quyền Thủ thư hoặc Quản trị viên'
        });
    }
    next();
};

// Middleware phân quyền Reader
const authorizeReader = (req, res, next) => {
    if (!['admin', 'librarian', 'reader'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Không có quyền truy cập'
        });
    }
    next();
};

// Middleware yêu cầu đăng nhập
const authorizeAnyUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Yêu cầu đăng nhập'
        });
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin,
    authorizeLibrarian,
    authorizeReader,
    authorizeAnyUser
};