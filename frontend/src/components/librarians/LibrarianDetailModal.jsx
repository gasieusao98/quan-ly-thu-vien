import React from 'react';

const LibrarianDetailModal = ({ librarian, onClose, userRole }) => {
  if (!librarian) return null;

  const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (isActive) => {
    if (isActive) {
      return { 
        bg: 'rgba(34, 197, 94, 0.1)', 
        text: '#16a34a', 
        border: 'rgba(34, 197, 94, 0.3)',
        icon: 'fas fa-check-circle'
      };
    } else {
      return { 
        bg: 'rgba(239, 68, 68, 0.1)', 
        text: '#dc2626', 
        border: 'rgba(239, 68, 68, 0.3)',
        icon: 'fas fa-times-circle'
      };
    }
  };

  const statusStyle = getStatusColor(librarian.isActive);

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
              <i className="fas fa-user-tie me-2"></i>
              Chi tiết thủ thư
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
              {/* Thông tin tài khoản */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-user-circle me-2 text-primary"></i>
                      Thông tin tài khoản
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-user me-1 text-primary"></i>
                        Username
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {librarian.username || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-envelope me-1 text-primary"></i>
                        Email
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {librarian.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-phone me-1 text-primary"></i>
                        Số điện thoại
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {librarian.phone || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-id-card me-2 text-success"></i>
                      Thông tin cá nhân
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-signature me-1 text-success"></i>
                        Họ tên
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                          {librarian.fullName || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-birthday-cake me-1 text-success"></i>
                        Ngày sinh
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {formatDate(librarian.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trạng thái & Vai trò */}
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-chart-bar me-2 text-warning"></i>
                      Trạng thái & Vai trò
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-circle me-1 text-warning"></i>
                            Trạng thái tài khoản
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
                            {librarian.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                            <i className="fas fa-user-shield me-1 text-info"></i>
                            Vai trò
                          </label>
                          <div className="p-2 rounded border text-center bg-info bg-opacity-10">
                            <span className="fw-bold text-info" style={{ fontSize: '0.85rem' }}>
                              <i className="fas fa-user-tie me-1"></i>
                              Thủ thư
                            </span>
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
      </div>
    </div>
  );
};

export default LibrarianDetailModal;