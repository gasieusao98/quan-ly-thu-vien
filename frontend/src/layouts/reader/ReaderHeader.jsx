// layouts/reader/ReaderHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import './ReaderHeader.css';

const ReaderHeader = ({ onLogoutClick }) => {
  const { user } = useAuth();
  const { state, actions } = useAppContext();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className={`reader-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo bên trái */}
        <div className="header-logo">
          <div className="logo-icon">TL</div>
          <Link to="/" className="logo">
            Thư Viện Sách
          </Link>
        </div>
        
        {/* Các nút chức năng bên phải */}
        <div className="header-controls">
          <div className="user-info">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <span className="greeting">Xin chào, {user?.fullName || user?.username || 'Độc giả'}</span>
          </div>
          
          <button
            onClick={actions.toggleTheme}
            className="theme-toggle"
            aria-label={`Chuyển sang chế độ ${state.theme === 'light' ? 'tối' : 'sáng'}`}
          >
            {state.theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            onClick={onLogoutClick} 
            className="logout-btn"
            title="Đăng xuất"
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ReaderHeader;