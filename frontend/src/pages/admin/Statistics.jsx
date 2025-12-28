import React, { useState, useEffect } from 'react';
import statisticsAPI from '../../services/statisticsService';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import Loading from '../../components/common/Loading';
import './statistics.css';

const Statistics = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books'); // 'books' hoặc 'members'

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const fetchAllStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statisticsAPI.getAllStatistics();
      
      if (result.success) {
        setPopularBooks(result.data.popularBooks);
        setActiveMembers(result.data.activeMembers);
      } else {
        setError('Không thể tải dữ liệu thống kê');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>📊 Thống kê & Báo cáo</h1>
        <p>Xem thông tin chi tiết về sách phổ biến và độc giả tích cực</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchAllStatistics} className="btn-retry">
            Tải lại
          </button>
        </div>
      )}

      <div className="statistics-container">
        {/* TAB NAVIGATION */}
        <div className="statistics-tabs">
          <button
            className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <span>📚</span> Sách phổ biến nhất
          </button>
          <button
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <span>👥</span> Độc giả tích cực nhất
          </button>
        </div>

        {/* CONTENT */}
        <div className="statistics-content">
          {/* TAB 1: POPULAR BOOKS */}
          {activeTab === 'books' && (
            <div className="tab-content active">
              <StatisticsChart
                title="📈 Top 10 Sách Được Mượn Nhiều Nhất"
                data={popularBooks}
                dataKey="borrowCount"
                nameKey="title"
                color="#3b82f6"
              />
              
              {/* BẢNG CHI TIẾT SÁCH */}
              <div className="statistics-table-section">
                <h3>Chi tiết sách phổ biến</h3>
                <div className="table-wrapper">
                  <table className="statistics-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên sách</th>
                        <th>Tác giả</th>
                        <th>Số lần mượn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularBooks.length > 0 ? (
                        popularBooks.map((book, index) => (
                          <tr key={book._id}>
                            <td>
                              <span className="rank-badge">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                              </span>
                            </td>
                            <td className="book-title">{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                              <span className="count-badge">{book.borrowCount}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">Không có dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE MEMBERS */}
          {activeTab === 'members' && (
            <div className="tab-content active">
              <StatisticsChart
                title="📈 Top 10 Độc Giả Tích Cực Nhất"
                data={activeMembers}
                dataKey="borrowCount"
                nameKey="name"
                color="#10b981"
              />

              {/* BẢNG CHI TIẾT ĐỘCGIẢ */}
              <div className="statistics-table-section">
                <h3>Chi tiết độc giả tích cực</h3>
                <div className="table-wrapper">
                  <table className="statistics-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên độc giả</th>
                        <th>Email</th>
                        <th>Loại thành viên</th>
                        <th>Số lần mượn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeMembers.length > 0 ? (
                        activeMembers.map((member, index) => (
                          <tr key={member._id}>
                            <td>
                              <span className="rank-badge">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                              </span>
                            </td>
                            <td className="member-name">{member.name}</td>
                            <td>{member.email}</td>
                            <td>
                              <span className="type-badge">{member.membershipType}</span>
                            </td>
                            <td>
                              <span className="count-badge">{member.borrowCount}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">Không có dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REFRESH BUTTON */}
      <div className="statistics-footer">
        <button onClick={fetchAllStatistics} className="btn btn-primary">
          🔄 Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default Statistics;