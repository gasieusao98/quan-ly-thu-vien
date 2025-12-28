import React from 'react';

const BookList = ({ books, loading, onEdit, onDelete, onViewDetail, userRole }) => {
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  const showActions = onEdit || onDelete || onViewDetail;
  
  // ✅ Hàm tạo full URL cho ảnh
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl; // Nếu đã full URL
    return `http://localhost:5000${imageUrl}`; // Thêm base URL
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>ẢNH</th>
              <th>MÃ SÁCH</th>
              <th>TÊN SÁCH</th>
              <th>TÁC GIẢ</th>
              <th>THỂ LOẠI</th>
              <th>SỐ LƯỢNG</th>
              <th>CÓ SẴN</th>
              {showActions && <th>HÀNH ĐỘNG</th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id} className="table-row">
                <td>{index + 1}</td>
                
                {/* Cột hiển thị ảnh */}
                <td>
                  <div className="book-table-image">
                    {book.imageUrl ? (
                      <img 
                        src={getImageUrl(book.imageUrl)} // ✅ SỬA: Dùng full URL
                        alt={book.title}
                        className="book-image-thumbnail"
                        onError={(e) => {
                          console.error('Failed to load image:', getImageUrl(book.imageUrl));
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="book-image-placeholder-table">
                        <span>📕</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td>{book.bookCode}</td>
                <td className="font-medium">{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.totalCopies}</td>
                <td>
                  <span className={`status-badge ${
                    book.availableCopies > 0 ? 'available' : 'unavailable'
                  }`}>
                    {book.availableCopies}
                  </span>
                </td>
                
                {showActions && (
                  <td>
                    <div className="action-buttons">
                      {onViewDetail && (
                        <button 
                          onClick={() => onViewDetail(book)}
                          className="btn-action btn-detail"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </button>
                      )}
                      
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(book)}
                          className="btn-action btn-edit"
                          title="Sửa"
                        >
                          Sửa
                        </button>
                      )}
                      
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(book._id, book.title)}
                          className="btn-action btn-delete"
                          title="Xóa"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {books.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có sách nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;