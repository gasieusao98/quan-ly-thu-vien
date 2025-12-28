const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const MemberSchema = new mongoose.Schema({
  memberCode: {
    type: String,
    default: () => `TV-${uuidv4().slice(0, 8).toUpperCase()}`,
    unique: true,
    trim: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Họ tên không được quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Địa chỉ không được quá 200 ký tự']
  },
  dateOfBirth: {
    type: Date
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  membershipType: {
    type: String,
    enum: ['Sinh viên', 'Giảng viên', 'Cán bộ', 'Khách'],
    default: 'Sinh viên'
  },
  status: {
    type: String,
    enum: ['Đang hoạt động', 'Tạm khóa', 'Khóa'],
    default: 'Đang hoạt động'
  },
  // ✅ SỬA: Thêm sparse: true để cho phép xóa rồi tạo lại
  username: {
    type: String,
    required: [true, 'Tên đăng nhập là bắt buộc'],
    unique: true,
    sparse: true,  // ← THÊM: Cho phép null/undefined khi xóa
    trim: true,
    minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự'],
    maxlength: [50, 'Tên đăng nhập không được quá 50 ký tự'],
    match: [/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới']
  },
  // LIÊN KẾT VỚI USER (chứa password thực tế)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// ✅ THÊM: Drop index cũ khi schema được load (nếu tồn tại)
MemberSchema.pre('init', function() {
  // Xóa index unique cũ nếu tồn tại
  this.collection.dropIndex('username_1').catch(() => {
    // Index không tồn tại, không sao
  });
});

module.exports = mongoose.model('Member', MemberSchema);