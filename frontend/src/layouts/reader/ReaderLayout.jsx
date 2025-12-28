// layouts/reader/ReaderLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ReaderHeader from './ReaderHeader';
import ReaderNavbar from './ReaderNavbar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../contexts/AuthContext';
import './ReaderLayout.css';

const ReaderLayout = () => {
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
    <div className="reader-layout">
      <ReaderHeader onLogoutClick={() => setShowConfirmLogout(true)} />
      <ReaderNavbar />
      <main className="reader-main">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>

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

export default ReaderLayout;