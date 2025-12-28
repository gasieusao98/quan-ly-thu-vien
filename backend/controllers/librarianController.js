const User = require('../models/User');

// @desc    Lấy danh sách thủ thư
// @route   GET /api/librarians
// @access  Private/Admin
const getLibrarians = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        
        const query = {
            role: 'librarian',
            ...(search && {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } }
                ]
            })
        };

        const librarians = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: librarians,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get librarians error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách thủ thư'
        });
    }
};

// @desc    Lấy thông tin chi tiết thủ thư
// @route   GET /api/librarians/:id
// @access  Private/Admin
const getLibrarianById = async (req, res) => {
    try {
        const librarian = await User.findOne({
            _id: req.params.id,
            role: 'librarian'
        }).select('-password');

        if (!librarian) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thủ thư'
            });
        }

        res.json({
            success: true,
            data: librarian
        });
    } catch (error) {
        console.error('Get librarian by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin thủ thư'
        });
    }
};

// @desc    Tạo thủ thư mới
// @route   POST /api/librarians
// @access  Private/Admin
const createLibrarian = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            fullName,
            phone,
            dateOfBirth
        } = req.body;

        // Kiểm tra user đã tồn tại
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc username đã tồn tại'
            });
        }

        // Tạo thủ thư mới
        const librarian = new User({
            username,
            email,
            password: password || '123456', // Mật khẩu mặc định
            fullName,
            phone,
            dateOfBirth,
            role: 'librarian',
            isActive: true
        });

        await librarian.save();

        // Trả về thông tin không bao gồm password
        const librarianResponse = librarian.toJSON();

        res.status(201).json({
            success: true,
            message: 'Tạo thủ thư thành công',
            data: librarianResponse
        });
    } catch (error) {
        console.error('Create librarian error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo thủ thư'
        });
    }
};

// @desc    Cập nhật thông tin thủ thư
// @route   PUT /api/librarians/:id
// @access  Private/Admin
const updateLibrarian = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            dateOfBirth,
            password,
            isActive
        } = req.body;

        const librarian = await User.findOne({
            _id: req.params.id,
            role: 'librarian'
        });

        if (!librarian) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thủ thư'
            });
        }

        // ✅ FIX: Kiểm tra email đã tồn tại (nếu thay đổi)
        if (email && email !== librarian.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }
            librarian.email = email;
        }

        // Cập nhật thông tin
        if (fullName) librarian.fullName = fullName;
        if (phone) librarian.phone = phone;
        if (dateOfBirth) librarian.dateOfBirth = dateOfBirth;
        if (typeof isActive !== 'undefined') librarian.isActive = isActive;
        
        // ✅ FIX: Cập nhật mật khẩu nếu có
        if (password && password.length >= 6) {
            librarian.password = password;
            console.log('✅ Password updated for librarian:', librarian.email);
        }

        await librarian.save();

        res.json({
            success: true,
            message: 'Cập nhật thủ thư thành công',
            data: librarian.toJSON()
        });
    } catch (error) {
        console.error('Update librarian error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật thủ thư'
        });
    }
};

// @desc    Xóa thủ thư
// @route   DELETE /api/librarians/:id
// @access  Private/Admin
const deleteLibrarian = async (req, res) => {
    try {
        const librarian = await User.findOne({
            _id: req.params.id,
            role: 'librarian'
        });

        if (!librarian) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thủ thư'
            });
        }

        // Không cho xóa chính mình
        if (librarian._id.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa tài khoản của chính mình'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Xóa thủ thư thành công'
        });
    } catch (error) {
        console.error('Delete librarian error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa thủ thư'
        });
    }
};

// @desc    Đổi mật khẩu thủ thư
// @route   PUT /api/librarians/:id/password
// @access  Private/Admin
const changeLibrarianPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }

        const librarian = await User.findOne({
            _id: req.params.id,
            role: 'librarian'
        });

        if (!librarian) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thủ thư'
            });
        }

        librarian.password = newPassword;
        await librarian.save();

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Change librarian password error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi đổi mật khẩu'
        });
    }
};

module.exports = {
    getLibrarians,
    getLibrarianById,
    createLibrarian,
    updateLibrarian,
    deleteLibrarian,
    changeLibrarianPassword
};