import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const BorrowModal = ({ book, isOpen, onClose, onSuccess }) => {
  const { actions } = useAppContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !book) return null;

  const calculateDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toISOString().split('T')[0];
  };

  const handleBorrow = async () => {
    if (book.availableCopies <= 0) {
      setError('Sách đã hết, không thể mượn');
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const borrowData = {
        bookId: book._id,
        dueDate: new Date(calculateDueDate()).toISOString()
      };

      await actions.borrowBook(borrowData);
      onSuccess();
      
    } catch (err) {
      console.error('Borrow error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi mượn sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)'
      }} 
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-book me-2"></i>
              Mượn sách
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Thông tin sách */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{ color: 'inherit' }}>{book.title}</h6>
              <div className="row">
                <div className="col-6">
                  <p className="mb-2">
                    <strong>Tác giả:</strong><br/>
                    <span style={{ color: 'var(--text-muted)' }}>{book.author}</span>
                  </p>
                </div>
                <div className="col-6">
                  <p className="mb-2">
                    <strong>Thể loại:</strong><br/>
                    <span style={{ color: 'var(--text-muted)' }}>{book.category}</span>
                  </p>
                </div>
              </div>
              <p className="mb-0">
                <strong>Tình trạng:</strong>{' '}
                <span className={`badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {book.availableCopies > 0 ? 'Có sẵn' : 'Hết sách'}
                </span>
              </p>
            </div>

            {/* Thông tin ngày tháng - FIXED LAYOUT */}
            <div className="card border-0 mb-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="card-body p-3">
                <div className="row text-center g-0">
                  <div className="col-4 border-end" style={{ borderRightColor: 'var(--border-color)' }}>
                    <div className="px-2">
                      <small className="d-block mb-1" style={{ color: 'var(--text-muted)' }}>Ngày mượn</small>
                      <strong 
                        className="d-block text-truncate" 
                        style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}
                        title={new Date().toLocaleDateString('vi-VN')}
                      >
                        {new Date().toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                  </div>
                  <div className="col-4 border-end" style={{ borderRightColor: 'var(--border-color)' }}>
                    <div className="px-2">
                      <small className="d-block mb-1" style={{ color: 'var(--text-muted)' }}>Hạn trả</small>
                      <strong 
                        className="d-block text-truncate" 
                        style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}
                        title={new Date(calculateDueDate()).toLocaleDateString('vi-VN')}
                      >
                        {new Date(calculateDueDate()).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="px-2">
                      <small className="d-block mb-1" style={{ color: 'var(--text-muted)' }}>Số ngày</small>
                      <strong style={{ color: 'var(--text-primary)' }}>14 ngày</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cảnh báo - SỬA CHỖ NÀY */}
            <div className="alert mb-0" style={{ 
              backgroundColor: 'var(--warning-light)', 
              borderColor: 'var(--warning-dark)',
              color: 'var(--warning-dark)'
            }}>
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-circle me-2"></i>
                <div>
                  <small className="fw-bold">Lưu ý:</small>
                  <small className="d-block mt-1" style={{ color: 'var(--warning-dark)' }}>
                    Vui lòng trả sách đúng hạn để tránh phí phạt.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBorrow}
              disabled={loading || book.availableCopies <= 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Xác nhận mượn
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;