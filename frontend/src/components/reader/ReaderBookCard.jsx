import React, { useState } from 'react';
import './ReaderBookCard.css';

const ReaderBookCard = ({ book, onBorrow, onReserve }) => { // THÊM onReserve
  const [imageError, setImageError] = useState(false);

  const getCategoryClass = (category) => {
    const categoryMap = {
      'Văn học': 'bg-info',
      'Khoa học': 'bg-success',
      'Lịch sử': 'bg-warning',
      'Công nghệ': 'bg-primary',
      'Kinh tế': 'bg-secondary',
      'Giáo dục': 'bg-dark'
    };
    return categoryMap[category] || 'bg-light text-dark';
  };

  const getAvailabilityClass = (availableCopies) => {
    return availableCopies > 0 ? 'text-success' : 'text-danger';
  };

  // ✅ Hàm tạo full URL cho ảnh
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const handleBorrowClick = () => {
    if (onBorrow && book.availableCopies > 0) {
      onBorrow(book);
    }
  };

  // THÊM: Hàm xử lý click đặt trước
  const handleReserveClick = () => {
    if (onReserve && book.availableCopies === 0) {
      onReserve(book);
    }
  };

  const handleImageError = () => {
    console.error('Failed to load image:', getImageUrl(book.imageUrl));
    setImageError(true);
  };

  return (
    <div className="reader-book-card card h-100 shadow-sm border-0">
      <div className="card-img-top book-image-container" style={{ height: '280px' }}>
        {book.imageUrl && !imageError ? (
          <img 
            src={getImageUrl(book.imageUrl)}
            alt={book.title}
            className="book-image"
            onError={handleImageError}
            style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="book-image-placeholder d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
            <span className="book-icon" style={{ fontSize: '3rem' }}>📕</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5 fw-bold text-dark mb-3">{book.title}</h3>
        
        <div className="book-details mb-3">
          <p className="card-text text-muted mb-2">
            <strong>Tác giả:</strong> {book.author}
          </p>
          
          <p className="card-text text-muted mb-3">
            <strong>Năm XB:</strong> {book.publishedYear}
          </p>
        </div>

        {/* Category and Availability */}
        <div className="book-meta d-flex justify-content-between align-items-center mb-3">
          <span className={`badge ${getCategoryClass(book.category)} text-white`}>
            {book.category}
          </span>
          
          <span className={`fw-bold ${getAvailabilityClass(book.availableCopies)}`}>
            {book.availableCopies > 0 ? 
              `${book.availableCopies} có sẵn` : 
              'Hết sách'
            }
          </span>
        </div>

        {/* Action Buttons */}
        <div className="book-actions mt-auto">
          {book.availableCopies > 0 ? (
            <button
              onClick={handleBorrowClick}
              className="btn btn-success w-100 fw-semibold"
            >
              📚 Mượn sách
            </button>
          ) : (
            <button
              onClick={handleReserveClick} // SỬA: Gọi onReserve từ parent
              className="btn btn-warning w-100 fw-semibold text-white"
            >
              📋 Đặt trước
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="book-extra-info mt-3 pt-3 border-top">
          <div className="row g-2 small text-muted">
            <div className="col-12">
              <strong>Mã sách:</strong> {book.bookCode}
            </div>
            <div className="col-12">
              <strong>ISBN:</strong> {book.isbn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderBookCard;