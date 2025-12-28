import React, { useState, useEffect } from 'react';

const ExtendModal = ({ transaction, isOpen, onClose, onConfirm }) => {
  const [extraDays, setExtraDays] = useState(7);
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    if (transaction && isOpen) {
      // Tính ngày gia hạn mặc định (thêm 7 ngày)
      const currentDueDate = new Date(transaction.dueDate);
      const extendedDate = new Date(currentDueDate);
      extendedDate.setDate(currentDueDate.getDate() + 7);
      
      setNewDueDate(extendedDate.toISOString().split('T')[0]);
    }
  }, [transaction, isOpen]);

  const handleDaysChange = (days) => {
    setExtraDays(days);
    if (transaction) {
      const currentDueDate = new Date(transaction.dueDate);
      const extendedDate = new Date(currentDueDate);
      extendedDate.setDate(currentDueDate.getDate() + days);
      setNewDueDate(extendedDate.toISOString().split('T')[0]);
    }
  };

  const handleDateChange = (date) => {
    setNewDueDate(date);
    if (transaction && date) {
      const currentDueDate = new Date(transaction.dueDate);
      const newDate = new Date(date);
      const diffTime = newDate - currentDueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setExtraDays(diffDays > 0 ? diffDays : 1);
    }
  };

  const handleSubmit = () => {
    if (newDueDate) {
      onConfirm(newDueDate);
    }
  };

  if (!isOpen || !transaction) return null;

  const bookTitle = transaction.bookSnapshot?.title || transaction.bookId?.title || 'Sách';
  const memberName = transaction.memberSnapshot?.name || transaction.memberId?.name || 'Thành viên';
  const currentDueDate = new Date(transaction.dueDate).toLocaleDateString('vi-VN');

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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            }}
          >
            <h5 className="modal-title fw-bold">
              <i className="fas fa-calendar-plus me-2"></i>
              Gia hạn mượn sách
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white shadow-none"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body bg-white p-4">
            {/* Thông tin giao dịch */}
            <div className="mb-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted mb-1">Sách</label>
                  <div className="p-2 bg-light rounded border">
                    <span className="fw-bold text-dark">{bookTitle}</span>
                  </div>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted mb-1">Thành viên</label>
                  <div className="p-2 bg-light rounded border">
                    <span className="text-dark">{memberName}</span>
                  </div>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted mb-1">Hạn trả hiện tại</label>
                  <div className="p-2 bg-warning bg-opacity-10 rounded border border-warning">
                    <span className="fw-bold text-dark">{currentDueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chọn số ngày gia hạn */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-3">
                <i className="fas fa-calendar-day me-2"></i>
                Chọn số ngày gia hạn
              </label>
              <div className="row g-2">
                {[3, 7, 14, 30].map((days) => (
                  <div key={days} className="col-6 col-sm-3">
                    <button
                      type="button"
                      className={`btn w-100 ${extraDays === days ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleDaysChange(days)}
                    >
                      {days} ngày
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hoặc chọn ngày cụ thể */}
            <div className="mb-4">
              <label htmlFor="newDueDate" className="form-label fw-semibold text-dark">
                <i className="fas fa-calendar-alt me-2"></i>
                Hoặc chọn ngày cụ thể
              </label>
              <input
                type="date"
                id="newDueDate"
                className="form-control"
                value={newDueDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date(transaction.dueDate).toISOString().split('T')[0]}
              />
              <div className="form-text">
                Ngày gia hạn mới: <strong>{newDueDate ? new Date(newDueDate).toLocaleDateString('vi-VN') : ''}</strong>
              </div>
            </div>

            {/* Thông báo */}
            <div className="alert alert-info mb-0">
              <i className="fas fa-info-circle me-2"></i>
              <small>
                Sách sẽ được gia hạn đến ngày <strong>{newDueDate ? new Date(newDueDate).toLocaleDateString('vi-VN') : ''}</strong>
                {extraDays > 0 && ` (Thêm ${extraDays} ngày)`}
              </small>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className="fas fa-times me-2"></i>
              Hủy
            </button>
            <button 
              type="button" 
              className="btn btn-warning"
              onClick={handleSubmit}
              disabled={!newDueDate}
            >
              <i className="fas fa-check me-2"></i>
              Xác nhận gia hạn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendModal;