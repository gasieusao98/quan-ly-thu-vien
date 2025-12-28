import React from 'react';

const MemberCard = ({ member, onEdit, onDelete }) => {
  if (!member) {
    return null;
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(member);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Bạn có chắc muốn xóa thành viên "${member.name}"?`)) {
      onDelete(member._id);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="card member-card">
      <div className="member-card-header">
        <div className="member-info">
          <h3 className="member-name">{member.name || 'N/A'}</h3>
          <p className="member-code">Mã: {member.memberCode || 'N/A'}</p>
          <span className={`status-badge ${member.status === 'Đang hoạt động' ? 'available' : 'unavailable'}`}>
            {member.status || 'N/A'}
          </span>
        </div>
      </div>

      <div className="member-card-body">
        <div className="member-detail">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{member.email || 'N/A'}</span>
        </div>

        <div className="member-detail">
          <span className="detail-label">Điện thoại:</span>
          <span className="detail-value">{member.phone || 'N/A'}</span>
        </div>

        <div className="member-detail">
          <span className="detail-label">Địa chỉ:</span>
          <span className="detail-value">{member.address || 'N/A'}</span>
        </div>

        <div className="member-detail">
          <span className="detail-label">Ngày sinh:</span>
          <span className="detail-value">{formatDate(member.dateOfBirth)}</span>
        </div>

        <div className="member-detail">
          <span className="detail-label">Loại thành viên:</span>
          <span className="detail-value">{member.membershipType || 'N/A'}</span>
        </div>
      </div>

      <div className="member-card-actions">
        <button 
          onClick={handleEdit}
          className="btn btn-sm btn-secondary mr-2"
        >
          Sửa
        </button>
        <button 
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default MemberCard;