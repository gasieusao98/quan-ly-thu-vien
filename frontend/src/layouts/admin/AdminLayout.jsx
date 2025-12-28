import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { state, actions } = useAppContext();
  const { logout } = useAuth();
  
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      setShowConfirmLogout(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={actions.toggleSidebar}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${state.sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          onLogoutClick={() => setShowConfirmLogout(true)}
        />
      </div>

      {/* Overlay cho mobile */}
      {state.sidebarOpen && (
        <div 
          className="modal-overlay"
          onClick={actions.closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="main-content">
        <Header />
        
        <main className="page-content" onClick={actions.closeSidebar}>
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Confirm Logout Modal */}
      <ConfirmModal
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={handleConfirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        confirmColor="danger"
        loading={isLoggingOut}
      />
    </div>
  );
};

export default AdminLayout;