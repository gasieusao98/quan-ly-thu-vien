import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import LibrarianList from '../../components/librarians/LibrarianList';
import LibrarianForm from '../../components/librarians/LibrarianForm';
import LibrarianDetailModal from '../../components/librarians/LibrarianDetailModal'; // THÊM IMPORT
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';

const Librarians = () => {
  const { state, actions } = useAppContext();
  const { user } = useAuth();
  const { loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingLibrarian, setEditingLibrarian] = useState(null);
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [librarianToDelete, setLibrarianToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // THÊM STATE CHO MODAL CHI TIẾT
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);

  // Chỉ Admin mới được truy cập
  const canEditLibrarians = user?.role === 'admin';

  useEffect(() => {
    if (canEditLibrarians) {
      actions.fetchLibrarians();
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddNew = () => {
    setEditingLibrarian(null);
    setShowForm(true);
    setFormError('');
  };

  const handleEdit = (librarian) => {
    setEditingLibrarian(librarian);
    setShowForm(true);
    setFormError('');
  };

  // THÊM HÀM XỬ LÝ XEM CHI TIẾT
  const handleViewDetail = (librarian) => {
    setSelectedLibrarian(librarian);
  };

  // THÊM HÀM ĐÓNG MODAL CHI TIẾT
  const handleCloseDetail = () => {
    setSelectedLibrarian(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLibrarian(null);
    setFormError('');
  };

  const handleFormSubmit = async (librarianData) => {
    try {
      setFormError('');

      if (editingLibrarian) {
        await actions.updateLibrarian(editingLibrarian._id, librarianData);
        setSuccessMessage('Cập nhật thủ thư thành công!');
      } else {
        await actions.addLibrarian(librarianData);
        setSuccessMessage('Thêm thủ thư thành công!');
      }

      setShowForm(false);
      setEditingLibrarian(null);
      actions.fetchLibrarians();
    } catch (error) {
      console.error('Form submit error:', error);
      setFormError(error.message || 'Có lỗi xảy ra khi xử lý thủ thư');
    }
  };

  const handleDeleteClick = (librarianId, librarianName) => {
    setLibrarianToDelete({ id: librarianId, name: librarianName });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!librarianToDelete) return;
    
    setDeleteLoading(true);
    try {
      await actions.deleteLibrarian(librarianToDelete.id);
      actions.fetchLibrarians();
      setSuccessMessage('Xóa thủ thư thành công!');
    } catch (error) {
      console.error('Error deleting librarian:', error);
      setSuccessMessage('Có lỗi xảy ra khi xóa thủ thư: ' + error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setLibrarianToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setLibrarianToDelete(null);
  };

  const filteredLibrarians = (state.librarians || []).filter(librarian => {
    // Search filter
    if (searchTerm) {
      const matchesSearch = 
        librarian.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        librarian.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        librarian.username?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'Đang hoạt động' && !librarian.isActive) return false;
      if (statusFilter === 'Đã khóa' && librarian.isActive) return false;
    }

    return true;
  });

  if (!canEditLibrarians) {
    return (
      <div className="admin-librarians d-flex flex-column min-vh-100">
        <div className="text-center py-8">
          <div className="display-1 text-muted mb-4">🚫</div>
          <h3 className="h4 text-muted mb-3">Không có quyền truy cập</h3>
          <p className="text-muted">Chỉ Quản trị viên mới được truy cập trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-librarians d-flex flex-column min-vh-100">
      {/* Confirm Modal cho xóa thủ thư */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa thủ thư"
        message={`Bạn có chắc muốn xóa thủ thư "${librarianToDelete?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="danger"
        loading={deleteLoading}
      />

      {/* THÊM LIBRARIAN DETAIL MODAL */}
      <LibrarianDetailModal
        librarian={selectedLibrarian}
        onClose={handleCloseDetail}
        userRole={user?.role}
      />

      {/* Page Header */}
      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">
                Quản lý Thủ thư
              </h1>
              <p className="text-muted mb-0">Quản lý thông tin và tài khoản thủ thư</p>
            </div>
            <div className="col-auto">
              <button onClick={handleAddNew} className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>
                Thêm thủ thư mới
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="container-fluid mt-3">
          <div className={`alert ${
            successMessage.includes('lỗi') || successMessage.includes('Lỗi') 
              ? 'alert-danger' 
              : 'alert-success'
          } alert-dismissible fade show`} role="alert">
            <i className={`fas ${
              successMessage.includes('lỗi') || successMessage.includes('Lỗi') 
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
      <div className="bg-light border-bottom py-3">
        <div className="container-fluid">
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-6">
              <label htmlFor="librarian-search" className="form-label fw-semibold text-muted mb-2">
                <i className="fas fa-search me-2"></i>Tìm kiếm thủ thư
              </label>
              <div className="d-flex align-items-center gap-2">
                <input
                  id="librarian-search"
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo tên, email, username..."
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

            {/* Status Filter */}
            <div className="col-md-4">
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
                <option value="Đã khóa">Đã khóa</option>
              </select>
            </div>

            {/* Results Counter */}
            <div className="col-md-2">
              <div className="text-center p-2 bg-white rounded border">
                <small className="text-muted d-block">Kết quả</small>
                <strong className="text-primary">{filteredLibrarians.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container-fluid mt-3">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Librarian List */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <LibrarianList
                librarians={filteredLibrarians}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewDetail={handleViewDetail} // THÊM PROP NÀY
                userRole={user?.role}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Librarian Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormClose}
        title={editingLibrarian ? 'Chỉnh sửa thủ thư' : 'Thêm thủ thư mới'}
        icon="fas fa-user-tie"
        size="lg"
      >
        {formError && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {formError}
          </div>
        )}
        
        <LibrarianForm
          librarian={editingLibrarian}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          error={formError}
          userRole={user?.role}
        />
      </Modal>
    </div>
  );
};

export default Librarians;