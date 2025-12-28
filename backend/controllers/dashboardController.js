const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Lấy thống kê tổng quan
// @route   GET /api/dashboard/stats
// @access  Private (Admin, Thủ thư, Reader)
exports.getDashboardStats = async (req, res) => {
    try {
        // ✅ THÊM: Xử lý khác nhau theo role
        if (req.user.role === 'reader') {
            // Tìm member tương ứng với user đang đăng nhập
            const member = await Member.findOne({ userId: req.user.userId });
            
            if (!member) {
                return res.json({
                    success: true,
                    data: {
                        books: {
                            total: 0,
                            available: 0,
                            borrowed: 0
                        },
                        members: 0,
                        transactions: 0,
                        users: 0,
                        overdue: 0,
                        // ✅ THÊM: Thống kê cá nhân cho reader
                        userStats: {
                            currentBorrows: 0,
                            totalBorrows: 0,
                            overdueBooks: 0
                        }
                    }
                });
            }

            // ✅ SỬA: TÍNH TOÁN THỐNG KÊ THỰC TẾ CHO READER - FIX AGGREGATION
            const [
                totalBooks,
                availableBooksResult,
                currentBorrows,
                totalBorrows,
                overdueBooks
            ] = await Promise.all([
                // Tổng số sách trong thư viện
                Book.countDocuments(),
                // ✅ SỬA: Tính tổng availableCopies bằng cách khác
                Book.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAvailable: { $sum: "$availableCopies" }
                        }
                    }
                ]),
                // Số sách đang mượn của user này
                Transaction.countDocuments({ 
                    memberId: member._id, 
                    status: { $in: ['Đang mượn', 'Quá hạn'] } 
                }),
                // Tổng số lượt mượn đã thực hiện
                Transaction.countDocuments({ memberId: member._id }),
                // Số sách quá hạn của user này
                Transaction.countDocuments({ 
                    memberId: member._id, 
                    status: 'Quá hạn' 
                })
            ]);

            // ✅ SỬA: Lấy giá trị availableBooks đúng cách
            const availableBooks = availableBooksResult.length > 0 ? availableBooksResult[0].totalAvailable : 0;

            // ✅ DEBUG: Log để kiểm tra
            console.log('📊 Reader Stats Debug:', {
                totalBooks,
                availableBooksResult,
                availableBooks,
                currentBorrows,
                totalBorrows,
                overdueBooks
            });

            res.json({
                success: true,
                data: {
                    books: {
                        total: totalBooks,
                        available: availableBooks, // ✅ Dùng biến đã tính
                        borrowed: 0 // Reader không cần biết số sách đang mượn tổng
                    },
                    members: 0,
                    transactions: 0,
                    users: 0,
                    overdue: 0,
                    // ✅ QUAN TRỌNG: Thêm thống kê cá nhân
                    userStats: {
                        currentBorrows: currentBorrows,
                        totalBorrows: totalBorrows,
                        overdueBooks: overdueBooks,
                        availableBooks: availableBooks // ✅ Thêm vào userStats
                    }
                }
            });
        } else {
            // 🆕 SỬA HOÀN TOÀN: Stats cho admin/librarian - SỬA LOGIC TÍNH BORROWED BOOKS
            const [
                totalBooks,
                totalMembers,
                totalTransactions,
                totalUsers,
                availableBooksResult,
                borrowedBooks, // 🆕 SỬA: Đếm transaction thay vì tính toán
                overdueBooks
            ] = await Promise.all([
                Book.countDocuments(),
                Member.countDocuments(),
                Transaction.countDocuments(),
                User.countDocuments(),
                // Tính sách có sẵn
                Book.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAvailable: { $sum: "$availableCopies" }
                        }
                    }
                ]),
                // 🆕 SỬA QUAN TRỌNG: Đếm số transaction đang mượn thay vì tính toán
                Transaction.countDocuments({ 
                    status: { $in: ['Đang mượn', 'Quá hạn'] } 
                }),
                Transaction.countDocuments({ status: 'Quá hạn' })
            ]);

            // ✅ SỬA: Lấy giá trị đúng cách
            const availableBooks = availableBooksResult.length > 0 ? availableBooksResult[0].totalAvailable : 0;

            // 🆕 DEBUG: Log để kiểm tra dữ liệu thực tế
            console.log('📊 Admin Stats Debug:', {
                totalBooks,
                availableBooks,
                borrowedBooks, // 🆕 Số transaction đang mượn thực tế
                totalMembers,
                totalTransactions,
                totalUsers,
                overdueBooks
            });

            res.json({
                success: true,
                data: {
                    books: {
                        total: totalBooks,
                        available: availableBooks, // ✅ Dùng biến đã tính
                        borrowed: borrowedBooks // 🆕 SỬA: Dùng số transaction đang mượn thực tế
                    },
                    members: totalMembers,
                    transactions: totalTransactions,
                    users: totalUsers,
                    overdue: overdueBooks
                }
            });
        }
    } catch (error) {
        console.error('❌ Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê',
            error: error.message
        });
    }
};

// @desc    Lấy sách mượn nhiều nhất
// @route   GET /api/dashboard/popular-books
// @access  Private (Admin, Thủ thư)
exports.getPopularBooks = async (req, res) => {
    try {
        const popularBooks = await Transaction.aggregate([
            { $group: { _id: '$bookId', borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            { $unwind: '$book' },
            {
                $project: {
                    _id: '$book._id',
                    title: '$book.title',
                    author: '$book.author',
                    borrowCount: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: popularBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sách phổ biến',
            error: error.message
        });
    }
};

// 🆕 THÊM: Lấy độc giả tích cực nhất
// @desc    Lấy độc giả tích cực nhất (mượn sách nhiều nhất)
// @route   GET /api/dashboard/active-members
// @access  Private (Admin, Thủ thư)
exports.getActiveMembers = async (req, res) => {
    try {
        const activeMembers = await Transaction.aggregate([
            { $group: { _id: '$memberId', borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            { $unwind: '$member' },
            {
                $project: {
                    _id: '$member._id',
                    name: '$member.name',
                    email: '$member.email',
                    memberCode: '$member.memberCode',
                    membershipType: '$member.membershipType',
                    borrowCount: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: activeMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy độc giả tích cực',
            error: error.message
        });
    }
};