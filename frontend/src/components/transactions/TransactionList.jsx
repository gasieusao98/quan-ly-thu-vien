import React from 'react';

const TransactionList = ({ 
  transactions, 
  loading, 
  onReturn, 
  onViewDetail, 
  onExtend,
  onSendEmail // 🆕 THÊM: Prop mới cho gửi email
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Đang tải danh sách giao dịch...</div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Không có giao dịch nào</div>
        </div>
      </div>
    );
  }

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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Đã trả') return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 🆕 THÊM: Hàm tính ngày còn lại
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 🆕 THÊM: Hàm tính phạt tạm tính (khi quá hạn)
  const calculateTemporaryFine = (dueDate, status) => {
    if (status === 'Đã trả') return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (today <= due) return 0; // Chưa quá hạn
    
    const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return daysOverdue * 5000; // 5000 VND/ngày
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Thành viên</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Phạt (VNĐ)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const daysUntilDue = getDaysUntilDue(transaction.dueDate);
              // 🆕 THÊM: Xác định có nên gửi email không (sắp hạn < 3 ngày hoặc quá hạn)
              const shouldShowEmailBtn = daysUntilDue <= 3 && transaction.status !== 'Đã trả';
              
              // 🆕 THÊM: Tính phạt tạm tính (hiển thị ngay khi quá hạn)
              const temporaryFine = calculateTemporaryFine(transaction.dueDate, transaction.status);
              const displayFine = transaction.fine > 0 ? transaction.fine : temporaryFine;
              
              return (
                <tr key={transaction._id || index}>
                  <td>{index + 1}</td>
                  <td className="font-medium">
                    {transaction.bookSnapshot?.title || transaction.bookId?.title || 'Thông tin sách'}
                  </td>
                  <td>
                    <div>
                      <div className="font-medium">
                        {transaction.memberSnapshot?.name || transaction.memberId?.name || 'Thành viên'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.memberSnapshot?.memberCode || transaction.memberId?.memberCode || '—'}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(transaction.borrowDate)}</td>
                  <td>
                    <div className={isOverdue(transaction.dueDate, transaction.status) ? 'text-red-600 font-medium' : ''}>
                      {formatDate(transaction.dueDate)}
                      {isOverdue(transaction.dueDate, transaction.status) && (
                        <div className="text-xs text-red-500">
                          Quá {getDaysOverdue(transaction.dueDate)} ngày
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(transaction.actualReturnDate) || '—'}</td>
                  <td>
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status || 'N/A'}
                    </span>
                  </td>
                  <td className={displayFine > 0 ? 'text-red-600 font-medium' : ''}>
                    {displayFine ? displayFine.toLocaleString('vi-VN') : '0'}
                    {temporaryFine > 0 && transaction.fine === 0 && (
                      <div className="text-xs text-gray-500">(tạm tính)</div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* Nút Chi tiết */}
                      <button 
                        onClick={() => onViewDetail(transaction)}
                        className="btn-action btn-detail"
                        title="Xem chi tiết"
                      >
                        <span className="btn-text">Chi tiết</span>
                      </button>
                      
                      {/* 🆕 THÊM: Nút Gửi Email - Chỉ hiện khi sắp hạn hoặc quá hạn */}
                      {shouldShowEmailBtn && (
                        <button 
                          onClick={() => onSendEmail(transaction)}
                          className="btn-action btn-email"
                          title={daysUntilDue < 0 ? "Gửi cảnh báo quá hạn" : "Gửi nhắc nhở"}
                          style={{
                            backgroundColor: daysUntilDue < 0 ? '#f5576c' : '#faad14',
                            color: 'white'
                          }}
                        >
                          <span className="btn-text">
                            {daysUntilDue < 0 ? '⚠️ Quá hạn' : '📧 Email'}
                          </span>
                        </button>
                      )}
                      
                      {/* Nút Gia hạn - Chỉ hiện khi đang mượn */}
                      {transaction.status === 'Đang mượn' && (
                        <button 
                          onClick={() => onExtend(transaction)}
                          className="btn-action btn-extend"
                          title="Gia hạn mượn sách"
                        >
                          <span className="btn-text">Gia hạn</span>
                        </button>
                      )}
                      
                      {/* Nút Trả sách - Chỉ hiện khi đang mượn hoặc quá hạn */}
                      {(transaction.status === 'Đang mượn' || transaction.status === 'Quá hạn') && (
                        <button 
                          onClick={() => onReturn(transaction)}
                          className="btn-action btn-return"
                          title="Trả sách"
                        >
                          <span className="btn-text">Trả sách</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;