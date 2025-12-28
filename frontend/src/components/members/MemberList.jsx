import React from 'react';

const MemberList = ({ members, loading, onEdit, onDelete, onViewDetail, userRole }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Đang tải danh sách thành viên...</div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(members) || members.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-500">Không có thành viên nào</div>
        </div>
      </div>
    );
  }

  const showActions = onEdit || onDelete || onViewDetail;

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>MÃ THÀNH VIÊN</th>
              <th>HỌ TÊN</th>
              <th>EMAIL</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>LOẠI THÀNH VIÊN</th>
              <th>TRẠNG THÁI</th>
              {showActions && <th>HÀNH ĐỘNG</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member._id || index} className="table-row">
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{member.memberCode || 'N/A'}</td>
                <td className="font-medium">{member.name || 'N/A'}</td>
                <td>{member.email || 'N/A'}</td>
                <td>{member.phone || 'N/A'}</td>
                <td>{member.membershipType || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${
                    member.status === 'Đang hoạt động' ? 'available' : 'unavailable'
                  }`}>
                    {member.status || 'N/A'}
                  </span>
                </td>
                
                {showActions && (
                  <td>
                    <div className="action-buttons">
                      {onViewDetail && (
                        <button 
                          onClick={() => onViewDetail(member)}
                          className="btn-action btn-detail"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </button>
                      )}
                      
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(member)}
                          className="btn-action btn-edit"
                          title="Sửa"
                        >
                          Sửa
                        </button>
                      )}
                      
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(member._id, member.name)}
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

export default MemberList;