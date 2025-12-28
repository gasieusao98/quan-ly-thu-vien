import React from 'react';

const BookDetailModal = ({ book, onClose }) => {
  if (!book) return null;

  const getCategoryColor = (category) => {
    const colors = {
      'Văn học': { bg: 'rgba(139, 69, 19, 0.1)', text: '#8b4513', icon: 'fas fa-pen-fancy' },
      'Khoa học': { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', icon: 'fas fa-flask' },
      'Lịch sử': { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', icon: 'fas fa-landmark' },
      'Kinh tế': { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', icon: 'fas fa-chart-line' },
      'Công nghệ': { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed', icon: 'fas fa-laptop-code' },
      'Tâm lý': { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777', icon: 'fas fa-brain' },
      'default': { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', icon: 'fas fa-book' }
    };
    return colors[category] || colors.default;
  };

  const categoryStyle = getCategoryColor(book.category);

  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)'
      }} 
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
          {/* Header với gradient chuyên nghiệp */}
          <div 
            className="modal-header border-0 text-white py-3"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}
          >
            <h5 className="modal-title fw-bold d-flex align-items-center" style={{ fontSize: '1.1rem' }}>
              <i className="fas fa-book me-2"></i>
              Chi tiết sách
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-none"
              onClick={onClose}
              style={{ fontSize: '0.8rem' }}
            ></button>
          </div>

          <div className="modal-body bg-light p-4">
            <div className="row g-4">
              {/* Thông tin cơ bản */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-info-circle me-2 text-primary"></i>
                      Thông tin cơ bản
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-heading me-1 text-primary"></i>
                        Tên sách
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                          {book.title || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-barcode me-1 text-primary"></i>
                        Mã sách
                      </label>
                      <div className="p-2 rounded border bg-warning bg-opacity-10">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {book.bookCode || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-user-edit me-1 text-primary"></i>
                        Tác giả
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {book.author || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-tags me-1 text-primary"></i>
                        Thể loại
                      </label>
                      <div 
                        className="p-2 rounded text-center fw-bold d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: categoryStyle.bg,
                          color: categoryStyle.text,
                          border: `1px solid ${categoryStyle.bg.replace('0.1', '0.3')}`,
                          fontSize: '0.8rem',
                          minHeight: '40px'
                        }}
                      >
                        <i className={`${categoryStyle.icon} me-2`}></i>
                        {book.category || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin xuất bản */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-print me-2 text-success"></i>
                      Thông tin xuất bản
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-fingerprint me-1 text-success"></i>
                        ISBN
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="font-mono text-dark" style={{ fontSize: '0.85rem' }}>
                          {book.isbn || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-calendar-alt me-1 text-success"></i>
                        Năm xuất bản
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {book.publishedYear || book.publicationYear || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-building me-1 text-success"></i>
                        Nhà xuất bản
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {book.publisher || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin kho sách */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-warehouse me-2 text-warning"></i>
                      Thông tin kho sách
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="text-center">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-cubes me-1 text-info"></i>
                            Tổng số
                          </label>
                          <div className="p-3 rounded border bg-info bg-opacity-10 border-info">
                            <span className="fw-bold text-info d-block" style={{ fontSize: '1.5rem' }}>
                              {book.totalCopies || 0}
                            </span>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>bản sách</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="text-center">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-check-circle me-1 text-success"></i>
                            Có sẵn
                          </label>
                          <div 
                            className={`p-3 rounded border ${
                              (book.availableCopies || 0) > 0 
                                ? 'bg-success bg-opacity-10 border-success' 
                                : 'bg-danger bg-opacity-10 border-danger'
                            }`}
                          >
                            <span 
                              className={`fw-bold d-block ${
                                (book.availableCopies || 0) > 0 ? 'text-success' : 'text-danger'
                              }`} 
                              style={{ fontSize: '1.5rem' }}
                            >
                              {book.availableCopies || 0}
                            </span>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>bản sẵn</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="mt-3 p-2 rounded bg-light border text-center">
                          <small className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>
                            <i className="fas fa-info-circle me-1"></i>
                            Đang mượn: <span className="text-warning">{(book.totalCopies || 0) - (book.availableCopies || 0)}</span> bản
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả sách */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-file-alt me-2 text-info"></i>
                      Mô tả sách
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="p-3 rounded border bg-white h-100">
                      <p 
                        className="mb-0 text-dark lh-base d-flex align-items-start"
                        style={{ 
                          fontSize: '0.85rem',
                          lineHeight: '1.5',
                          minHeight: '120px'
                        }}
                      >
                        <i className="fas fa-quote-left me-2 text-info mt-1"></i>
                        {(book.description || book.desc) ? (
                          book.description || book.desc
                        ) : (
                          <span className="text-muted">Chưa có mô tả cho sách này</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;