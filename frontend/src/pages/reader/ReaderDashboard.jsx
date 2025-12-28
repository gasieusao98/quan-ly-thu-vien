// ReaderDashboard.jsx - Bootstrap Standard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import './ReaderDashboard.css';

const ReaderDashboard = () => {
  const { state, actions } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await actions.fetchStats();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [actions]);

  const statsData = state.stats?.userStats || {
    availableBooks: 0,
    currentBorrows: 0,
    totalBorrows: 0,
    overdueBooks: 0
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{height: '60vh'}}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Đang tải dữ liệu thư viện...</p>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* 🎯 HERO WELCOME SECTION */}
      <section className="hero-section text-white py-5">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">
                <span className="d-block fs-2 fw-normal opacity-90 mb-2">Xin chào!</span>
                <span className="hero-gradient">Chào mừng trở lại thư viện</span>
              </h1>
              <p className="lead mb-4">
                Hôm nay bạn có <strong>{statsData.currentBorrows} sách</strong> đang mượn 
                và <strong>{statsData.availableBooks} sách</strong> đang chờ bạn khám phá
              </p>
              <div className="d-flex gap-2 flex-wrap mb-4">
                <span className="badge bg-light text-dark">
                  <i className="fas fa-book me-1"></i>
                  {state.stats?.totalBooks || 0}+ đầu sách
                </span>
                <span className="badge bg-light text-dark">
                  <i className="fas fa-user-edit me-1"></i>
                  500+ tác giả
                </span>
                <span className="badge bg-light text-dark">
                  <i className="fas fa-tags me-1"></i>
                  50+ thể loại
                </span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/books" className="btn btn-light btn-lg fw-bold">
                <i className="fas fa-search me-2"></i>
                Khám phá sách ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 QUICK STATS SECTION */}
      <section className="py-5">
        <div className="container-fluid">
          <div className="row g-4">
            {/* Available Books */}
            <div className="col-xl-3 col-md-6">
              <div className="card border-start border-4 border-primary h-100 shadow-sm stat-card" data-stat="primary">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-bold">Sách có sẵn</p>
                      <h3 className="display-5 fw-bold mb-0">{statsData.availableBooks}</h3>
                    </div>
                    <div className="stat-icon-badge bg-primary bg-opacity-10">
                      <i className="fas fa-book-open text-primary fs-5"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-sync-alt me-1"></i>
                      Luôn cập nhật
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Borrowing */}
            <div className="col-xl-3 col-md-6">
              <div className="card border-start border-4 border-info h-100 shadow-sm stat-card" data-stat="info">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-bold">Đang mượn</p>
                      <h3 className="display-5 fw-bold mb-0">{statsData.currentBorrows}</h3>
                    </div>
                    <div className="stat-icon-badge bg-info bg-opacity-10">
                      <i className="fas fa-book-reader text-info fs-5"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Theo dõi hạn trả
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Borrows */}
            <div className="col-xl-3 col-md-6">
              <div className="card border-start border-4 border-success h-100 shadow-sm stat-card" data-stat="success">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-bold">Đã mượn</p>
                      <h3 className="display-5 fw-bold mb-0">{statsData.totalBorrows}</h3>
                    </div>
                    <div className="stat-icon-badge bg-success bg-opacity-10">
                      <i className="fas fa-exchange-alt text-success fs-5"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-chart-line me-1"></i>
                      Tổng lượt mượn
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Books */}
            <div className="col-xl-3 col-md-6">
              <div className="card border-start border-4 border-warning h-100 shadow-sm stat-card" data-stat="warning">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <p className="text-muted mb-1 text-uppercase small fw-bold">Quá hạn</p>
                      <h3 className="display-5 fw-bold mb-0">{statsData.overdueBooks}</h3>
                    </div>
                    <div className="stat-icon-badge bg-warning bg-opacity-10">
                      <i className="fas fa-clock text-warning fs-5"></i>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Cần chú ý
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎪 MAIN CONTENT GRID */}
      <section className="py-4">
        <div className="container-fluid">
          <div className="row g-4">
            {/* Left Column - Quick Actions */}
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                  <h5 className="card-title fw-bold mb-0">
                    <i className="fas fa-bolt me-2 text-primary"></i>Thao tác nhanh
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-column gap-3">
                    {/* Search Books */}
                    <Link to="/books" className="action-link">
                      <div className="d-flex align-items-center gap-3 p-3 rounded-2 border border-0 bg-light">
                        <div className="action-icon bg-primary text-white rounded-2">
                          <i className="fas fa-search"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Tìm sách</h6>
                          <small className="text-muted">Khám phá kho sách</small>
                        </div>
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </Link>

                    {/* Borrow History */}
                    <Link to="/history" className="action-link">
                      <div className="d-flex align-items-center gap-3 p-3 rounded-2 border border-0 bg-light">
                        <div className="action-icon bg-success text-white rounded-2">
                          <i className="fas fa-history"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Lịch sử mượn</h6>
                          <small className="text-muted">Xem sách đã mượn</small>
                        </div>
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </Link>

                    {/* Reservations */}
                    <Link to="/reservations" className="action-link">
                      <div className="d-flex align-items-center gap-3 p-3 rounded-2 border border-0 bg-light">
                        <div className="action-icon bg-info text-white rounded-2">
                          <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Đặt trước</h6>
                          <small className="text-muted">Đặt sách trước</small>
                        </div>
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </Link>

                    {/* Profile */}
                    <Link to="/profile" className="action-link">
                      <div className="d-flex align-items-center gap-3 p-3 rounded-2 border border-0 bg-light">
                        <div className="action-icon bg-secondary text-white rounded-2">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">Hồ sơ</h6>
                          <small className="text-muted">Thông tin cá nhân</small>
                        </div>
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Library Overview */}
            <div className="col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                  <h5 className="card-title fw-bold mb-0">
                    <i className="fas fa-university me-2 text-primary"></i>Thư viện của chúng tôi
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-column gap-3">
                    {/* Total Books */}
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-2">
                      <div className="overview-icon bg-primary bg-opacity-25 text-primary rounded-2">
                        <i className="fas fa-book fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{state.stats?.totalBooks || 0}+</h6>
                        <small className="text-muted">Đầu sách</small>
                      </div>
                    </div>

                    {/* Authors */}
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-2">
                      <div className="overview-icon bg-success bg-opacity-25 text-success rounded-2">
                        <i className="fas fa-user-edit fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">500+</h6>
                        <small className="text-muted">Tác giả</small>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-2">
                      <div className="overview-icon bg-warning bg-opacity-25 text-warning rounded-2">
                        <i className="fas fa-tags fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">50+</h6>
                        <small className="text-muted">Thể loại</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚨 OVERDUE ALERT */}
      {statsData.overdueBooks > 0 && (
        <section className="py-4">
          <div className="container-fluid">
            <div className="alert alert-danger border-start border-4 border-danger" role="alert">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex gap-3">
                  <div>
                    <i className="fas fa-exclamation-triangle fs-5"></i>
                  </div>
                  <div>
                    <h5 className="alert-heading mb-2">Cảnh báo sách quá hạn!</h5>
                    <p className="mb-0">
                      Bạn có <strong>{statsData.overdueBooks} sách</strong> quá hạn. 
                      Vui lòng trả sách sớm để tránh phí phạt.
                    </p>
                  </div>
                </div>
                <Link to="/history" className="btn btn-outline-danger btn-sm flex-shrink-0">
                  Kiểm tra ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReaderDashboard;