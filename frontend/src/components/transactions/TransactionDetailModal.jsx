import React from 'react';

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang mượn':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Đã trả':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Quá hạn':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  const statusStyle = getStatusColor(transaction.status);
  const isOverdue = transaction.status === 'Quá hạn';

  const bookTitle = transaction.bookSnapshot?.title || transaction.bookId?.title || 'Thông tin sách';
  const bookCode = transaction.bookSnapshot?.bookCode || transaction.bookId?.bookCode || '—';
  const bookAuthor = transaction.bookSnapshot?.author || transaction.bookId?.author || '—';
  
  const memberName = transaction.memberSnapshot?.name || transaction.memberId?.name || 'Thành viên';
  const memberCode = transaction.memberSnapshot?.memberCode || transaction.memberId?.memberCode || '—';
  const memberEmail = transaction.memberSnapshot?.email || transaction.memberId?.email || '—';

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
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div 
            className="modal-header border-0 text-white"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <h5 className="modal-title fw-bold" style={{ fontSize: '1.1rem' }}>
              <i className="fas fa-receipt me-2"></i>
              Chi tiết giao dịch
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-none"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body bg-white p-3">
            <div className="row g-3">
              {/* Thông tin sách */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header border-0 bg-light py-2">
                    <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-book me-1"></i>
                      Thông tin sách
                    </h6>
                  </div>
                  <div className="card-body py-2">
                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Tên sách</label>
                      <p className="mb-0 text-primary fw-semibold" style={{ fontSize: '0.9rem' }}>
                        {bookTitle}
                      </p>
                    </div>
                    
                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Mã sách</label>
                      <div className="p-1 rounded border bg-warning bg-opacity-10">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {bookCode}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Tác giả</label>
                      <p className="mb-0 text-dark" style={{ fontSize: '0.85rem' }}>
                        {bookAuthor}
                      </p>
                    </div>

                    {transaction.bookSnapshot && (
                      <div className="mt-2">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          <i className="fas fa-info-circle me-1"></i>
                          Dữ liệu từ lúc mượn
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin thành viên */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header border-0 bg-light py-2">
                    <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-user me-1"></i>
                      Thông tin thành viên
                    </h6>
                  </div>
                  <div className="card-body py-2">
                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Tên thành viên</label>
                      <p className="mb-0 text-dark fw-semibold" style={{ fontSize: '0.9rem' }}>
                        {memberName}
                      </p>
                    </div>
                    
                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Mã thành viên</label>
                      <div className="p-1 rounded border bg-info bg-opacity-10">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {memberCode}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Email</label>
                      <p 
                        className="mb-0 text-dark" 
                        style={{ 
                          fontSize: '0.8rem',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {memberEmail}
                      </p>
                    </div>

                    {transaction.memberSnapshot && (
                      <div className="mt-2">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          <i className="fas fa-info-circle me-1"></i>
                          Dữ liệu từ lúc mượn
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin giao dịch */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header border-0 bg-light py-2">
                    <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-calendar-alt me-1"></i>
                      Thông tin giao dịch
                    </h6>
                  </div>
                  <div className="card-body py-2">
                    <div className="row g-2 align-items-stretch">
                      

                      <div className="col-md-3 d-flex flex-column">
                        <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Ngày mượn</label>
                        <div className="p-1 rounded border bg-light text-center flex-grow-1 d-flex align-items-center justify-content-center">
                          <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                            {formatDate(transaction.borrowDate) || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-3 d-flex flex-column">
                        <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Hạn trả</label>
                        <div className={`p-1 rounded border text-center flex-grow-1 d-flex align-items-center justify-content-center fw-bold ${
                          isOverdue ? 'text-danger border-danger bg-danger bg-opacity-10' : 'text-dark bg-light'
                        }`}>
                          <span style={{ fontSize: '0.85rem' }}>
                            {formatDate(transaction.dueDate) || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-3 d-flex flex-column">
                        <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Ngày trả thực tế</label>
                        <div className="p-1 rounded border bg-light text-center flex-grow-1 d-flex align-items-center justify-content-center">
                          <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                            {formatDate(transaction.actualReturnDate) || 'Chưa trả'}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-3 d-flex flex-column">
                        <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Trạng thái</label>
                        <div 
                          className="p-1 rounded text-center flex-grow-1 d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                            fontSize: '0.8rem'
                          }}
                        >
                          {transaction.status || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Thông tin phạt */}
                    <div className="mt-3">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>Thông tin phạt</label>
                      <div className={`p-2 rounded border text-center fw-bold ${
                        transaction.fine > 0 
                          ? 'bg-danger bg-opacity-10 text-danger border-danger' 
                          : 'bg-success bg-opacity-10 text-success border-success'
                      }`}>
                        <h5 className="mb-1">
                          {transaction.fine ? transaction.fine.toLocaleString('vi-VN') : '0'} VND
                        </h5>
                        {transaction.fine > 0 && (
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Phạt quá hạn
                          </small>
                        )}
                      </div>
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

export default TransactionDetailModal;