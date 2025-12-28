import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services';
import ConfirmModal from '../common/ConfirmModal';
import ReservationModal from '../books/ReservationDetailModal';

const ReservationList = ({ isAdmin = false, searchTerm = '', statusFilter = 'all', onResultsCount }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      cancelled: 'Đã hủy',
      fulfilled: 'Đã hoàn thành',
      expired: 'Hết hạn'
    };
    return statusMap[status] || status;
  };

  const filteredReservations = reservations.filter(reservation => {
    if (searchTerm) {
      const bookTitle = reservation.book?.title?.toLowerCase() || '';
      const author = reservation.book?.author?.toLowerCase() || '';
      const memberName = reservation.member?.name?.toLowerCase() || '';
      
      const matchesSearch = bookTitle.includes(searchTerm.toLowerCase()) || 
             author.includes(searchTerm.toLowerCase()) ||
             memberName.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    if (statusFilter !== 'all') {
      const reservationStatusText = getStatusText(reservation.status);
      if (reservationStatusText !== statusFilter) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (onResultsCount) {
      onResultsCount(filteredReservations.length);
    }
  }, [filteredReservations, onResultsCount]);

  const fetchReservations = async () => {
    try {
      const response = isAdmin 
        ? await reservationService.getAll()
        : await reservationService.getMyReservations();
      
      setReservations(response.data.data || []);
    } catch (error) {
      setError('Lỗi khi tải danh sách đặt trước');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (reservationId) => {
    setCancelingId(reservationId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelingId) return;

    setIsCanceling(true);
    try {
      await reservationService.cancel(cancelingId);
      fetchReservations();
      setShowCancelModal(false);
      setCancelingId(null);
    } catch (error) {
      alert('Hủy đặt trước thất bại');
      setIsCanceling(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await reservationService.updateStatus(reservationId, { status: newStatus });
      fetchReservations();
    } catch (error) {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleViewNotes = (reservation) => {
    setSelectedReservation(reservation);
    setShowNoteModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailModal(false);
    setShowNoteModal(false);
    setSelectedReservation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge available';      // Xanh dương
      case 'approved':
        return 'status-badge returned';       // Xanh lá  
      case 'cancelled':
        return 'status-badge unavailable';    // Đỏ
      case 'fulfilled':
        return 'status-badge completed';      // Tím
      case 'expired':
        return 'status-badge expired';        // Xám
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="card reservations-loading-card">
        <div className="text-center py-8">
          <div className="loading-text">Đang tải danh sách đặt trước...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mb-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {filteredReservations.length === 0 ? (
        <div className="card reservations-empty-card">
          <div className="text-center py-8">
            <div className="empty-text">
              {searchTerm || statusFilter !== 'all' 
                ? 'Không tìm thấy đặt trước phù hợp'
                : isAdmin ? 'Không có đặt trước nào' : 'Chưa có đặt trước nào'
              }
            </div>
            {(searchTerm || statusFilter !== 'all') && (
              <p className="empty-hint mt-2">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="card reservations-table-card">
          {(searchTerm || statusFilter !== 'all') && (
            <div className="card-header reservations-table-header">
              <div className="d-flex justify-content-between align-items-center">
                <span className="results-count">
                  Tìm thấy <strong>{filteredReservations.length}</strong> kết quả phù hợp
                </span>
                <button 
                  className="btn btn-sm btn-outline-secondary show-all-btn"
                  onClick={() => window.location.reload()}
                >
                  Hiển thị tất cả
                </button>
              </div>
            </div>
          )}
          <div className="table-container">
            <table className="table reservations-table">
              <thead>
                <tr>
                  <th className="reservations-th">STT</th>
                  <th className="reservations-th">Tên sách</th>
                  {isAdmin && <th className="reservations-th">Thành viên</th>}
                  <th className="reservations-th">Ngày đặt</th>
                  <th className="reservations-th">Hết hạn</th>
                  <th className="reservations-th">Trạng thái</th>
                  <th className="reservations-th">Ghi chú</th>
                  <th className="reservations-th">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation, index) => (
                  <tr key={reservation._id} className="reservations-tr">
                    <td className="reservations-td">{index + 1}</td>
                    <td className="reservations-td font-medium">
                      <div className="book-title">{reservation.book?.title}</div>
                      <div className="book-author">
                        {reservation.book?.author}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="reservations-td">
                        <div className="member-name">{reservation.member?.name}</div>
                        <div className="member-code">
                          {reservation.member?.memberCode}
                        </div>
                      </td>
                    )}
                    <td className="reservations-td">{new Date(reservation.reservationDate).toLocaleDateString('vi-VN')}</td>
                    <td className="reservations-td">{new Date(reservation.expiryDate).toLocaleDateString('vi-VN')}</td>
                    <td className="reservations-td">
                      <span className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="reservations-td">
                      {reservation.notes ? (
                        <button 
                          className="btn-action btn-notes"
                          onClick={() => handleViewNotes(reservation)}
                          title="Xem ghi chú"
                        >
                          📝
                        </button>
                      ) : (
                        <span className="notes-empty">-</span>
                      )}
                    </td>
                    <td className="reservations-td">
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-detail"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          Chi tiết
                        </button>

                        {!isAdmin && reservation.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelClick(reservation._id)}
                            className="btn-action btn-cancel"
                          >
                            Hủy
                          </button>
                        )}

                        {isAdmin && reservation.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(reservation._id, 'approved')}
                              className="btn-action btn-approve"
                            >
                              Duyệt
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                              className="btn-action btn-reject"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {isAdmin && reservation.status === 'approved' && (
                          <button 
                            onClick={() => handleStatusUpdate(reservation._id, 'fulfilled')}
                            className="btn-action btn-confirm"
                          >
                            Xác nhận mượn
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đặt trước"
        message="Bạn có chắc muốn hủy đặt trước này?"
        confirmText="Hủy đặt trước"
        cancelText="Quay lại"
        confirmColor="danger"
        loading={isCanceling}
      />

      {/* Modal chi tiết đặt trước */}
      {showDetailModal && selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={handleCloseModals}
        />
      )}

      {/* Modal ghi chú */}
      {showNoteModal && selectedReservation && (
        <div 
          className="modal fade show d-block notes-modal" 
          tabIndex="-1"
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div 
                className="modal-header border-0 notes-modal-header"
              >
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-sticky-note me-2"></i>
                  Ghi chú
                </h5>
                <button 
                  type="button" 
                  className="btn-close notes-modal-close"
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body notes-modal-body">
                <div className="notes-content">
                  <p className="mb-0">
                    {selectedReservation.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;