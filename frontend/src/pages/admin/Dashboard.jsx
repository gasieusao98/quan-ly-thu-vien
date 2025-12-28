import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ THÊM: Import useNavigate
import { useAppContext } from '../../contexts/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { state, actions } = useAppContext();
  const { stats, books, members, loading } = state;
  const navigate = useNavigate(); // ✅ THÊM: Hook để điều hướng

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading dashboard data...');
        await actions.fetchStats();
        await actions.fetchBooks();
        await actions.fetchMembers();
        
        // Debug sau khi load xongg
        console.log('📊 Stats:', state.stats);
        console.log('📚 Books:', state.books);
        console.log('👥 Members:', state.members);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [actions]);

  // ✅ THÊM: Hàm xử lý navigation
  const handleViewAllBooks = () => {
    navigate('/books');
  };

  const handleViewAllMembers = () => {
    navigate('/members');
  };

  // ✅ THÊM: Hàm xác định trạng thái thành viên
  const getMemberStatus = (member) => {
    if (!member.status) return { text: 'Không xác định', class: 'bg-secondary' };
    
    const status = member.status.toLowerCase();
    if (status.includes('hoạt động') || status === 'active') {
      return { text: 'Hoạt động', class: 'bg-success text-white' };
    } else if (status.includes('tạm khóa') || status.includes('tạm khóa')) {
      return { text: 'Tạm khóa', class: 'bg-warning' };
    } else if (status.includes('khóa') || status === 'inactive') {
      return { text: 'Khóa', class: 'bg-danger text-white' };
    } else {
      return { text: member.status, class: 'bg-secondary' };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-modern">
        <div className="dashboard-content">
          <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
              <div className="text-muted">Đang tải dữ liệu...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-content">
        

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card books-total">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{stats.totalBooks || 0}</div>
            <div className="stat-label">Tổng số sách</div>
          </div>

          <div className="stat-card books-available">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.availableBooks || 0}</div>
            <div className="stat-label">Sách có sẵn</div>
          </div>

          <div className="stat-card books-borrowed">
            <div className="stat-icon">📖</div>
            <div className="stat-number">{stats.borrowedBooks || 0}</div>
            <div className="stat-label">Sách đang mượn</div>
          </div>

          <div className="stat-card members-total">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.totalMembers || 0}</div>
            <div className="stat-label">Thành viên</div>
          </div>
        </div>

        <div className="row">
          {/* Sách mới nhất */}
          <div className="col-lg-6 mb-4">
            <div className="recent-section">
              <div className="section-header">
                <h3>📚 Sách mới nhất</h3>
                {/* ✅ SỬA: Thay thế thẻ a bằng button với onClick */}
                <button 
                  className="view-all-btn" 
                  onClick={handleViewAllBooks}
                >
                  Xem tất cả →
                </button>
              </div>
              <div className="item-list">
                {books && books.slice(0, 5).map((book, index) => {
                  // ✅ VALIDATE: Kiểm tra dữ liệu book
                  if (!book || typeof book !== 'object') {
                    console.warn('Invalid book data:', book);
                    return null;
                  }
                  
                  return (
                    <div key={book._id || index} className="item-card">
                      <div className="item-avatar book-avatar">📖</div>
                      <div className="item-info">
                        <div className="item-title">{book.title || 'Không có tiêu đề'}</div>
                        <div className="item-subtitle">{book.author || 'Không có tác giả'}</div>
                        <div className="item-meta">{book.category || 'Không có thể loại'}</div>
                      </div>
                      <div className={`item-badge ${book.availableCopies > 0 ? 'bg-success text-white' : ''}`}>
                        {book.availableCopies || 0} có sẵn
                      </div>
                    </div>
                  );
                })}
                {(!books || books.length === 0) && (
                  <div className="text-center text-muted py-4">
                    <div className="mb-2">📚</div>
                    Chưa có sách nào trong hệ thống
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thành viên mới */}
          <div className="col-lg-6 mb-4">
            <div className="recent-section">
              <div className="section-header">
                <h3>👥 Thành viên mới</h3>
                {/* ✅ SỬA: Thay thế thẻ a bằng button với onClick */}
                <button 
                  className="view-all-btn" 
                  onClick={handleViewAllMembers}
                >
                  Xem tất cả →
                </button>
              </div>
              <div className="item-list">
                {members && members.slice(0, 5).map((member, index) => {
                  // ✅ VALIDATE: Kiểm tra dữ liệu member
                  if (!member || typeof member !== 'object') {
                    console.warn('Invalid member data:', member);
                    return null;
                  }

                  // ✅ SỬA: Sử dụng hàm getMemberStatus để xác định trạng thái
                  const memberStatus = getMemberStatus(member);
                  
                  return (
                    <div key={member._id || `member-${index}`} className="item-card">
                      <div className="item-avatar member-avatar">👤</div>
                      <div className="item-info">
                        <div className="item-title">{member.name || 'Không có tên'}</div>
                        <div className="item-subtitle">{member.email || 'Không có email'}</div>
                        <div className="item-meta">
                          Tham gia: {member.createdAt ? new Date(member.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                        </div>
                      </div>
                      {/* ✅ SỬA: Sử dụng class và text từ hàm getMemberStatus */}
                      <div className={`item-badge ${memberStatus.class}`}>
                        {memberStatus.text}
                      </div>
                    </div>
                  );
                })}
                {(!members || members.length === 0) && (
                  <div className="text-center text-muted py-4">
                    <div className="mb-2">👥</div>
                    Chưa có thành viên nào
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ĐÃ BỎ PHẦN QUICK ACTIONS */}
      </div>
    </div>
  );
};

export default Dashboard;