import React, { useState } from 'react';
import ReservationModal from './ReservationModal';

const BookCard = ({ book, onBookUpdate }) => {
  const [showReservationModal, setShowReservationModal] = useState(false);

  const handleReservationSuccess = () => {
    if (onBookUpdate) {
      onBookUpdate();
    }
  };

  return (
    <>
      <div className="book-card">
        <div className="book-card-header">
          <h3 className="book-title">{book.title}</h3>
          {book.availableCopies === 0 && (
            <span className="out-of-stock-badge">Hết sách</span>
          )}
        </div>
        
        <div className="book-card-body">
          <p className="book-author"><strong>Tác giả:</strong> {book.author}</p>
          <p className="book-category"><strong>Thể loại:</strong> {book.category}</p>
          <p className="book-isbn"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="book-copies"><strong>Số lượng có sẵn:</strong> {book.availableCopies}</p>
          <p className="book-year"><strong>Năm xuất bản:</strong> {book.publishedYear}</p>
        </div>

        <div className="book-card-actions">
          {/* Hiển thị nút Đặt trước khi hết sách */}
          {book.availableCopies === 0 && (
            <button 
              className="btn-reserve"
              onClick={() => setShowReservationModal(true)}
            >
              📋 Đặt trước
            </button>
          )}
          
          {/* Có thể thêm các nút khác ở đây */}
          {book.availableCopies > 0 && (
            <button className="btn-available" disabled>
              Có sẵn
            </button>
          )}
        </div>
      </div>

      {/* Modal đặt trước */}
      <ReservationModal
        book={book}
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onReservationSuccess={handleReservationSuccess}
      />
    </>
  );
};

export default BookCard;