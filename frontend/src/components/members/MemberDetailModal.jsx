import React from 'react';

const MemberDetailModal = ({ member, onClose, userRole }) => {
  if (!member) return null;

  const formatDate = (date) => {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return { 
          bg: 'rgba(34, 197, 94, 0.1)', 
          text: '#16a34a', 
          border: 'rgba(34, 197, 94, 0.3)',
          icon: 'fas fa-check-circle'
        };
      case 'Tạm khóa':
        return { 
          bg: 'rgba(245, 158, 11, 0.1)', 
          text: '#d97706', 
          border: 'rgba(245, 158, 11, 0.3)',
          icon: 'fas fa-pause-circle'
        };
      case 'Khóa':
        return { 
          bg: 'rgba(239, 68, 68, 0.1)', 
          text: '#dc2626', 
          border: 'rgba(239, 68, 68, 0.3)',
          icon: 'fas fa-times-circle'
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

  const getMemberTypeColor = (type) => {
    switch (type) {
      case 'Sinh viên':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#1d4ed8', icon: 'fas fa-graduation-cap' };
      case 'Giảng viên':
        return { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed', icon: 'fas fa-chalkboard-teacher' };
      case 'Cán bộ':
        return { bg: 'rgba(14, 165, 233, 0.1)', text: '#0369a1', icon: 'fas fa-user-tie' };
      case 'Khách':
        return { bg: 'rgba(100, 116, 139, 0.1)', text: '#475569', icon: 'fas fa-user' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', icon: 'fas fa-user' };
    }
  };

  const statusStyle = getStatusColor(member.status);
  const memberTypeStyle = getMemberTypeColor(member.membershipType);

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
              <i className="fas fa-user me-2"></i>
              Chi tiết thành viên
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
              {/* Thông tin cá nhân */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-id-card me-2 text-primary"></i>
                      Thông tin cá nhân
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-signature me-1 text-primary"></i>
                        Họ tên
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                          {member.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-user me-1 text-primary"></i>
                        {/* ✅ THÊM: Username */}
                        Tên đăng nhập
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="font-mono text-primary fw-bold" style={{ fontSize: '0.85rem' }}>
                          {member.username || 'N/A'}
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
                          {member.email || 'N/A'}
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
                          {member.phone || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-birthday-cake me-1 text-primary"></i>
                        Ngày sinh
                      </label>
                      <div className="p-2 rounded border bg-white">
                        <span className="text-dark" style={{ fontSize: '0.85rem' }}>
                          {formatDate(member.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thư viện */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-book me-2 text-success"></i>
                      Thông tin thư viện
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-id-badge me-1 text-success"></i>
                        Mã thành viên
                      </label>
                      <div className="p-2 rounded border bg-warning bg-opacity-10">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          {member.memberCode || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-gray-600 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-users me-1 text-success"></i>
                        Loại thành viên
                      </label>
                      <div 
                        className="p-2 rounded text-center fw-bold d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: memberTypeStyle.bg,
                          color: memberTypeStyle.text,
                          border: `1px solid ${memberTypeStyle.bg.replace('0.1', '0.3')}`,
                          fontSize: '0.8rem',
                          minHeight: '40px'
                        }}
                      >
                        <i className={`${memberTypeStyle.icon} me-2`}></i>
                        {member.membershipType || 'N/A'}
                      </div>
                    </div>
                    
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
                        {member.status || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Địa chỉ - Full width */}
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                  <div className="card-header border-0 py-3" style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }}>
                    <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                      <i className="fas fa-map-marker-alt me-2 text-info"></i>
                      Địa chỉ
                    </h6>
                  </div>
                  <div className="card-body py-3">
                    <div className="p-3 rounded border bg-white">
                      <p className="mb-0 text-dark d-flex align-items-center" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                        <i className="fas fa-home me-2 text-info"></i>
                        {member.address || 'Chưa có thông tin địa chỉ'}
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

export default MemberDetailModal;