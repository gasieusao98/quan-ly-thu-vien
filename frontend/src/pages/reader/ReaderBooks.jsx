import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import BookCard from '../../components/reader/ReaderBookCard';
import BookSearch from '../../components/reader/BookSearch';
import BorrowModal from '../../components/reader/BorrowModal';
import ReservationModal from '../../components/books/ReservationModal';
import './ReaderBooks.css';

const ReaderBooks = () => {
  const { state, actions } = useAppContext();
  const { books, darkMode } = state; // THÊM darkMode
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('📚 Fetching books for reader...');
    actions.fetchBooks();
  }, [actions]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    let result = books;
    
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(book => book.category === categoryFilter);
    }
    
    setFilteredBooks(result);
  }, [books, searchTerm, categoryFilter]);

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const handleReserve = (book) => {
    setSelectedBook(book);
    setShowReservationModal(true);
  };

  const handleBorrowSuccess = () => {
    setShowBorrowModal(false);
    setSelectedBook(null);
    setSuccessMessage('Mượn sách thành công!');
    actions.fetchBooks();
  };

  const handleReservationSuccess = () => {
    setShowReservationModal(false);
    setSelectedBook(null);
    setSuccessMessage('Đặt trước sách thành công!');
    actions.fetchBooks();
  };

  const categories = ['all', 'Văn học', 'Khoa học', 'Lịch sử', 'Công nghệ', 'Kinh tế', 'Giáo dục'];

  return (
    <div className={`reader-books container-fluid py-4 ${darkMode ? 'dark-mode' : ''}`}>
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              <span>{successMessage}</span>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccessMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center p-4 rounded-3 border shadow-sm reader-header-bg">
            <h1 className="h2 fw-bold mb-0 reader-title">Danh mục sách</h1>
            <span className="badge reader-badge fs-6 px-3 py-2 shadow-sm">
              Tổng: {filteredBooks.length} sách
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <BookSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="row">
        <div className="col-12">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-5 my-5 rounded-3 border reader-no-books">
              <div className="display-1 mb-4 reader-empty-icon">📚</div>
              <h3 className="h4 mb-3 reader-empty-title">Không tìm thấy sách phù hợp</h3>
              <p className="mb-0 reader-empty-text">
                Hãy thử tìm kiếm với từ khóa khác hoặc danh mục khác
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredBooks.map(book => (
                <div key={book._id} className="col-xl-3 col-lg-4 col-md-6">
                  <BookCard 
                    book={book} 
                    onBorrow={handleBorrow}
                    onReserve={handleReserve}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BorrowModal
        book={selectedBook}
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSuccess={handleBorrowSuccess}
      />

      <ReservationModal
        book={selectedBook}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  );
};

export default ReaderBooks;