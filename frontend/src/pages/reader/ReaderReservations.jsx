import React, { useState, useEffect } from 'react';
import ReservationList from '../../components/reservations/ReservationList';
import { reservationService } from '../../services';
import './ReaderReservations.css';

const ReaderReservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservationsCount, setReservationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch số lượng reservations
    const fetchReservationsCount = async () => {
      try {
        setLoading(true);
        const response = await reservationService.getMyReservations();
        const reservations = response.data.data || [];
        setReservationsCount(reservations.length);
      } catch (error) {
        console.error('Error fetching reservations count:', error);
        setReservationsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsCount();
  }, []);

  return (
    <div className="reader-reservations d-flex flex-column min-vh-100">
      {/* Page Header */}
      <header className="reader-reservations-header shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold mb-0 reservations-title">Sách đã đặt trước</h1>
              <p className="mb-0 reservations-subtitle">Theo dõi trạng thái các sách bạn đã đặt trước</p>
            </div>
            <div className="col-auto">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              ) : (
                <span className="reservations-count">
                  Tổng: <strong>{reservationsCount}</strong> bản ghi
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="reader-reservations-search border-bottom py-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 offset-md-6">
              <div className="d-flex align-items-center gap-2 justify-content-md-end">
                <input 
                  type="text" 
                  className="form-control reservations-search-input" 
                  placeholder="Tìm theo tên sách hoặc tác giả..." 
                  style={{ maxWidth: '300px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary reservations-clear-btn"
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

      {/* Reservation List */}
      <main className="reader-reservations-main flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <ReservationList 
                isAdmin={false} 
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReaderReservations;