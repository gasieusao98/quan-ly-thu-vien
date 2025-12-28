import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { authService } from '../../services';
import ConfirmModal from '../../components/common/ConfirmModal';
import './Auth.css';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    membershipType: 'Sinh viên',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const membershipTypes = ['Sinh viên', 'Giảng viên', 'Cán bộ', 'Khách'];

  const validateForm = () => {
    const newErrors = {};

    if (!userData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!userData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (userData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!userData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(userData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    if (!userData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!userData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!userData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = userData;
      const response = await authService.register(registerData);
      
      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đăng ký thất bại';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký tài khoản</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Họ và tên */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nhập họ tên"
              value={userData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Tên đăng nhập */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.username ? 'is-invalid' : ''}`}
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={userData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.email ? 'is-invalid' : ''}`}
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              value={userData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
              type="tel"
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={userData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Ngày sinh */}
          <div className="form-group">
            <label htmlFor="dateOfBirth" className="form-label">
              Ngày sinh <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.dateOfBirth ? 'is-invalid' : ''}`}
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>

          {/* Địa chỉ */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Địa chỉ <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.address ? 'is-invalid' : ''}`}
              type="text"
              id="address"
              name="address"
              placeholder="Nhập địa chỉ"
              value={userData.address}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Loại thành viên */}
          <div className="form-group">
            <label htmlFor="membershipType" className="form-label">
              Loại thành viên <span className="required">*</span>
            </label>
            <select
              className={`form-input ${errors.membershipType ? 'is-invalid' : ''}`}
              id="membershipType"
              name="membershipType"
              value={userData.membershipType}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {membershipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.membershipType && <span className="error-message">{errors.membershipType}</span>}
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={userData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                disabled={loading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={userData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Nút đăng ký */}
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>

          {/* Hiển thị lỗi chung */}
          {error && <div className="error-alert">{error}</div>}
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập ngay</Link></p>
        </div>
      </div>

      {/* ✅ Success Modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={() => window.location.href = '/login'}
        onConfirm={() => window.location.href = '/login'}
        title="Đăng ký thành công!"
        message="Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để tiếp tục."
        confirmText="Đăng nhập"
        cancelText="Đóng"
        confirmColor="primary"
      />

      <style jsx>{`
        .form-group {
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .required {
          color: #dc2626;
          font-weight: bold;
        }

        .form-input {
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-input.is-invalid {
          border-color: #dc2626;
          background-color: #fee2e2;
        }

        .form-input.is-invalid:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper .form-input {
          padding-right: 40px;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover:not(:disabled) {
          color: #333;
        }

        .password-toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-toggle-btn svg {
          width: 18px;
          height: 18px;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.8rem;
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .error-message::before {
          content: '⚠️';
          font-size: 0.75rem;
        }

        .error-alert {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 0.75rem 1rem;
          color: #dc2626;
          font-size: 0.9rem;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Register;