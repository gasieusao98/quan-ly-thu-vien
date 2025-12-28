const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservationDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'expired', 'fulfilled'],
    default: 'pending'
  },
  priority: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient queries
reservationSchema.index({ book: 1, status: 1 });
reservationSchema.index({ member: 1, status: 1 });
reservationSchema.index({ expiryDate: 1 });

// Method to check if reservation is active
reservationSchema.methods.isActive = function() {
  return this.status === 'pending' || this.status === 'approved';
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;