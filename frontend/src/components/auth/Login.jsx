import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Tên đăng nhập hoặc email là bắt buộc';
    }

    if (!credentials.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        console.log('Login successful');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    // THÊM data-theme="light" vào container để luôn ở light mode
    <div className="auth-container" data-theme="light">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Đăng nhập hệ thống</h1>
          <p className="login-subtitle">Quản lý thư viện điện tử</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="Nhập tên đăng nhập hoặc email"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={loading}
              autoFocus
              style={{ color: '#1f2937' }} // THÊM INLINE STYLE NÀY
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
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
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ color: '#1f2937' }} // THÊM INLINE STYLE NÀY
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

          {/* Hiển thị lỗi chung */}
          {error && <div className="error-alert">{error}</div>}

          {/* Nút đăng nhập */}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Chưa có tài khoản? <a href="/register" className="auth-link">Đăng ký ngay</a></p>
          <p className="demo-info">Demo: admin / 123456</p>
        </div>
      </div>

      <style jsx>{`
        /* THÊM data-theme="light" để override dark mode */
        .auth-container[data-theme="light"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .auth-container[data-theme="light"] * {
          color: inherit !important;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937 !important; /* THÊM !important */
          margin: 0;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 0.95rem;
          color: #6b7280 !important; /* THÊM !important */
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151 !important; /* THÊM !important */
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .required {
          color: #dc2626 !important; /* THÊM !important */
          font-weight: bold;
        }

        .form-input {
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.25s ease;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          background-color: #f9fafb !important;
          color: #1f2937 !important; /* QUAN TRỌNG: Thêm màu chữ */
        }

        .form-input::placeholder {
          color: #9ca3af !important;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          color: #1f2937 !important; /* QUAN TRỌNG */
        }

        .form-input:disabled {
          background-color: #f3f4f6 !important;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-input.is-invalid {
          border-color: #ef4444;
          background-color: #fef2f2 !important;
        }

        .form-input.is-invalid:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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
          color: #9ca3af !important;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover:not(:disabled) {
          color: #4b5563 !important;
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
          color: #dc2626 !important;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: -0.4rem;
        }

        .error-message::before {
          content: '⚠️';
          font-size: 0.75rem;
        }

        .error-alert {
          background-color: #fee2e2 !important;
          border: 1px solid #fecaca !important;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          color: #dc2626 !important;
          font-size: 0.9rem;
          text-align: center;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-button {
          padding: 0.95rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none !important;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3) !important;
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb !important;
        }

        .login-footer p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
          color: #6b7280 !important;
        }

        .auth-link {
          color: #667eea !important;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #764ba2 !important;
          text-decoration: underline;
        }

        .demo-info {
          font-size: 0.8rem;
          color: #9ca3af !important;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Login;