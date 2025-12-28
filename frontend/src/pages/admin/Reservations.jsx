import React, { useState } from 'react';
import ReservationList from '../../components/reservations/ReservationList';

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resultsCount, setResultsCount] = useState(0); // 🆕 Thêm state để lưu số lượng kết quả

  // Danh sách trạng thái đặt trước
  const statusOptions = [
    'Tất cả trạng thái',
    'Chờ duyệt',
    'Đã duyệt', 
    'Đã hủy',
    'Đã hoàn thành',
    'Hết hạn'
  ];

  // 🆕 Hàm callback để nhận số lượng kết quả từ ReservationList
  const handleResultsCount = (count) => {
    setResultsCount(count);
  };

  return (
    <div className="admin-reservations d-flex flex-column min-vh-100">
      {/* Page Header với Bootstrap */}
      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">Quản lý Đặt trước Sách</h1>
              <p className="text-muted mb-0">Theo dõi và xử lý các yêu cầu đặt trước sách từ độc giả</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Section */}
      <div className="bg-light border-bottom py-3">
        <div className="container-fluid">
          <div className="row g-3 align-items-end">
            {/* Search Input */}
            <div className="col-md-6">
              <label htmlFor="reservation-search" className="form-label fw-semibold text-muted mb-2">
                <i className="fas fa-search me-2"></i>Tìm kiếm đặt trước
              </label>
              <div className="d-flex align-items-center gap-2">
                <input
                  id="reservation-search"
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo tên sách, tác giả hoặc thành viên..."
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

            {/* Status Filter */}
            <div className="col-md-4">
              <label htmlFor="status-filter" className="form-label fw-semibold text-muted mb-2">
                <i className="fas fa-filter me-2"></i>Lọc theo trạng thái
              </label>
              <select
                id="status-filter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status === 'Tất cả trạng thái' ? 'all' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Counter - 🎯 ĐÃ SỬA: Hiển thị số lượng thực tế */}
            <div className="col-md-2">
              <div className="text-center p-2 bg-white rounded border">
                <small className="text-muted d-block">Kết quả</small>
                <strong className="text-primary">{resultsCount}</strong>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="row mt-3">
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">Bộ lọc đang áp dụng:</small>
                  
                  {searchTerm && (
                    <span className="badge bg-primary">
                      <i className="fas fa-search me-1"></i>
                      Tìm kiếm: "{searchTerm}"
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setSearchTerm('')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                  
                  {statusFilter !== 'all' && (
                    <span className="badge bg-success">
                      <i className="fas fa-filter me-1"></i>
                      Trạng thái: {statusFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setStatusFilter('all')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reservation List */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <ReservationList 
                isAdmin={true} 
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onResultsCount={handleResultsCount} // 🆕 Truyền callback function
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reservations;