const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  // ✅ THÊM: Import uuid

const BookSchema = new mongoose.Schema({
  bookCode: {
    type: String,
    default: () => `SACH-${uuidv4().slice(0, 8).toUpperCase()}`,  // ✅ SỬA: Dùng UUID
    unique: true,
    trim: true,
    sparse: true
  },
  title: {
    type: String,
    required: [true, 'Tên sách là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên sách không được quá 200 ký tự']
  },
  author: {
    type: String,
    required: [true, 'Tác giả là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên tác giả không được quá 100 ký tự']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN là bắt buộc'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Thể loại là bắt buộc'],
    enum: ['Văn học', 'Khoa học', 'Lịch sử', 'Công nghệ', 'Kinh tế', 'Giáo dục', 'Khác']
  },
  publishedYear: {
    type: Number,
    required: [true, 'Năm xuất bản là bắt buộc'],
    min: [1000, 'Năm xuất bản không hợp lệ'],
    max: [new Date().getFullYear(), 'Năm xuất bản không được lớn hơn năm hiện tại']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Nhà xuất bản không được quá 100 ký tự']
  },
  totalCopies: {
    type: Number,
    default: 1,
    min: [1, 'Số lượng sách phải ít nhất là 1']
  },
  availableCopies: {
    type: Number,
    default: 1,
    min: [0, 'Số lượng sách có sẵn không được âm']
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Middleware để đảm bảo availableCopies không lớn hơn totalCopies
BookSchema.pre('save', function(next) {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

module.exports = mongoose.model('Book', BookSchema);