const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Member = require('../models/Member');

// @desc    Tạo reservation mới
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { bookId, notes } = req.body;
    const userId = req.user.userId;

    // Kiểm tra sách tồn tại
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Sách không tồn tại'
      });
    }

    // Kiểm tra sách có sẵn để mượn không
    if (book.availableCopies > 0) {
      return res.status(400).json({
        success: false,
        message: 'Sách hiện có sẵn, vui lòng mượn trực tiếp'
      });
    }

    // Kiểm tra member
    const member = await Member.findOne({ userId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin độc giả không tồn tại'
      });
    }

    // Kiểm tra user đã đặt trước sách này chưa
    const existingReservation = await Reservation.findOne({
      book: bookId,
      user: userId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đặt trước sách này rồi'
      });
    }

    // Tính expiry date (7 ngày từ now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Lấy số lượng reservation đang active cho sách này
    const activeReservationsCount = await Reservation.countDocuments({
      book: bookId,
      status: { $in: ['pending', 'approved'] },
      expiryDate: { $gt: new Date() }
    });
    
    const priority = activeReservationsCount + 1;

    const reservation = await Reservation.create({
      book: bookId,
      member: member._id,
      user: userId,
      expiryDate,
      priority,
      notes
    });

    // Populate thông tin
    await reservation.populate('book', 'title author isbn bookCode');
    await reservation.populate('member', 'name memberCode email phone');  // ✅ THÊM: email phone

    res.status(201).json({
      success: true,
      message: 'Đặt trước sách thành công',
      data: reservation
    });

  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Lấy danh sách reservations của user
// @route   GET /api/reservations/my-reservations
// @access  Private
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const member = await Member.findOne({ userId });
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Thông tin độc giả không tồn tại'
      });
    }

    const reservations = await Reservation.find({ member: member._id })
      .populate('book', 'title author isbn bookCode coverImage')
      .populate('member', 'name memberCode email phone')  // ✅ THÊM: populate member
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reservations
    });

  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Lấy tất cả reservations (Admin/Librarian)
// @route   GET /api/reservations
// @access  Private (Admin/Librarian)
const getAllReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate('book', 'title author isbn bookCode')
      .populate('member', 'name memberCode email')
      .populate('user', 'username email')
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: reservations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cập nhật status reservation
// @route   PUT /api/reservations/:id/status
// @access  Private (Admin/Librarian)
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id)
      .populate('book', 'title author isbn bookCode')
      .populate('member', 'name memberCode email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation không tồn tại'
      });
    }

    reservation.status = status;
    await reservation.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: reservation
    });

  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Hủy reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation không tồn tại'
      });
    }

    // Kiểm tra user có quyền hủy reservation này không
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền hủy reservation này'
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Reservation đã được hủy trước đó'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Hủy đặt trước thành công'
    });

  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Lấy reservation by ID
// @route   GET /api/reservations/:id
// @access  Private
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('book', 'title author isbn bookCode availableCopies')  // ✅ THÊM: bookCode
      .populate('member', 'name memberCode email phone')
      .populate('user', 'username email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation không tồn tại'
      });
    }

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Get reservation by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
  getReservationById
};