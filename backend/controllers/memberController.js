const Member = require('../models/Member');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Lấy tất cả thành viên
exports.getAllMembers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { memberCode: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    const members = await Member.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Member.countDocuments(filter);
    
    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách thành viên', 
      error: error.message 
    });
  }
};

// Lấy thành viên theo ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy thông tin thành viên', 
      error: error.message 
    });
  }
};

// Thêm thành viên mới VÀ tạo tài khoản đăng nhập
exports.createMember = async (req, res) => {
  try {
    const {
      name, email, phone, address, dateOfBirth, 
      membershipType, username, password
    } = req.body;

    // Kiểm tra email và username đã tồn tại trong User chưa
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email đã tồn tại' : 'Tên đăng nhập đã tồn tại' 
      });
    }

    // TẠO USER TRƯỚC (để đăng nhập)
    const user = new User({
      username,
      email,
      password,
      fullName: name,
      role: 'reader',
      phone,
      dateOfBirth
    });

    const savedUser = await user.save();

    // TẠO MEMBER SAU (liên kết với User)
    const member = new Member({
      name,
      email,
      phone,
      address,
      dateOfBirth,
      membershipType,
      username,
      status: 'Đang hoạt động',
      userId: savedUser._id
    });

    const savedMember = await member.save();

    res.status(201).json({
      message: 'Thêm thành viên và tạo tài khoản đăng nhập thành công',
      member: savedMember
    });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        message: field === 'email' ? 'Email đã tồn tại' : 'Tên đăng nhập đã tồn tại' 
      });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ 
        message: 'Lỗi khi thêm thành viên', 
        error: error.message 
      });
    }
  }
};

// Cập nhật thành viên
exports.updateMember = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    // Nếu có password mới, cập nhật trong User
    if (updateData.password && member.userId) {
      const user = await User.findById(member.userId);
      if (user) {
        user.password = updateData.password;
        await user.save();
      }
      delete updateData.password; // Xóa password khỏi updateData để không cập nhật trong Member
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Cập nhật thành viên thành công',
      member: updatedMember
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        message: field === 'email' ? 'Email đã tồn tại' : 'Tên đăng nhập đã tồn tại' 
      });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật thành viên', 
        error: error.message 
      });
    }
  }
};

// Xóa thành viên VÀ xóa tài khoản đăng nhập
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    // Xóa tài khoản User liên kết (nếu có)
    if (member.userId) {
      await User.findByIdAndDelete(member.userId);
    }

    // Xóa thành viên
    await Member.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Xóa thành viên và tài khoản thành công',
      deletedMember: member.memberCode
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi xóa thành viên', 
      error: error.message 
    });
  }
};