// layouts/reader/ReaderNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ReaderNavbar.css';

const ReaderNavbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/books', label: 'Danh mục sách', icon: '📚' },
    { path: '/reservations', label: 'Sách đã đặt', icon: '📋' },
    { path: '/history', label: 'Lịch sử mượn', icon: '🕒' }
  ];

  return (
    <nav className="reader-nav">
      <div className="nav-content">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default ReaderNavbar;