import React from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận đăng xuất",
  message = "Bạn có chắc muốn đăng xuất khỏi hệ thống?",
  confirmText = "Đăng xuất",
  cancelText = "Hủy",
  confirmColor = "danger",
  loading = false,
  children
}) => {
  if (!isOpen) return null;

  // Tạo element để kiểm tra theme hiện tại
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark' || 
                     document.body.classList.contains('dark-mode');

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      background: '#ffffff', // Luôn là nền trắng
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      padding: '20px',
    },
    footer: {
      padding: '20px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
    },
    closeButtonHover: {
      backgroundColor: '#f3f4f6',
    },
    title: {
      margin: 0,
      color: '#1f2937', // Luôn là màu tối
      fontSize: '18px',
      fontWeight: '600',
    },
    message: {
      margin: 0,
      color: '#374151', // Luôn là màu tối
      fontSize: '16px',
      lineHeight: '1.5',
    }
  };

  // Thêm CSS để override dark mode
  const modalClassName = `confirm-modal ${isDarkMode ? 'force-light-mode' : ''}`;

  return (
    <div style={modalStyles.overlay}>
      <div 
        style={modalStyles.content}
        className={modalClassName}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>{title}</h3>
          <button 
            onClick={onClose} 
            style={modalStyles.closeButton}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.backgroundColor = modalStyles.closeButtonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        
        <div style={modalStyles.body}>
          {message && <p style={modalStyles.message}>{message}</p>}
          {children}
        </div>
        
        <div style={modalStyles.footer}>
          <button 
            onClick={onClose}
            className="btn btn-outline-secondary"
            disabled={loading}
            style={{
              borderColor: '#d1d5db',
              color: '#374151',
              backgroundColor: 'transparent',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#b91c1c';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#dc2626';
              }
            }}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;