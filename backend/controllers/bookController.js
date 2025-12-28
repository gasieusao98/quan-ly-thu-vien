const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// Lấy tất cả sách
exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
        { bookCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'Tất cả') {
      filter.category = category;
    }

    const books = await Book.find(filter)
      .select('-__v')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Book.countDocuments(filter);
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách sách', 
      error: error.message 
    });
  }
};

// Lấy sách theo ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select('-__v');
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy thông tin sách', 
      error: error.message 
    });
  }
};

// ✅ SỬA: Thêm sách mới + xử lý file upload
exports.createBook = async (req, res) => {
  try {
    const bookData = { ...req.body };
    
    // ✅ Nếu có file upload, lưu URL thay vì Base64
    if (req.file) {
      // URL: /uploads/books/filename
      bookData.imageUrl = `/uploads/books/${req.file.filename}`;
      console.log('📸 Image uploaded:', bookData.imageUrl);
    } else {
      // Không có ảnh
      bookData.imageUrl = '';
    }
    
    console.log('📝 Creating book:', {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      imageUrl: bookData.imageUrl || 'No image'
    });
    
    const book = new Book(bookData);
    const savedBook = await book.save();
    
    console.log('✅ Book created successfully:', savedBook._id);
    
    res.status(201).json({
      message: 'Thêm sách thành công',
      book: savedBook
    });
  } catch (error) {
    console.error('❌ Error creating book:', error);
    
    // ✅ Nếu có lỗi, xóa file đã upload
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        message: `${field.toUpperCase()} đã tồn tại` 
      });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ 
        message: 'Lỗi khi thêm sách', 
        error: error.message 
      });
    }
  }
};

// ✅ SỬA: Cập nhật sách
exports.updateBook = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Lấy book cũ để check ảnh cũ
    const oldBook = await Book.findById(req.params.id);
    if (!oldBook) {
      // Nếu không có file, xóa nó
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    // ✅ Nếu có file mới upload
    if (req.file) {
      updateData.imageUrl = `/uploads/books/${req.file.filename}`;
      console.log('📸 Image updated:', updateData.imageUrl);
      
      // ✅ Xóa ảnh cũ (nếu có)
      if (oldBook.imageUrl && oldBook.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../' + oldBook.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn('Warning: Could not delete old image:', err.message);
        });
      }
    } else {
      // Nếu không upload ảnh mới, giữ ảnh cũ
      updateData.imageUrl = oldBook.imageUrl;
    }
    
    console.log('📝 Updating book:', {
      id: req.params.id,
      title: updateData.title,
      imageUrl: updateData.imageUrl || 'No image'
    });
    
    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    console.log('✅ Book updated successfully');
    
    res.json({
      message: 'Cập nhật sách thành công',
      book
    });
  } catch (error) {
    console.error('❌ Error updating book:', error);
    
    // ✅ Xóa file nếu có lỗi
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật sách', 
        error: error.message 
      });
    }
  }
};

// ✅ SỬA: Xóa sách - cũng xóa file ảnh
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    
    // ✅ Xóa file ảnh
    if (book.imageUrl && book.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../' + book.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Warning: Could not delete image:', err.message);
        else console.log('✅ Image deleted:', book.imageUrl);
      });
    }
    
    res.json({ message: 'Xóa sách thành công' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi xóa sách', 
      error: error.message 
    });
  }
};

// Lấy thống kê sách
exports.getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } }
    ]);
    const borrowedBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: { $subtract: ['$totalCopies', '$availableCopies'] } } } }
    ]);

    res.json({
      totalBooks,
      availableBooks: availableBooks[0]?.total || 0,
      borrowedBooks: borrowedBooks[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy thống kê', 
      error: error.message 
    });
  }
};