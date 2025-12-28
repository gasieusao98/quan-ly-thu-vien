const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  // 🆕 SỬA: BỎ REQUIRED: TRUE
  bookSnapshot: {
    title: {
      type: String
      // 🚨 BỎ: required: true
    },
    author: {
      type: String
      // 🚨 BỎ: required: true
    },
    isbn: {
      type: String
    },
    bookCode: {
      type: String
    }
  },
  memberSnapshot: {
    name: {
      type: String
      // 🚨 BỎ: required: true
    },
    memberCode: {
      type: String
      // 🚨 BỎ: required: true
    },
    email: {
      type: String
    }
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  actualReturnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Đang mượn', 'Đã trả', 'Quá hạn'],
    default: 'Đang mượn'
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    maxlength: [200, 'Ghi chú không được quá 200 ký tự']
  }
}, {
  timestamps: true
});

// 🆕 GIỮ NGUYÊN MIDDLEWARE
TransactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Populate book và member để lấy thông tin
      await this.populate('bookId', 'title author isbn bookCode');
      await this.populate('memberId', 'name memberCode email');
      
      // Lưu snapshot (KHÔNG BẮT BUỘC)
      if (this.bookId) {
        this.bookSnapshot = {
          title: this.bookId.title,
          author: this.bookId.author,
          isbn: this.bookId.isbn,
          bookCode: this.bookId.bookCode
        };
      }
      
      if (this.memberId) {
        this.memberSnapshot = {
          name: this.memberId.name,
          memberCode: this.memberId.memberCode,
          email: this.memberId.email
        };
      }
      
      next();
    } catch (error) {
      console.error('Error saving transaction snapshots:', error);
      // 🆕 QUAN TRỌNG: VẪN CHO PHÉP LƯU DÙ LỖI SNAPSHOT
      next();
    }
  } else {
    next();
  }
});

// Static method để cập nhật trạng thái quá hạn
TransactionSchema.statics.updateOverdueTransactions = async function() {
  const now = new Date();
  return this.updateMany(
    { 
      dueDate: { $lt: now }, 
      status: 'Đang mượn' 
    },
    { 
      $set: { status: 'Quá hạn' } 
    }
  );
};

module.exports = mongoose.model('Transaction', TransactionSchema);