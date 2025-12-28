import React from 'react';
import { useAppContext } from '../../contexts/AppContext'; // SỬA: useAppContext thay vì useApp

const Header = () => {
  const { state, actions } = useAppContext(); // SỬA: useAppContext()

  return (
    <header className="header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hệ Thống Quản Lý Thư Viện</h1>
          <p className="text-gray-600">Quản lý sách, thành viên và giao dịch mượn trả</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={actions.toggleTheme} // SỬA: actions.toggleTheme
            className="theme-toggle-btn"
            aria-label={`Chuyển sang chế độ ${state.theme === 'light' ? 'tối' : 'sáng'}`}
          >
            {state.theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <div className="header-date text-gray-500">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;