import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services';

const UserProfile = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserTransactions();
  }, []);

  const fetchUserTransactions = async () => {
    try {
      // ✅ ĐÃ CẬP NHẬT: transactionAPI -> transactionService
      const response = await transactionService.getUserTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang mượn': return 'status-badge available';
      case 'Đã trả': return 'status-badge returned';
      case 'Quá hạn': return 'status-badge unavailable';
      default: return 'status-badge';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h2>

      {/* Thông tin user */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Họ tên:</label>
            <p>{user?.fullName}</p>
          </div>
          <div>
            <label className="font-medium">Email:</label>
            <p>{user?.email}</p>
          </div>
          <div>
            <label className="font-medium">Tên đăng nhập:</label>
            <p>{user?.username}</p>
          </div>
          <div>
            <label className="font-medium">Vai trò:</label>
            <p>
              {user?.role === 'admin' ? 'Quản trị viên' : 
               user?.role === 'librarian' ? 'Thủ thư' : 'Độc giả'}
            </p>
          </div>
          {user?.memberCode && (
            <div>
              <label className="font-medium">Mã độc giả:</label>
              <p>{user?.memberCode}</p>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default UserProfile;