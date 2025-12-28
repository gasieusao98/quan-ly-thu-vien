import React from 'react';

const ReservationDetailModal = ({ reservation, onClose }) => {
  if (!reservation) return null;

  const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': 
        return { 
          bg: 'rgba(245, 158, 11, 0.1)', 
          text: '#d97706', 
          border: 'rgba(245, 158, 11, 0.3)',
          icon: 'fas fa-clock'
        };
      case 'approved': 
        return { 
          bg: 'rgba(34, 197, 94, 0.1)', 
          text: '#16a34a', 
          border: 'rgba(34, 197, 94, 0.3)',
          icon: 'fas fa-check-circle'
        };
      case 'cancelled': 
        return { 
          bg: 'rgba(239, 68, 68, 0.1)', 
          text: '#dc2626', 
          border: 'rgba(239, 68, 68, 0.3)',
          icon: 'fas fa-times-circle'
        };
      case 'fulfilled': 
        return { 
          bg: 'rgba(59, 130, 246, 0.1)', 
          text: '#2563eb', 
          border: 'rgba(59, 130, 246, 0.3)',
          icon: 'fas fa-calendar-check'
        };
      case 'expired': 
        return { 
          bg: 'rgba(107, 114, 128, 0.1)', 
          text: '#6b7280', 
          border: 'rgba(107, 114, 128, 0.3)',
          icon: 'fas fa-calendar-times'
        };
      default: 
        return { 
          bg: 'rgba(107, 114, 128, 0.1)', 
          text: '#6b7280', 
          border: 'rgba(107, 114, 128, 0.3)',
          icon: 'fas fa-question-circle'
        };
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      cancelled: 'Đã hủy',
      fulfilled: 'Đã đặt trước',
      expired: 'Hết hạn'
    };
    return statusMap[status] || status;
  };

  const statusStyle = getStatusColor(reservation.status);

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
              <i className="fas fa-calendar-check me-2"></i>
              Chi tiết đặt trước
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
              {/* Thông tin sách */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-book me-2 text-primary"></i>
                      Thông tin sách
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
                          {reservation.book?.title || 'N/A'}
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
                          {reservation.book?.author || 'N/A'}
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
                          {reservation.book?.bookCode || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thành viên */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-user me-2 text-success"></i>
                      Thông tin thành viên
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-signature me-1 text-success"></i>
                        Tên thành viên
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                          {reservation.member?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-id-badge me-1 text-success"></i>
                        Mã thành viên
                      </label>
                      <div className="p-2 rounded border bg-info bg-opacity-10">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {reservation.member?.memberCode || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-envelope me-1 text-success"></i>
                        Email
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span 
                          className="text-dark" 
                          style={{ 
                            fontSize: '0.85rem',
                            wordBreak: 'break-word'
                          }}
                        >
                          {reservation.member?.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin đặt trước - Full width */}
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-info-circle me-2 text-warning"></i>
                      Thông tin đặt trước
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-calendar-plus me-1 text-info"></i>
                            Ngày đặt
                          </label>
                          <div className="p-2 rounded border bg-white text-center">
                            <span className="fw-bold text-dark d-flex align-items-center justify-content-center" style={{ fontSize: '0.85rem', minHeight: '40px' }}>
                              <i className="fas fa-clock me-2 text-info"></i>
                              {formatDate(reservation.reservationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-calendar-times me-1 text-danger"></i>
                            Hết hạn
                          </label>
                          <div className="p-2 rounded border bg-white text-center">
                            <span className="fw-bold text-dark d-flex align-items-center justify-content-center" style={{ fontSize: '0.85rem', minHeight: '40px' }}>
                              <i className="fas fa-hourglass-end me-2 text-danger"></i>
                              {formatDate(reservation.expiryDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-circle me-1 text-warning"></i>
                            Trạng thái
                          </label>
                          <div 
                            className="p-2 rounded text-center fw-bold d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.text,
                              border: `1px solid ${statusStyle.border}`,
                              fontSize: '0.8rem',
                              minHeight: '40px'
                            }}
                          >
                            <i className={`${statusStyle.icon} me-2`}></i>
                            {getStatusText(reservation.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    {reservation.notes && (
                      <div className="mt-3">
                        <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                          <i className="fas fa-sticky-note me-1 text-secondary"></i>
                          Ghi chú
                        </label>
                        <div className="p-3 rounded border bg-white">
                          <p className="mb-0 text-dark d-flex align-items-start" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                            <i className="fas fa-quote-left me-2 text-secondary mt-1"></i>
                            {reservation.notes}
                          </p>
                        </div>
                      </div>
                    )}
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

export default ReservationDetailModal;