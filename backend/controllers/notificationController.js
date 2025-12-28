const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');
const { sendReminderEmail, sendOverdueEmail } = require('../services/emailService');

// Lấy tất cả thông báo (Admin/Thủ thư)
exports.getAllNotifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const notifications = await Notification.find(query)
      .populate('transactionId')
      .populate('memberId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Lấy sách sắp hạn (daysLeft <= 3)
exports.getUpcomingDueBorrowings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const upcomingBorrowings = await Transaction.find({
      status: 'Đang mượn',
      dueDate: {
        $gte: today,
        $lte: threeDaysLater
      }
    })
      .populate('bookId', 'title author')
      .populate('memberId', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: upcomingBorrowings,
      count: upcomingBorrowings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sách sắp hạn',
      error: error.message
    });
  }
};

// Lấy sách quá hạn
exports.getOverdueBorrowings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTransactions = await Transaction.find({
      status: { $in: ['Đang mượn', 'Quá hạn'] },
      dueDate: { $lt: today }
    })
      .populate('bookId', 'title author')
      .populate('memberId', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: overdueTransactions,
      count: overdueTransactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sách quá hạn',
      error: error.message
    });
  }
};

// Gửi thông báo cho một giao dịch cụ thể
exports.sendNotificationForTransaction = async (req, res) => {
  try {
    const { transactionId, notificationType = 'REMINDER' } = req.body;

    const transaction = await Transaction.findById(transactionId)
      .populate('bookId', 'title')
      .populate('memberId', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch'
      });
    }

    const memberEmail = transaction.memberSnapshot?.email || transaction.memberId?.email;
    const memberName = transaction.memberSnapshot?.name || transaction.memberId?.name;
    const bookTitle = transaction.bookSnapshot?.title || transaction.bookId?.title;
    const dueDate = transaction.dueDate;

    if (!memberEmail) {
      return res.status(400).json({
        success: false,
        message: 'Thành viên không có email'
      });
    }

    // Tính toán ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    let emailSent = false;
    let notification;

    if (notificationType === 'OVERDUE') {
      const daysOverdue = Math.abs(daysUntilDue);
      const fine = daysOverdue * 5000;
      emailSent = await sendOverdueEmail(memberEmail, memberName, bookTitle, dueDate, daysOverdue, fine);
      
      notification = new Notification({
        transactionId,
        memberId: transaction.memberId,
        bookTitle,
        email: memberEmail,
        dueDate,
        notificationType: 'OVERDUE',
        daysOverdue
      });
    } else {
      emailSent = await sendReminderEmail(memberEmail, memberName, bookTitle, dueDate, Math.max(0, daysUntilDue));
      
      notification = new Notification({
        transactionId,
        memberId: transaction.memberId,
        bookTitle,
        email: memberEmail,
        dueDate,
        notificationType: 'REMINDER',
        daysUntilDue: Math.max(0, daysUntilDue)
      });
    }

    if (emailSent) {
      notification.status = 'SENT';
      notification.sentAt = new Date();
    } else {
      notification.status = 'FAILED';
      notification.failureReason = 'Email service error';
    }

    await notification.save();

    res.json({
      success: true,
      message: 'Gửi thông báo thành công',
      data: notification
    });
  } catch (error) {
    console.error('❌ Error in sendNotificationForTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi thông báo',
      error: error.message
    });
  }
};

// Gửi thông báo hàng loạt (cho tất cả sách sắp hạn)
exports.sendBulkReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const upcomingBorrowings = await Transaction.find({
      status: 'Đang mượn',
      dueDate: {
        $gte: today,
        $lte: threeDaysLater
      }
    })
      .populate('bookId', 'title')
      .populate('memberId', 'name email');

    let successCount = 0;
    let failedCount = 0;
    const notifications = [];

    for (const transaction of upcomingBorrowings) {
      try {
        const memberEmail = transaction.memberSnapshot?.email || transaction.memberId?.email;
        const memberName = transaction.memberSnapshot?.name || transaction.memberId?.name;
        const bookTitle = transaction.bookSnapshot?.title || transaction.bookId?.title;

        if (memberEmail) {
          const dueDate = transaction.dueDate;
          const due = new Date(dueDate);
          due.setHours(0, 0, 0, 0);
          const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

          await sendReminderEmail(memberEmail, memberName, bookTitle, dueDate, daysUntilDue);

          const notification = new Notification({
            transactionId: transaction._id,
            memberId: transaction.memberId,
            bookTitle,
            email: memberEmail,
            dueDate,
            notificationType: 'REMINDER',
            daysUntilDue,
            status: 'SENT',
            sentAt: new Date()
          });

          await notification.save();
          notifications.push(notification);
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error('❌ Error sending notification:', error);
        failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Gửi thành công ${successCount} thông báo, thất bại ${failedCount}`,
      data: {
        successCount,
        failedCount,
        totalSent: successCount,
        notifications
      }
    });
  } catch (error) {
    console.error('❌ Error in sendBulkReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi thông báo hàng loạt',
      error: error.message
    });
  }
};

// Gửi thông báo quá hạn hàng loạt
exports.sendBulkOverdueNotifications = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTransactions = await Transaction.find({
      status: { $in: ['Đang mượn', 'Quá hạn'] },
      dueDate: { $lt: today }
    })
      .populate('bookId', 'title')
      .populate('memberId', 'name email');

    let successCount = 0;
    let failedCount = 0;

    for (const transaction of overdueTransactions) {
      try {
        const memberEmail = transaction.memberSnapshot?.email || transaction.memberId?.email;
        const memberName = transaction.memberSnapshot?.name || transaction.memberId?.name;
        const bookTitle = transaction.bookSnapshot?.title || transaction.bookId?.title;
        const dueDate = transaction.dueDate;

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        const fine = daysOverdue * 5000;

        if (memberEmail) {
          await sendOverdueEmail(memberEmail, memberName, bookTitle, dueDate, daysOverdue, fine);

          const notification = new Notification({
            transactionId: transaction._id,
            memberId: transaction.memberId,
            bookTitle,
            email: memberEmail,
            dueDate,
            notificationType: 'OVERDUE',
            daysOverdue,
            status: 'SENT',
            sentAt: new Date()
          });

          await notification.save();
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error('❌ Error sending overdue notification:', error);
        failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Gửi thành công ${successCount} thông báo quá hạn, thất bại ${failedCount}`,
      data: {
        successCount,
        failedCount,
        totalSent: successCount
      }
    });
  } catch (error) {
    console.error('❌ Error in sendBulkOverdueNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi thông báo quá hạn hàng loạt',
      error: error.message
    });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.json({
      success: true,
      message: 'Xóa thông báo thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông báo',
      error: error.message
    });
  }
};