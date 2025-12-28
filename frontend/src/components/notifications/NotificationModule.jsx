import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './NotificationModule.css';

const NotificationModule = () => {
  const [upcomingBorrowings, setUpcomingBorrowings] = useState([]);
  const [overdueBorrowings, setOverdueBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sentEmails, setSentEmails] = useState([]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [upcomingRes, overdueRes] = await Promise.all([
        notificationService.getUpcomingDue(),
        notificationService.getOverdue()
      ]);

      setUpcomingBorrowings(upcomingRes.data.data || []);
      setOverdueBorrowings(overdueRes.data.data || []);
    } catch (error) {
      setErrorMessage('Lỗi khi tải dữ liệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Gửi thông báo cho 1 giao dịch
  const handleSendNotification = async (transaction, type) => {
    try {
      const res = await notificationService.sendNotification(transaction._id, type);
      
      setSentEmails([...sentEmails, {
        id: Date.now(),
        email: transaction.memberSnapshot?.email || transaction.memberId?.email,
        recipient: transaction.memberSnapshot?.name || transaction.memberId?.name,
        bookTitle: transaction.bookSnapshot?.title || transaction.bookId?.title,
        sentTime: new Date().toLocaleString('vi-VN'),
        type
      }]);

      setSuccessMessage(`✓ Gửi thông báo cho ${transaction.memberSnapshot?.name || transaction.memberId?.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Lỗi khi gửi thông báo');
      console.error(error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Gửi tất cả thông báo sắp hạn
  const handleSendAllReminders = async () => {
    if (!window.confirm('Bạn có chắc muốn gửi thông báo cho tất cả sách sắp hạn?')) return;
    
    setLoading(true);
    try {
      const res = await notificationService.sendBulkReminders();
      setSuccessMessage(`✓ Gửi thành công ${res.data.data.successCount} thông báo`);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Lỗi khi gửi thông báo hàng loạt');
      console.error(error);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Gửi tất cả thông báo quá hạn
  const handleSendAllOverdue = async () => {
    if (!window.confirm('Bạn có chắc muốn gửi cảnh báo quá hạn cho tất cả sách?')) return;
    
    setLoading(true);
    try {
      const res = await notificationService.sendBulkOverdue();
      setSuccessMessage(`✓ Gửi thành công ${res.data.data.successCount} cảnh báo`);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Lỗi khi gửi cảnh báo hàng loạt');
      console.error(error);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="notification-module">
      {/* Header */}
      <div className="notification-header">
        <h2>📧 Quản lý Thông báo Hạn Trả Sách</h2>
        <p>Gửi nhắc nhở đến độc giả qua email</p>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="alert-close">&times;</button>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="alert-close">&times;</button>
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{upcomingBorrowings.length}</div>
          <div className="stat-label">Sắp hạn (&lt;3 ngày)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overdueBorrowings.length}</div>
          <div className="stat-label">Quá hạn</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sentEmails.length}</div>
          <div className="stat-label">Email đã gửi</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Sắp hạn ({upcomingBorrowings.length})
        </button>
        <button
          className={`tab ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          ⚠️ Quá hạn ({overdueBorrowings.length})
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          ✉️ Lịch sử gửi ({sentEmails.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'upcoming' && (
          <div className="upcoming-section">
            <div className="section-header">
              <h3>Sách sắp đến hạn trả</h3>
              <button
                className="btn btn-primary"
                onClick={handleSendAllReminders}
                disabled={loading || upcomingBorrowings.length === 0}
              >
                Gửi tất cả ({upcomingBorrowings.length})
              </button>
            </div>

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : upcomingBorrowings.length === 0 ? (
              <div className="empty-state">Không có sách sắp hạn</div>
            ) : (
              <div className="borrowing-list">
                {upcomingBorrowings.map((borrowing) => (
                  <div key={borrowing._id} className="borrowing-item upcoming">
                    <div className="borrowing-info">
                      <div className="book-title">
                        📖 {borrowing.bookSnapshot?.title || borrowing.bookId?.title}
                      </div>
                      <div className="member-info">
                        👤 {borrowing.memberSnapshot?.name || borrowing.memberId?.name}
                        <br />
                        📧 {borrowing.memberSnapshot?.email || borrowing.memberId?.email}
                      </div>
                      <div className="date-info">
                        Hạn trả: <strong>{formatDate(borrowing.dueDate)}</strong>
                        <span className="days-left">
                          Còn {getDaysUntilDue(borrowing.dueDate)} ngày
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-send"
                      onClick={() => handleSendNotification(borrowing, 'REMINDER')}
                    >
                      Gửi
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overdue' && (
          <div className="overdue-section">
            <div className="section-header">
              <h3>Sách quá hạn trả</h3>
              <button
                className="btn btn-danger"
                onClick={handleSendAllOverdue}
                disabled={loading || overdueBorrowings.length === 0}
              >
                Gửi cảnh báo ({overdueBorrowings.length})
              </button>
            </div>

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : overdueBorrowings.length === 0 ? (
              <div className="empty-state">Không có sách quá hạn</div>
            ) : (
              <div className="borrowing-list">
                {overdueBorrowings.map((borrowing) => {
                  const daysOverdue = Math.abs(getDaysUntilDue(borrowing.dueDate));
                  const fine = daysOverdue * 5000;
                  return (
                    <div key={borrowing._id} className="borrowing-item overdue">
                      <div className="borrowing-info">
                        <div className="book-title">
                          📖 {borrowing.bookSnapshot?.title || borrowing.bookId?.title}
                        </div>
                        <div className="member-info">
                          👤 {borrowing.memberSnapshot?.name || borrowing.memberId?.name}
                          <br />
                          📧 {borrowing.memberSnapshot?.email || borrowing.memberId?.email}
                        </div>
                        <div className="date-info">
                          <strong>Hạn trả:</strong> {formatDate(borrowing.dueDate)}
                          <br />
                          <span className="overdue-badge">
                            ⚠️ Quá hạn {daysOverdue} ngày
                          </span>
                          <br />
                          <span className="fine-badge">
                            💰 Phạt: {fine.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleSendNotification(borrowing, 'OVERDUE')}
                      >
                        Gửi cảnh báo
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Lịch sử email đã gửi</h3>
            {sentEmails.length === 0 ? (
              <div className="empty-state">Chưa gửi email nào</div>
            ) : (
              <div className="email-history">
                {sentEmails.map((email) => (
                  <div key={email.id} className="email-item">
                    <div className="email-info">
                      <div className="email-recipient">
                        <strong>{email.recipient}</strong>
                        <small>{email.email}</small>
                      </div>
                      <div className="email-book">
                        📖 {email.bookTitle}
                      </div>
                      <div className="email-time">
                        🕐 {email.sentTime}
                      </div>
                    </div>
                    <span className={`email-type ${email.type === 'REMINDER' ? 'reminder' : 'overdue'}`}>
                      {email.type === 'REMINDER' ? '📅 Nhắc nhở' : '⚠️ Quá hạn'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModule;