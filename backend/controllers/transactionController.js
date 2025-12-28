const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

// ✅ FIX: Hàm TÌM member CHÍNH XÁC (KHÔNG tạo mới)
const findOrGetMemberForReader = async (user) => {
    try {
        const userId = user.userId || user._id;
        
        console.log('🔍 Finding member for reader:', { email: user.email, userId });

        // ✅ BƯỚC 1: TÌM theo email (ưu tiên nhất)
        let member = await Member.findOne({ email: user.email });
        
        if (member) {
            console.log('✅ Found member by email:', member.memberCode);
            
            // ✅ CẬP NHẬT: Nếu userId chưa có, thêm vào
            if (!member.userId && userId) {
                member.userId = userId;
                await member.save();
                console.log('✅ Updated member with userId');
            }
            
            return member;
        }

        // ✅ BƯỚC 2: TÌM theo userId (nếu email không có)
        if (userId) {
            member = await Member.findOne({ userId });
            
            if (member) {
                console.log('✅ Found member by userId:', member.memberCode);
                return member;
            }
        }

        // ✅ BƯỚC 3: TÌM theo memberCode (nếu có)
        if (user.memberCode) {
            member = await Member.findOne({ memberCode: user.memberCode });
            
            if (member) {
                console.log('✅ Found member by memberCode:', member.memberCode);
                return member;
            }
        }

        // ❌ KHÔNG FOUND → Báo lỗi (KHÔNG tạo mới)
        console.error('❌ Member not found for reader:', user.email);
        throw new Error('Thành viên chưa được đăng ký. Vui lòng liên hệ thủ thư để được thêm vào hệ thống.');

    } catch (error) {
        console.error('❌ Error finding member:', error);
        throw error;
    }
};

// Lấy tất cả giao dịch với tùy chọn lọc (Cho Admin/Thủ thư)
exports.getAllTransactions = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const transactions = await Transaction.find(query)
            .populate('bookId', 'title author isbn availableCopies')
            .populate('memberId', 'name memberCode email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            data: transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách giao dịch',
            error: error.message
        });
    }
};

// Lấy giao dịch của user hiện tại (cho độc giả)
exports.getUserTransactions = async (req, res) => {
    try {
        // SỬA: Sử dụng thông tin từ req.user (payload JWT)
        const userPayload = {
            userId: req.user.userId, // Lấy userId từ JWT payload
            username: req.user.username,
            email: req.user.email,
            memberCode: req.user.memberCode
        };

        if (!req.user || !userPayload.email) {
            return res.status(400).json({
                success: false,
                message: 'Thông tin user không hợp lệ'
            });
        }

        // ✅ TÌM member CHÍNH XÁC (KHÔNG tạo mới)
        const member = await findOrGetMemberForReader(userPayload);

        // Lấy giao dịch theo memberId của độc giả
        const transactions = await Transaction.find({ memberId: member._id })
            .populate('bookId', 'title author isbn category bookCode')
            .populate('memberId', 'name memberCode email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: transactions,
            total: transactions.length
        });
    } catch (error) {
        console.error('❌ ERROR in getUserTransactions:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy lịch sử giao dịch',
            error: error.message
        });
    }
};

// ✅ FIX LỖI 1 & 2: Tạo giao dịch mượn sách (CHO CẢ ĐỘC GIẢ VÀ ADMIN)
exports.createBorrow = async (req, res) => {
    try {
        // ✅ FIX: THÊM memberId vào destructuring
        const { bookId, memberId, dueDate } = req.body;

        console.log('📥 CREATE BORROW - Request body:', { bookId, memberId, dueDate });

        if (!bookId || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: bookId, dueDate'
            });
        }

        let member;

        // ✅ FIX LỖI 1 & 2: PHÂN BIỆT 2 TRƯỜNG HỢP
        if (memberId) {
            // CASE 1: Admin/Thủ thư tạo giao dịch cho độc giả (memberId từ form)
            console.log('📋 CASE 1: Admin/Librarian creating borrow FOR member:', memberId);
            
            member = await Member.findById(memberId);
            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thành viên'
                });
            }
        } else {
            // CASE 2: Độc giả tự tạo giao dịch mượn (TÌM member CHÍNH XÁC - KHÔNG tạo mới)
            console.log('📖 CASE 2: Reader creating own borrow transaction');
            
            member = await findOrGetMemberForReader(req.user);
        }

        console.log('✅ Using member:', {
            _id: member._id,
            name: member.name,
            memberCode: member.memberCode,
            email: member.email
        });

        const memberId_final = member._id;

        console.log('🔍 Checking borrow limit for member:', member.memberCode);

        // ✅ KIỂM TRA SỐ SÁCH ĐANG MƯỢN
        const currentBorrows = await Transaction.countDocuments({
            memberId: memberId_final,
            status: { $in: ['Đang mượn', 'Quá hạn'] }
        });

        console.log('📊 Current borrows count:', currentBorrows);

        if (currentBorrows >= 5) {
            return res.status(400).json({
                success: false,
                message: `Thành viên đã mượn ${currentBorrows} quyển sách (tối đa 5 quyển)`
            });
        }

        // Kiểm tra sách có tồn tại và có sẵn không
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Sách đã hết, không thể mượn'
            });
        }

        // Kiểm tra thành viên đã mượn sách này chưa
        const existingBorrow = await Transaction.findOne({
            memberId: memberId_final,
            bookId,
            status: { $in: ['Đang mượn', 'Quá hạn'] }
        });

        if (existingBorrow) {
            return res.status(400).json({
                success: false,
                message: 'Thành viên đang mượn quyển sách này'
            });
        }

        // ✅ FIX LỖI 1: TẠO GIAO DỊCH VỚI THÔNG TIN MEMBER CHÍNH XÁC
        const transaction = new Transaction({
            bookId,
            memberId: memberId_final,  // ✅ Dùng member được chọn từ form
            bookSnapshot: {
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                bookCode: book.bookCode
            },
            memberSnapshot: {
                name: member.name,  // ✅ Lấy TÊN từ member được chọn (KHÔNG phải admin)
                memberCode: member.memberCode,  // ✅ Lấy MÃ từ member được chọn
                email: member.email
            },
            borrowDate: new Date(),
            dueDate: new Date(dueDate),
            status: 'Đang mượn'
        });

        const savedTransaction = await transaction.save();

        // Cập nhật số lượng sách có sẵn
        book.availableCopies -= 1;
        await book.save();

        // Populate thông tin trước khi trả về
        await savedTransaction.populate('bookId memberId');

        console.log('✅ Borrow transaction created successfully for member:', member.memberCode);

        res.status(201).json({
            success: true,
            message: 'Mượn sách thành công',
            data: savedTransaction
        });
    } catch (error) {
        console.error('❌ Error in createBorrow:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi mượn sách',
            error: error.message
        });
    }
};

// Trả sách
exports.returnBook = async (req, res) => {
    try {
        const transactionId = req.params.id;

        const transaction = await Transaction.findById(transactionId)
            .populate('bookId');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.status === 'Đã trả') {
            return res.status(400).json({
                success: false,
                message: 'Sách đã được trả trước đó'
            });
        }

        // Tính phí phạt nếu trả trễ
        let fine = 0;
        const actualReturnDate = new Date();
        const dueDate = new Date(transaction.dueDate);

        if (actualReturnDate > dueDate) {
            const daysLate = Math.ceil((actualReturnDate - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysLate * 5000; // 5000 VND mỗi ngày trễ
        }

        // Cập nhật giao dịch
        transaction.actualReturnDate = actualReturnDate;
        transaction.status = 'Đã trả';
        transaction.fine = fine;

        await transaction.save();

        // Cập nhật số lượng sách có sẵn
        if (transaction.bookId) {
            const book = await Book.findById(transaction.bookId._id);
            if (book) {
                book.availableCopies += 1;
                await book.save();
            }
        }

        res.json({
            success: true,
            message: 'Trả sách thành công',
            data: await transaction.populate('bookId memberId'),
            fine: fine
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi trả sách',
            error: error.message
        });
    }
};

// Lấy chi tiết giao dịch
exports.getTransactionDetail = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('bookId', 'title author isbn category bookCode')
            .populate('memberId', 'name memberCode email phone address');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin giao dịch',
            error: error.message
        });
    }
};

// Lấy danh sách sách quá hạn
exports.getOverdueBooks = async (req, res) => {
    try {
        const overdueTransactions = await Transaction.find({
            dueDate: { $lt: new Date() },
            status: 'Đang mượn'
        })
            .populate('bookId', 'title author isbn bookCode')
            .populate('memberId', 'name memberCode email phone')
            .sort({ dueDate: 1 });

        res.json({
            success: true,
            data: overdueTransactions,
            total: overdueTransactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sách quá hạn',
            error: error.message
        });
    }
};

// Tính phạt cho giao dịch
exports.calculateFine = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.status === 'Đã trả') {
            return res.json({
                success: true,
                data: {
                    fine: transaction.fine,
                    daysLate: 0,
                    message: 'Sách đã được trả'
                }
            });
        }

        const now = new Date();
        const dueDate = new Date(transaction.dueDate);
        let daysLate = 0;
        let fine = 0;

        if (now > dueDate) {
            daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysLate * 5000; // 5000 VND/ngày
        }

        res.json({
            success: true,
            data: {
                fine,
                daysLate,
                dueDate: transaction.dueDate,
                currentDate: now,
                message: daysLate > 0 ? `Quá hạn ${daysLate} ngày` : 'Chưa quá hạn'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tính phạt',
            error: error.message
        });
    }
};

// Gia hạn mượn sách
exports.extendDueDate = async (req, res) => {
    try {
        const { newDueDate } = req.body;
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.status !== 'Đang mượn') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể gia hạn sách đang mượn'
            });
        }

        const newDue = new Date(newDueDate);
        if (newDue <= transaction.dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Ngày gia hạn phải sau ngày hết hạn hiện tại'
            });
        }

        // Giới hạn gia hạn tối đa 30 ngày
        const maxExtension = new Date(transaction.dueDate);
        maxExtension.setDate(maxExtension.getDate() + 30);

        if (newDue > maxExtension) {
            return res.status(400).json({
                success: false,
                message: 'Chỉ được gia hạn tối đa 30 ngày'
            });
        }

        transaction.dueDate = newDue;
        await transaction.save();

        res.json({
            success: true,
            message: 'Gia hạn thành công',
            data: await transaction.populate('bookId memberId')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gia hạn',
            error: error.message
        });
    }
};