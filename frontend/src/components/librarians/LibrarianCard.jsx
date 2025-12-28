import React from 'react';

const LibrarianCard = ({ 
  librarian, 
  index, 
  onEdit, 
  onDelete, 
  onViewDetail, 
  userRole 
}) => {
  const getStatusBadge = (isActive) => {
    return isActive 
      ? { text: 'Đang hoạt động', class: 'bg-success' }
      : { text: 'Đã khóa', class: 'bg-danger' };
  };

  const status = getStatusBadge(librarian.isActive);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <strong>{librarian.username}</strong>
      </td>
      <td>{librarian.fullName}</td>
      <td>{librarian.email}</td>
      <td>{librarian.phone || 'Chưa cập nhật'}</td>
      <td>
        <span className={`badge ${status.class} text-white`}>
          {status.text}
        </span>
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button
            onClick={() => onViewDetail && onViewDetail(librarian)}
            className="btn btn-outline-primary"
            title="Xem chi tiết"
          >
            <i className="fas fa-eye"></i>
          </button>
          
          {userRole === 'admin' && (
            <>
              <button
                onClick={() => onEdit && onEdit(librarian)}
                className="btn btn-outline-warning"
                title="Chỉnh sửa"
              >
                <i className="fas fa-edit"></i>
              </button>
              
              <button
                onClick={() => onDelete && onDelete(librarian._id, librarian.fullName)}
                className="btn btn-outline-danger"
                title="Xóa"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LibrarianCard;