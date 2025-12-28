import React from 'react';

const LibrarianList = ({ 
  librarians, 
  loading, 
  onEdit, 
  onDelete, 
  onViewDetail, 
  userRole 
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Đang tải danh sách thủ thư...</div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(librarians) || librarians.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Không có thủ thư nào</div>
        </div>
      </div>
    );
  }

  // 🎯 Kiểm tra quyền hiển thị cột HÀNH ĐỘNG
  const showActions = onEdit || onDelete || onViewDetail;

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>USERNAME</th>
              <th>HỌ TÊN</th>
              <th>EMAIL</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>TRẠNG THÁI</th>
              {showActions && <th>HÀNH ĐỘNG</th>}
            </tr>
          </thead>
          <tbody>
            {librarians.map((librarian, index) => (
              <tr key={librarian._id || index} className="table-row">
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{librarian.username || 'N/A'}</td>
                <td className="font-medium">{librarian.fullName || 'N/A'}</td>
                <td>{librarian.email || 'N/A'}</td>
                <td>{librarian.phone || 'Chưa cập nhật'}</td>
                <td>
                  <span className={`status-badge ${
                    librarian.isActive ? 'available' : 'unavailable'
                  }`}>
                    {librarian.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                
                {/* 🎯 CHỈ hiện cột HÀNH ĐỘNG nếu có quyền */}
                {showActions && (
                  <td>
                    <div className="action-buttons">
                      {/* 🎯 NÚT CHI TIẾT */}
                      {onViewDetail && (
                        <button 
                          onClick={() => onViewDetail(librarian)}
                          className="btn-action btn-detail"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </button>
                      )}
                      
                      {/* 🎯 Nút Sửa */}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(librarian)}
                          className="btn-action btn-edit"
                          title="Sửa"
                        >
                          Sửa
                        </button>
                      )}
                      
                      {/* 🎯 Nút Xóa */}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(librarian._id, librarian.fullName)}
                          className="btn-action btn-delete"
                          title="Xóa"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarianList;