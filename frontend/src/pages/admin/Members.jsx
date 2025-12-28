import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import MemberList from '../../components/members/MemberList';
import MemberForm from '../../components/members/MemberForm';
import MemberDetailModal from '../../components/members/MemberDetailModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';

const Members = () => {
  const { state, actions } = useAppContext();
  const { user } = useAuth();
  const { loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formError, setFormError] = useState('');
  
  // State cho confirm modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State cho modal chi tiết
  const [selectedMember, setSelectedMember] = useState(null);

  // 🆕 STATE CHO THÔNG BÁO THÀNH CÔNG - GIỐNG BOOKS.JSX
  const [successMessage, setSuccessMessage] = useState('');

  // Phân quyền: Chỉ Admin được thêm/sửa/xóa thành viên
  const canEditMembers = user?.role === 'admin';
  const canViewMembers = user?.role === 'admin' || user?.role === 'librarian';

  // Extract members array from API response
  const membersData = state.members || {};
  const members = Array.isArray(membersData) ? membersData : (membersData.members || []);

  useEffect(() => {
    if (canViewMembers) {
      actions.fetchMembers();
    }
  }, []);

  // 🆕 TỰ ĐỘNG ẨN THÔNG BÁO SAU 3 GIÂY - GIỐNG BOOKS.JSX
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddNew = () => {
    setEditingMember(null);
    setShowForm(true);
    setFormError('');
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
    setFormError('');
  };

  // Hàm xử lý xem chi tiết
  const handleViewDetail = (member) => {
    setSelectedMember(member);
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setSelectedMember(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormError('');
  };

  const handleFormSubmit = async (memberData) => {
    try {
      console.log('🎯 Members.js - Form submitted:', memberData);
      setFormError('');

      if (editingMember) {
        await actions.updateMember(editingMember._id, memberData);
        
        // 🆕 HIỂN THỊ THÔNG BÁO THÀNH CÔNG - GIỐNG BOOKS.JSX
        setSuccessMessage('Cập nhật thành viên thành công!');
      } else {
        await actions.addMember(memberData);
        
        // 🆕 HIỂN THỊ THÔNG BÁO THÀNH CÔNG - GIỐNG BOOKS.JSX
        setSuccessMessage('Thêm thành viên thành công!');
      }

      console.log('✅ Members.js - Form submit successful');
      setShowForm(false);
      setEditingMember(null);
      actions.fetchMembers();
    } catch (error) {
      console.error('❌ Members.js - Form submit error:', error);
      
      // 🆕 HIỂN THỊ THÔNG BÁO LỖI - GIỐNG BOOKS.JSX
      setSuccessMessage(error.message || 'Có lỗi xảy ra khi thêm thành viên');
    }
  };

  // Xử lý xóa thành viên với Confirm Modal
  const handleDeleteClick = (memberId, memberName) => {
    setMemberToDelete({ id: memberId, name: memberName });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    
    setDeleteLoading(true);
    try {
      await actions.deleteMember(memberToDelete.id);
      actions.fetchMembers();
      
      // 🆕 HIỂN THỊ THÔNG BÁO THÀNH CÔNG - GIỐNG BOOKS.JSX
      setSuccessMessage('Xóa thành viên thành công!');
      
    } catch (error) {
      console.error('Error deleting member:', error);
      
      // 🆕 HIỂN THỊ THÔNG BÁO LỖI - GIỐNG BOOKS.JSX
      setSuccessMessage('Có lỗi xảy ra khi xóa thành viên: ' + error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setMemberToDelete(null);
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    // Search filter
    if (searchTerm) {
      const matchesSearch = 
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberCode?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Member type filter
    if (memberTypeFilter !== 'all' && member.membershipType !== memberTypeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && member.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="admin-members d-flex flex-column min-vh-100">
      {/* Confirm Modal cho xóa thành viên */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa thành viên"
        message={`Bạn có chắc muốn xóa thành viên "${memberToDelete?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="danger"
        loading={deleteLoading}
      />

      {/* Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={handleCloseDetail}
        userRole={user?.role}
      />

      {/* Page Header */}
      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">
                Quản lý thành viên
                {user?.role === 'librarian' && (
                  <span className="text-sm fw-normal text-muted ms-2">
                    (Chế độ xem)
                  </span>
                )}
              </h1>
              <p className="text-muted mb-0">Quản lý thông tin và trạng thái các thành viên thư viện</p>
            </div>
            <div className="col-auto">
              {/* Chỉ Admin được thêm thành viên */}
              {canEditMembers && (
                <button onClick={handleAddNew} className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Thêm thành viên mới
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🆕 THÔNG BÁO THÀNH CÔNG/LOI - HIỂN THỊ DƯỚI HEADER GIỐNG BOOKS.JSX */}
      {successMessage && (
        <div className="container-fluid mt-3">
          <div className={`alert ${
            successMessage.includes('lỗi') || successMessage.includes('Lỗi') || successMessage.includes('Có lỗi') 
              ? 'alert-danger' 
              : 'alert-success'
          } alert-dismissible fade show`} role="alert">
            <i className={`fas ${
              successMessage.includes('lỗi') || successMessage.includes('Lỗi') || successMessage.includes('Có lỗi') 
                ? 'fa-exclamation-triangle' 
                : 'fa-check-circle'
            } me-2`}></i>
            <span>{successMessage}</span>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccessMessage('')}
            ></button>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      {canViewMembers && (
        <div className="bg-light border-bottom py-3">
          <div className="container-fluid">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-md-4">
                <label htmlFor="member-search" className="form-label fw-semibold text-muted mb-2">
                  <i className="fas fa-search me-2"></i>Tìm kiếm thành viên
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    id="member-search"
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo tên, email, mã thành viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm('')}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* Member Type Filter */}
              <div className="col-md-3">
                <label htmlFor="type-filter" className="form-label fw-semibold text-muted mb-2">
                  <i className="fas fa-users me-2"></i>Loại thành viên
                </label>
                <select
                  id="type-filter"
                  className="form-select"
                  value={memberTypeFilter}
                  onChange={(e) => setMemberTypeFilter(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Sinh viên">Sinh viên</option>
                  <option value="Giảng viên">Giảng viên</option>
                  <option value="Cán bộ">Cán bộ</option>
                  <option value="Khách">Khách</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="col-md-3">
                <label htmlFor="status-filter" className="form-label fw-semibold text-muted mb-2">
                  <i className="fas fa-circle me-2"></i>Trạng thái
                </label>
                <select
                  id="status-filter"
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Tạm khóa">Tạm khóa</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>

              {/* Results Counter */}
              <div className="col-md-2">
                <div className="text-center p-2 bg-white rounded border">
                  <small className="text-muted d-block">Kết quả</small>
                  <strong className="text-primary">{filteredMembers.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert từ context (nếu có) */}
      {error && (
        <div className="container-fluid mt-3">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Member List */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {canViewMembers ? (
                <MemberList
                  members={filteredMembers}
                  loading={loading}
                  onEdit={canEditMembers ? handleEdit : null}
                  onDelete={canEditMembers ? handleDeleteClick : null}
                  onViewDetail={handleViewDetail}
                  userRole={user?.role}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="display-1 text-muted mb-4">🚫</div>
                  <h3 className="h4 text-muted mb-3">Không có quyền truy cập</h3>
                  <p className="text-muted">Bạn không có quyền xem trang này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Member Form Modal */}
      <Modal
        isOpen={showForm && canEditMembers}
        onClose={handleFormClose}
        title={editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
        icon="fas fa-user"
        size="lg"
      >
        <MemberForm
          member={editingMember}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          error={formError}
          userRole={user?.role}
        />
      </Modal>
    </div>
  );
};

export default Members;