const mongoose = require('mongoose');
const User = require('../models/User');
const Member = require('../models/Member');
const Book = require('../models/Book');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ===== TẠO USERS =====
        const defaultUsers = [
            {
                username: 'admin',
                email: 'admin@library.com',
                password: '123456',
                fullName: 'Admin',
                role: 'admin'
            },
            {
                username: 'librarian',
                email: 'librarian@library.com',
                password: '123456',
                fullName: 'Thủ Thư',
                role: 'librarian'
            },
            {
                username: 'reader',
                email: 'reader@library.com',
                password: '123456',
                fullName: 'Độc Giả Test',
                role: 'reader'
            }
        ];

        // Tạo từng user
        for (const userData of defaultUsers) {
            const userExists = await User.findOne({ email: userData.email });
            
            if (!userExists) {
                const user = await User.create(userData);
                console.log(`✅ Created user: ${userData.email}`);

                // Tạo Member nếu là reader
                if (userData.role === 'reader') {
                    const memberExists = await Member.findOne({ userId: user._id });
                    if (!memberExists) {
                        await Member.create({
                            name: user.fullName,
                            email: user.email,
                            phone: '0123456789',
                            address: 'Hà Nội',
                            userId: user._id
                        });
                        console.log(`✅ Created member for: ${userData.email}`);
                    }
                }
            }
        }

        // ===== TẠO SÁCH MẪU =====
        const bookCount = await Book.countDocuments();
        if (bookCount === 0) {
            const sampleBooks = [
                {
                    title: 'Lập Trình Node.js',
                    author: 'Nguyễn Văn A',
                    isbn: 'ISBN-001',
                    publisher: 'Nhà Xuất Bản Công Nghệ',
                    publishedYear: 2023,
                    category: 'Công nghệ',
                    totalCopies: 5,
                    availableCopies: 5,
                    description: 'Hướng dẫn lập trình Node.js cho người mới bắt đầu'
                },
                {
                    title: 'JavaScript ES6+',
                    author: 'Trần Thị B',
                    isbn: 'ISBN-002',
                    publisher: 'Nhà Xuất Bản Công Nghệ',
                    publishedYear: 2023,
                    category: 'Công nghệ',
                    totalCopies: 3,
                    availableCopies: 3,
                    description: 'Tìm hiểu sâu về JavaScript ES6 và các tính năng mới'
                },
                {
                    title: 'MongoDB Guide',
                    author: 'Lê Minh C',
                    isbn: 'ISBN-003',
                    publisher: 'Nhà Xuất Bản Công Nghệ',
                    publishedYear: 2022,
                    category: 'Công nghệ',
                    totalCopies: 4,
                    availableCopies: 4,
                    description: 'Hướng dẫn chi tiết về MongoDB'
                },
                {
                    title: 'React cho người mới học',
                    author: 'Phạm Đức D',
                    isbn: 'ISBN-004',
                    publisher: 'Nhà Xuất Bản Công Nghệ',
                    publishedYear: 2023,
                    category: 'Công nghệ',
                    totalCopies: 6,
                    availableCopies: 6,
                    description: 'Học React từ cơ bản đến nâng cao'
                },
                {
                    title: 'Docker cho DevOps',
                    author: 'Võ Hữu E',
                    isbn: 'ISBN-005',
                    publisher: 'Nhà Xuất Bản Công Nghệ',
                    publishedYear: 2023,
                    category: 'Công nghệ',
                    totalCopies: 2,
                    availableCopies: 2,
                    description: 'Hướng dẫn sử dụng Docker trong DevOps'
                },
                {
                    title: 'Lịch sử Việt Nam',
                    author: 'Hoàng Văn F',
                    isbn: 'ISBN-006',
                    publisher: 'Nhà Xuất Bản Đại học',
                    publishedYear: 2020,
                    category: 'Lịch sử',
                    totalCopies: 3,
                    availableCopies: 3,
                    description: 'Tổng quan về lịch sử Việt Nam'
                },
                {
                    title: 'Nhập môn Kinh tế',
                    author: 'Trương Thị G',
                    isbn: 'ISBN-007',
                    publisher: 'Nhà Xuất Bản Kinh tế',
                    publishedYear: 2021,
                    category: 'Kinh tế',
                    totalCopies: 4,
                    availableCopies: 4,
                    description: 'Kiến thức cơ bản về kinh tế'
                },
                {
                    title: 'Khoa học tự nhiên',
                    author: 'Ngô Hữu H',
                    isbn: 'ISBN-008',
                    publisher: 'Nhà Xuất Bản Khoa học',
                    publishedYear: 2022,
                    category: 'Khoa học',
                    totalCopies: 5,
                    availableCopies: 5,
                    description: 'Các kiến thức cơ bản về khoa học tự nhiên'
                },
                {
                    title: 'Văn học Việt Nam',
                    author: 'Phan Như I',
                    isbn: 'ISBN-009',
                    publisher: 'Nhà Xuất Bản Văn học',
                    publishedYear: 2019,
                    category: 'Văn học',
                    totalCopies: 7,
                    availableCopies: 7,
                    description: 'Tuyển tập văn học Việt Nam nổi tiếng'
                },
                {
                    title: 'Giáo dục hiện đại',
                    author: 'Đinh Quốc J',
                    isbn: 'ISBN-010',
                    publisher: 'Nhà Xuất Bản Giáo dục',
                    publishedYear: 2023,
                    category: 'Giáo dục',
                    totalCopies: 2,
                    availableCopies: 2,
                    description: 'Phương pháp giáo dục hiện đại'
                }
            ];

            await Book.insertMany(sampleBooks);
            console.log(`✅ Created ${sampleBooks.length} sample books`);
        }

        console.log('\n✅ Database seeding completed!');
        console.log('\n📝 Default accounts:');
        console.log('   Admin:    admin@library.com / 123456');
        console.log('   Librarian: librarian@library.com / 123456');
        console.log('   Reader:   reader@library.com / 123456');
        console.log('\n📚 Sample books added: 10 cuốn\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDatabase();