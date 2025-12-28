import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onLogoutClick }) => {
  const { user } = useAuth();

  const adminMenu = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/books', name: 'Quản lý sách', icon: '📚' },
    { path: '/members', name: 'Quản lý thành viên', icon: '👥' },
    { path: '/librarians', name: 'Quản lý thủ thư', icon: '👨‍💼' },
    { path: '/transactions', name: 'Giao dịch mượn trả', icon: '🔄' },
    { path: '/reservations', name: 'Quản lý đặt trước', icon: '📋' },
    { path: '/statistics', name: 'Thống kê & Báo cáo', icon: '📈' }, // 🆕 THÊM
    { path: '/profile', name: 'Thông tin cá nhân', icon: '👤' }
  ];

  const librarianMenu = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/books', name: 'Quản lý sách', icon: '📚' },
    { path: '/members', name: 'Quản lý thành viên', icon: '👥' },
    { path: '/transactions', name: 'Giao dịch mượn trả', icon: '🔄' },
    { path: '/reservations', name: 'Quản lý đặt trước', icon: '📋' },
    { path: '/statistics', name: 'Thống kê & Báo cáo', icon: '📈' }, // 🆕 THÊM
    { path: '/profile', name: 'Thông tin cá nhân', icon: '👤' }
  ];

  const readerMenu = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/books', name: 'Danh sách sách', icon: '📚' },
    { path: '/history', name: 'Lịch sử mượn sách', icon: '📖' },
    { path: '/reservations', name: 'Sách đã đặt trước', icon: '📋' },
    { path: '/profile', name: 'Thông tin cá nhân', icon: '👤' }
  ];

  const getMenuByRole = () => {
    switch (user?.role) {
      case 'admin': return adminMenu;
      case 'librarian': return librarianMenu;
      case 'reader': return readerMenu;
      default: return readerMenu;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 className="sidebar-logo-text">📖 Thư Viện</h2>
        <div className="sidebar-user-info">
          Xin chào, {user?.fullName || user?.username}
        </div>
        <div className="sidebar-user-role">
          Vai trò: {user?.role === 'admin' ? 'Quản trị viên' : 
                   user?.role === 'librarian' ? 'Thủ thư' : 'Độc giả'}
        </div>
      </div>

      <nav className="sidebar-nav">
        {getMenuByRole().map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.name}</span>
          </NavLink>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={onLogoutClick}
          className="sidebar-logout-btn"
        >
          <span className="sidebar-nav-icon">🚪</span>
          <span className="sidebar-nav-text">Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;