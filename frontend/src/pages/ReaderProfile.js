import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const ReaderDashboard = () => {
  const { state } = useAppContext();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Thư Viện Sách</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Xin chào, {user?.name || 'Độc giả'}</span>
              <Link to="/reader/profile" className="text-blue-600 hover:text-blue-800">
                Tài khoản
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link to="/reader" className="py-3 px-2 hover:bg-blue-700 border-b-2 border-white">
              Trang chủ
            </Link>
            <Link to="/reader/books" className="py-3 px-2 hover:bg-blue-700">
              Danh mục sách
            </Link>
            <Link to="/reader/history" className="py-3 px-2 hover:bg-blue-700">
              Lịch sử mượn
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Chào mừng đến với Thư Viện
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá kho sách đa dạng và quản lý lịch sử mượn của bạn
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{state.stats.totalBooks || 0}</div>
            <div className="text-gray-600">Tổng số sách</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{state.stats.books?.available || 0}</div>
            <div className="text-gray-600">Sách có sẵn</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-orange-600">{state.userTransactions.length}</div>
            <div className="text-gray-600">Lượt mượn của bạn</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/reader/books" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">📚</div>
              <div>
                <h3 className="font-semibold text-lg">Tìm sách</h3>
                <p className="text-gray-600">Khám phá kho sách đa dạng</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/reader/history" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">📖</div>
              <div>
                <h3 className="font-semibold text-lg">Lịch sử mượn</h3>
                <p className="text-gray-600">Xem sách đã mượn và đang mượn</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ReaderDashboard;