import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import BookList from '../../components/books/BookList';
import BookForm from '../../components/books/BookForm';
import BookDetailModal from '../../components/books/BookDetailModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import ExcelImportExport from '../../components/excel/ExcelImportExport'; // 🆕 THÊM excel

const Books = () => {
  const { state, actions } = useAppContext();
  const { user } = useAuth();
  const { books, loading, error } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showExcelSection, setShowExcelSection] = useState(false); // 🆕 THÊM

  useEffect(() => {
    actions.fetchBooks();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const canEditBooks = user?.role === 'admin' || user?.role === 'librarian';
  const canViewBooks = user?.role === 'admin' || user?.role === 'librarian';

  const categories = [
    'Tất cả thể loại',
    'Văn học',
    'Khoa học', 
    'Lịch sử',
    'Công nghệ',
    'Kinh tế',
    'Giáo dục',
    'Khác'
  ];

  const handleAddNew = () => {
    setEditingBook(null);
    setShowForm(true);
    setFormError('');
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
    setFormError('');
  };

  const handleViewDetail = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedBook(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormError('');
  };

  const handleFormSubmit = async (bookData) => {
    try {
      setFormError('');
      
      if (editingBook) {
        console.log('✏️ Updating book:', editingBook._id);
        await actions.updateBook(editingBook._id, bookData);
        console.log('✅ Book updated successfully');
        setSuccessMessage('Cập nhật sách thành công!');
      } else {
        console.log('➕ Adding new book...');
        await actions.addBook(bookData);
        console.log('✅ Book added successfully');
        setSuccessMessage('Thêm sách thành công!');
      }
      
      setShowForm(false);
      setEditingBook(null);
      await actions.fetchBooks();
      
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      
      let errorMessage = 'Có lỗi xảy ra!';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Dữ liệu không hợp lệ';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn không có quyền thực hiện hành động này';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormError(errorMessage);
      console.error('Error message:', errorMessage);
    }
  };

  const handleDeleteClick = (bookId, bookTitle) => {
    setBookToDelete({ id: bookId, title: bookTitle });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    
    setDeleteLoading(true);
    try {
      await actions.deleteBook(bookToDelete.id);
      await actions.fetchBooks();
      setSuccessMessage('Xóa sách thành công!');
      
    } catch (error) {
      console.error('Error deleting book:', error);
      setSuccessMessage('Có lỗi xảy ra khi xóa sách: ' + error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setBookToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setBookToDelete(null);
  };

  // 🆕 THÊM: Callback khi import thành công
  const handleImportSuccess = () => {
    actions.fetchBooks();
    setSuccessMessage('✓ Nhập dữ liệu Excel thành công!');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (searchTerm && !matchesSearch) return false;

    if (categoryFilter !== 'all' && book.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="admin-books d-flex flex-column min-vh-100">
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa sách"
        message={`Bạn có chắc muốn xóa sách "${bookToDelete?.title}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="danger"
        loading={deleteLoading}
      />

      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">
                Quản lý sách
                {user?.role === 'librarian' && (
                  <span className="text-sm fw-normal text-muted ms-2">
                    (Chế độ xem)
                  </span>
                )}
              </h1>
              <p className="text-muted mb-0">Quản lý thông tin sách trong thư viện</p>
            </div>
            <div className="col-auto d-flex gap-2">
              {canEditBooks && (
                <button 
                  onClick={handleAddNew}
                  className="btn btn-primary"
                >
                  <i className="fas fa-plus me-2"></i>
                  Thêm sách mới
                </button>
              )}
              {/* 🆕 THÊM: Nút mở/đóng Excel section */}
              {canEditBooks && (
                <button 
                  onClick={() => setShowExcelSection(!showExcelSection)}
                  className="btn btn-secondary"
                  title="Xuất/Nhập Excel"
                >
                  <i className="fas fa-file-excel me-2"></i>
                  {showExcelSection ? 'Ẩn Excel' : 'Excel'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🆕 THÊM: Excel Import/Export Section */}
      {showExcelSection && canEditBooks && (
        <div className="container-fluid mt-3">
          <ExcelImportExport onImportSuccess={handleImportSuccess} />
        </div>
      )}

      {successMessage && (
        <div className="container-fluid mt-3">
          <div className={`alert ${
            successMessage.includes('lỗi') || successMessage.includes('Lỗi') 
              ? 'alert-danger' 
              : 'alert-success'
          } alert-dismissible fade show`} role="alert">
            <i className={`fas ${
              successMessage.includes('lỗi') || successMessage.includes('Lỗi') 
                ? 'fa-exclamation-triangle' 
                : 'fa-check-circle'
            } me-2`}></i>
            <span>{successMessage}</span>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccessMessage('')}
            ></button>
          </div>
        </div>
      )}

      {canViewBooks && (
        <div className="bg-light border-bottom py-3">
          <div className="container-fluid">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label htmlFor="book-search" className="form-label fw-semibold text-muted mb-2">
                  <i className="fas fa-search me-2"></i>Tìm kiếm sách
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    id="book-search"
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo tên, tác giả, ISBN, mã sách..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm('')}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <label htmlFor="category-filter" className="form-label fw-semibold text-muted mb-2">
                  <i className="fas fa-tags me-2"></i>Lọc theo thể loại
                </label>
                <select
                  id="category-filter"
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'Tất cả thể loại' ? 'all' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <div className="text-center p-2 bg-white rounded border">
                  <small className="text-muted d-block">Kết quả</small>
                  <strong className="text-primary">{filteredBooks.length}</strong>
                </div>
              </div>
            </div>

            {(searchTerm || categoryFilter !== 'all') && (
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">Bộ lọc đang áp dụng:</small>
                  
                  {searchTerm && (
                    <span className="badge bg-primary">
                      Tìm kiếm: "{searchTerm}"
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setSearchTerm('')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                  
                  {categoryFilter !== 'all' && (
                    <span className="badge bg-success">
                      Thể loại: {categoryFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setCategoryFilter('all')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                  
                  {(searchTerm || categoryFilter !== 'all') && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                      }}
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="container-fluid mt-3">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      )}

      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {canViewBooks ? (
                <BookList 
                  books={filteredBooks}
                  loading={loading}
                  onEdit={canEditBooks ? handleEdit : null}
                  onDelete={canEditBooks ? handleDeleteClick : null}
                  onViewDetail={handleViewDetail}
                  userRole={user?.role}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="display-1 text-muted mb-4">🚫</div>
                  <h3 className="h4 text-muted mb-3">Không có quyền truy cập</h3>
                  <p className="text-muted">Bạn không có quyền xem trang này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showForm && canEditBooks}
        onClose={handleFormClose}
        title={editingBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
        icon="fas fa-book"
        size="lg"
      >
        {formError && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {formError}
          </div>
        )}
        
        <BookForm
          book={editingBook}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          userRole={user?.role}
        />
      </Modal>

      {showDetailModal && selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Books;