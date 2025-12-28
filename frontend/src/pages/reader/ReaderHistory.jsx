// ReaderHistory.jsx - Fixed Layout Order
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import TransactionDetailModal from '../../components/transactions/TransactionDetailModal';
import './ReaderHistory.css';

const ReaderHistory = () => {
  const { state, actions } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // 🆕 THÊM STATE CHO MODAL
  const userTransactions = state.userTransactions || [];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        console.log('📖 Fetching user transactions for reader...');
        setError(null);
        await actions.fetchUserTransactions();
      } catch (err) {
        console.error('❌ Error fetching transactions:', err);
        console.error('Error details:', err.response?.data);
        setError(err.response?.data?.message || err.message || 'Không thể tải lịch sử mượn sách');
      }
    };

    loadTransactions();
  }, [actions]);

  // 🆕 HÀM XỬ LÝ XEM CHI TIẾT
  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // 🆕 HÀM ĐÓNG MODAL
  const handleCloseDetail = () => {
    setSelectedTransaction(null);
  };

  // Filter transactions
  const filteredTransactions = userTransactions.filter(transaction => {
    // Status filter
    if (filter !== 'all' && transaction.status !== filter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const bookTitle = transaction.bookId?.title?.toLowerCase() || '';
      const author = transaction.bookId?.author?.toLowerCase() || '';
      return bookTitle.includes(searchTerm.toLowerCase()) || 
             author.includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang mượn':
        return 'status-badge available';
      case 'Đã trả':
        return 'status-badge returned';
      case 'Quá hạn':
        return 'status-badge unavailable';
      default:
        return 'status-badge';
    }
  };

  // 🆕 SỬA HÀM NÀY - CHỈ CÒN NÚT CHI TIẾT
  const getActionButton = (transaction) => {
    return (
      <button 
        className="btn-action btn-detail"
        onClick={() => handleViewDetail(transaction)}
        title="Xem chi tiết giao dịch"
      >
        Chi tiết
      </button>
    );
  };

  // Show loading state
  if (state.loading && userTransactions.length === 0) {
    return (
      <div className="reader-history d-flex flex-column min-vh-100">
        <header className="bg-white shadow-sm border-bottom py-4">
          <div className="container-fluid">
            <h1 className="h2 fw-bold text-primary mb-0">Lịch sử mượn sách</h1>
          </div>
        </header>
        <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="text-muted">Đang tải lịch sử mượn sách...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="reader-history d-flex flex-column min-vh-100">
        <header className="bg-white shadow-sm border-bottom py-4">
          <div className="container-fluid">
            <h1 className="h2 fw-bold text-primary mb-0">Lịch sử mượn sách</h1>
          </div>
        </header>
        <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <div className="text-center">
            <div className="display-1 text-warning mb-3">⚠️</div>
            <h3 className="h4 text-muted mb-3">Có lỗi xảy ra</h3>
            <p className="text-muted mb-4">{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setError(null);
                actions.fetchUserTransactions().catch(err => {
                  setError(err.response?.data?.message || 'Không thể tải lịch sử mượn sách');
                });
              }}
            >
              Thử lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="reader-history d-flex flex-column min-vh-100">
      {/* 🆕 THÊM MODAL CHI TIẾT */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={handleCloseDetail}
      />

      {/* Header - PHẢI Ở TRÊN CÙNG */}
      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">Lịch sử mượn sách</h1>
            </div>
            <div className="col-auto">
              <span className="text-muted">
                Tổng: <strong>{filteredTransactions.length}</strong> bản ghi
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters - TIẾP THEO */}
      <div className="bg-light border-bottom py-3">
        <div className="container-fluid">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <label htmlFor="status-filter" className="form-label fw-semibold text-muted mb-0">
                  Lọc theo trạng thái:
                </label>
                <select
                  id="status-filter"
                  className="form-select"
                  style={{ width: '160px' }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="Đang mượn">Đang mượn</option>
                  <option value="Đã trả">Đã trả</option>
                  <option value="Quá hạn">Quá hạn</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 justify-content-md-end">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm theo tên sách hoặc tác giả..." 
                  style={{ maxWidth: '300px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content - CUỐI CÙNG */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          {filteredTransactions.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center py-5 bg-white rounded-3 border">
                  <div className="display-1 text-muted mb-4">📖</div>
                  <h3 className="h4 text-muted mb-3">
                    {filter === 'all' && !searchTerm
                      ? 'Bạn chưa mượn sách nào'
                      : 'Không có kết quả phù hợp'
                    }
                  </h3>
                  <p className="text-muted mb-0">
                    {filter === 'all' && !searchTerm
                      ? 'Hãy bắt đầu mượn sách để xem lịch sử tại đây'
                      : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Ngày trả</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={transaction._id}>
                        <td>{index + 1}</td>
                        <td className="font-medium">
                          {transaction.bookId?.title || 'Không có thông tin'}
                        </td>
                        <td>
                          <div className="text-dark">{transaction.bookId?.author || 'N/A'}</div>
                        </td>
                        <td>{new Date(transaction.borrowDate).toLocaleDateString('vi-VN')}</td>
                        <td>{new Date(transaction.dueDate).toLocaleDateString('vi-VN')}</td>
                        <td>
                          {/* ✅ FIX: Dùng actualReturnDate thay vì returnDate */}
                          {transaction.actualReturnDate ? (
                            <span className="text-success">
                              {new Date(transaction.actualReturnDate).toLocaleDateString('vi-VN')}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td>
                          <span className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {/* 🆕 CHỈ CÒN NÚT CHI TIẾT */}
                            <button 
                              className="btn-action btn-detail"
                              onClick={() => handleViewDetail(transaction)}
                              title="Xem chi tiết giao dịch"
                            >
                              Chi tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReaderHistory;