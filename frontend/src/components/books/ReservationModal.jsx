import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services';

const ReservationModal = ({ book, isOpen, onClose, onReservationSuccess }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      setNotes('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleReserve = async () => {
    if (!book?._id) {
      setError('Thông tin sách không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await reservationService.create({
        bookId: book._id,
        notes: notes.trim() || undefined
      });
      
      onReservationSuccess?.();
      onClose();
    } catch (error) {
      console.error('Reservation error:', error);
      const errorMessage = error.response?.data?.message || 'Đặt sách thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)'
      }} 
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div 
            className="modal-header border-0 text-white"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <h5 className="modal-title fw-bold">
              <i className="fas fa-calendar-plus me-2"></i>
              Đặt trước sách
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-none"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Thông báo lỗi */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Thông tin sách */}
            <div className="card border-0 bg-light mb-3">
              <div className="card-body">
                <h6 className="fw-bold text-primary mb-2">Thông tin sách</h6>
                <p className="mb-1"><strong>Tên sách:</strong> {book?.title}</p>
                <p className="mb-1"><strong>Tác giả:</strong> {book?.author}</p>
                <p className="mb-0"><strong>Mã sách:</strong> {book?.bookCode}</p>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="mb-3">
              <label className="form-label fw-bold text-dark">
                Ghi chú <span className="text-muted">(tùy chọn)</span>
              </label>
              <textarea 
                className="form-control"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho thủ thư (nếu có)..."
                disabled={loading}
              />
              <div className="form-text">
                Ghi chú sẽ giúp thủ thư hiểu rõ hơn về yêu cầu của bạn.
              </div>
            </div>

            {/* Thông báo quan trọng - ĐÃ SỬA VỀ BÌNH THƯỜNG */}
            <div className="alert alert-info mb-0">
              <div className="d-flex">
                <i className="fas fa-info-circle me-2 mt-1"></i>
                <div>
                  <strong>Lưu ý quan trọng:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Sách đặt trước sẽ được giữ trong 3 ngày</li>
                    <li>Bạn có thể hủy đặt trước bất kỳ lúc nào</li>
                    <li>Vui lòng đến thư viện nhận sách trong thời gian hiệu lực</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i>
              Hủy
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleReserve}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-check me-2"></i>
                  Đặt trước
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;