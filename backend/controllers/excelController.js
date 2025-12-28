const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

// 🆕 EXPORT: Xuất danh sách sách ra Excel
exports.exportBooksToExcel = async (req, res) => {
  try {
    // Lấy tất cả sách từ DB
    const books = await Book.find().select('-createdAt -updatedAt');

    if (books.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có sách nào để xuất'
      });
    }

    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách sách');

    // Thêm header
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Mã sách', key: 'bookCode', width: 15 },
      { header: 'Tên sách', key: 'title', width: 30 },
      { header: 'Tác giả', key: 'author', width: 20 },
      { header: 'ISBN', key: 'isbn', width: 15 },
      { header: 'Thể loại', key: 'category', width: 15 },
      { header: 'Năm xuất bản', key: 'publishedYear', width: 12 },
      { header: 'Nhà xuất bản', key: 'publisher', width: 20 },
      { header: 'Tổng số', key: 'totalCopies', width: 10 },
      { header: 'Số có sẵn', key: 'availableCopies', width: 10 },
      { header: 'Mô tả', key: 'description', width: 30 }
    ];

    // Định dạng header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };

    // Thêm dữ liệu
    books.forEach((book, index) => {
      worksheet.addRow({
        stt: index + 1,
        bookCode: book.bookCode,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        publishedYear: book.publishedYear,
        publisher: book.publisher || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        description: book.description || ''
      });
    });

    // Căn lề các ô
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
        if (rowNumber > 1) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      });
    });

    // Tạo file
    const filename = `danh_sach_sach_${Date.now()}.xlsx`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Đảm bảo thư mục uploads tồn tại
    if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads'), { recursive: true });
    }

    await workbook.xlsx.writeFile(filepath);

    // Trả về file
    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      // Xóa file sau khi tải xong
      fs.unlink(filepath, (err) => {
        if (err) console.error('Delete error:', err);
      });
    });

  } catch (error) {
    console.error('❌ Error in exportBooksToExcel:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xuất Excel',
      error: error.message
    });
  }
};

// 🆕 IMPORT: Nhập dữ liệu sách từ Excel
exports.importBooksFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file Excel'
      });
    }

    const filepath = req.file.path;

    // Đọc file Excel
    const workbook = XLSX.readFile(filepath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      fs.unlinkSync(filepath);
      return res.status(400).json({
        success: false,
        message: 'File Excel trống'
      });
    }

    let importedCount = 0;
    let errorCount = 0;
    const errors = [];

    // Lặp qua từng hàng dữ liệu
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];

        // Kiểm tra thông tin bắt buộc
        if (!row.title || !row.author || !row.isbn) {
          errorCount++;
          errors.push(`Hàng ${i + 2}: Thiếu tên sách, tác giả hoặc ISBN`);
          continue;
        }

        // Kiểm tra ISBN có trùng không
        const existingBook = await Book.findOne({ isbn: row.isbn });
        if (existingBook) {
          // Cập nhật sách cũ
          existingBook.title = row.title || existingBook.title;
          existingBook.author = row.author || existingBook.author;
          existingBook.category = row.category || existingBook.category;
          existingBook.publishedYear = row.publishedYear || existingBook.publishedYear;
          existingBook.publisher = row.publisher || existingBook.publisher;
          existingBook.totalCopies = row.totalCopies || existingBook.totalCopies;
          existingBook.availableCopies = row.availableCopies || existingBook.availableCopies;
          existingBook.description = row.description || existingBook.description;

          await existingBook.save();
          importedCount++;
        } else {
          // Tạo sách mới
          const newBook = new Book({
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            category: row.category || 'Khác',
            publishedYear: row.publishedYear || new Date().getFullYear(),
            publisher: row.publisher || '',
            totalCopies: row.totalCopies || 1,
            availableCopies: row.availableCopies || row.totalCopies || 1,
            description: row.description || ''
          });

          await newBook.save();
          importedCount++;
        }
      } catch (rowError) {
        errorCount++;
        errors.push(`Hàng ${i + 2}: ${rowError.message}`);
      }
    }

    // Xóa file upload
    fs.unlinkSync(filepath);

    res.json({
      success: true,
      message: `Nhập thành công ${importedCount} sách, thất bại ${errorCount}`,
      data: {
        importedCount,
        errorCount,
        totalRows: data.length,
        errors: errors.length > 0 ? errors : []
      }
    });

  } catch (error) {
    // Xóa file nếu còn
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('❌ Error in importBooksFromExcel:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi nhập Excel',
      error: error.message
    });
  }
};