const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');

// Tạo JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            role: user.role
        }, 
        process.env.JWT_SECRET || 'your-secret-key', 
        {
            expiresIn: '7d'
        }
    );
};

// Hàm tạo Member từ User
// ✅ FIX: THÊM parameter membershipType
const createMemberFromUser = async (user, address, membershipType) => {
    try {
        const member = new Member({
            name: user.fullName,
            email: user.email,
            phone: user.phone || '',
            address: address || '',
            dateOfBirth: user.dateOfBirth || null,
            username: user.username,
            membershipType: membershipType || 'Sinh viên',  // ✅ FIX: Lấy từ parameter, nếu không có thì mặc định là Sinh viên
            status: 'Đang hoạt động',
            userId: user._id
        });
        
        await member.save();
        console.log('✅ Member created successfully for user:', user.email, 'Type:', membershipType);
        return member;
    } catch (error) {
        console.error('❌ Error creating member:', error);
        throw error;
    }
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        // ✅ FIX: THÊM membershipType vào destructuring
        const { username, email, password, fullName, phone, dateOfBirth, address, membershipType } = req.body;
        const role = 'reader';
        
        // ✅ VALIDATE: Kiểm tra các field bắt buộc
        if (!username || !email || !password || !fullName || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }
        
        // ✅ VALIDATE: Kiểm tra membershipType hợp lệ
        const validMembershipTypes = ['Sinh viên', 'Giảng viên', 'Cán bộ', 'Khách'];
        if (membershipType && !validMembershipTypes.includes(membershipType)) {
            return res.status(400).json({
                success: false,
                message: 'Loại thành viên không hợp lệ'
            });
        }
        
        // ✅ VALIDATE: Kiểm tra username/email đã tồn tại
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username hoặc email đã tồn tại'
            });
        }
        
        // Tạo user mới
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            role,
            phone,
            dateOfBirth
        });
        
        // Tạo member record cho reader
        try {
            // ✅ FIX: Truyền membershipType khi tạo member
            await createMemberFromUser(user, address, membershipType);
        } catch (memberError) {
            console.error('Failed to create member, but user was created:', memberError);
        }
        
        const token = generateToken(user);
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    phone: user.phone
                }
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ username và password'
            });
        }
        
        const user = await User.findOne({
            $or: [{ username }, { email: username }],
            isActive: true
        }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin đăng nhập không chính xác'
            });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin đăng nhập không chính xác'
            });
        }
        
        // TỰ ĐỘNG TẠO MEMBER NẾU LÀ READER VÀ CHƯA CÓ MEMBER
        if (user.role === 'reader') {
            try {
                const existingMember = await Member.findOne({ userId: user._id }); 
                if (!existingMember) {
                    // ✅ FIX: Khi auto-create, cũng truyền membershipType (mặc định Sinh viên)
                    await createMemberFromUser(user, '', 'Sinh viên');
                    console.log('✅ Auto-created member for existing reader:', user.email);
                }
            } catch (memberError) {
                console.error('Failed to auto-create member:', memberError);
            }
        }
        
        const token = generateToken(user);
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    phone: user.phone
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); 
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Người dùng không tồn tại' 
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    });
};

module.exports = {
    register,
    login,
    getMe,
    logout
};