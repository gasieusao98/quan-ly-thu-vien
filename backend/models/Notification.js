const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  notificationType: {
    type: String,
    enum: ['REMINDER', 'OVERDUE', 'MANUAL'],
    default: 'REMINDER'
  },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'PENDING'
  },
  sentAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  daysUntilDue: {
    type: Number
  },
  daysOverdue: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);