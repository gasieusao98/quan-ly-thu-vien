import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionDetailModal from '../../components/transactions/TransactionDetailModal';
import BorrowForm from '../../components/transactions/BorrowForm';
import ExtendModal from '../../components/transactions/ExtendModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import notificationService from '../../services/notificationService'; // 🆕 THÊM

const Transactions = () => {
  const { state, actions } = useAppContext();
  const { transactions, loading, error } = state;
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho confirm modal
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [transactionToReturn, setTransactionToReturn] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  // State cho detail modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // State cho extend modal
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [transactionToExtend, setTransactionToExtend] = useState(null);

  // 🆕 THÊM: State cho email
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [transactionToEmail, setTransactionToEmail] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // State cho thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');

  // 🔧 SỬA: Thêm fetchBooks() và fetchMembers()
  useEffect(() => {
    actions.fetchTransactions();
    actions.fetchBooks();      // 🆕 THÊM: Fetch sách
    actions.fetchMembers();    // 🆕 THÊM: Fetch thành viên
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBorrow = () => {
    setShowBorrowForm(true);
  };

  const handleBorrowSubmit = async (borrowData) => {
    try {
      await actions.borrowBook(borrowData);
      setShowBorrowForm(false);
      actions.fetchTransactions();
      actions.fetchBooks();
      
      setSuccessMessage('Mượn sách thành công!');
    } catch (error) {
      console.error('Error borrowing book:', error);
      setSuccessMessage(error.response?.data?.message || 'Lỗi khi mượn sách');
    }
  };

  const handleReturnClick = (transaction) => {
    setTransactionToReturn(transaction);
    setShowReturnConfirm(true);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetail = () => {
    setSelectedTransaction(null);
  };

  const handleReturnConfirm = async () => {
    if (!transactionToReturn) return;
    
    setReturnLoading(true);
    try {
      await actions.returnBook(transactionToReturn._id);
      actions.fetchTransactions();
      actions.fetchBooks();
      
      setSuccessMessage(`Đã trả sách "${transactionToReturn.bookSnapshot?.title || transactionToReturn.bookId?.title}" thành công!`);
      
      setShowReturnConfirm(false);
      setTransactionToReturn(null);
      
    } catch (error) {
      console.error('Error returning book:', error);
      setSuccessMessage(error.response?.data?.message || 'Lỗi khi trả sách');
      
      setShowReturnConfirm(false);
      setTransactionToReturn(null);
    } finally {
      setReturnLoading(false);
    }
  };

  const handleReturnCancel = () => {
    setShowReturnConfirm(false);
    setTransactionToReturn(null);
  };

  const handleExtendClick = (transaction) => {
    setTransactionToExtend(transaction);
    setShowExtendModal(true);
  };

  const handleExtendConfirm = async (newDueDate) => {
    if (!transactionToExtend) return;
    
    try {
      await actions.extendBorrow(transactionToExtend._id, { newDueDate });
      actions.fetchTransactions();
      
      setSuccessMessage(`Đã gia hạn sách "${transactionToExtend.bookSnapshot?.title || transactionToExtend.bookId?.title}" thành công!`);
      
      setShowExtendModal(false);
      setTransactionToExtend(null);
      
    } catch (error) {
      console.error('Error extending borrow:', error);
      setSuccessMessage(error.response?.data?.message || 'Lỗi khi gia hạn');
    }
  };

  const handleExtendCancel = () => {
    setShowExtendModal(false);
    setTransactionToExtend(null);
  };

  const handleCalculateFine = async (transaction) => {
    try {
      const result = await actions.calculateFine(transaction._id);
      if (result.data.fine > 0) {
        setSuccessMessage(`Phạt quá hạn: ${result.data.fine.toLocaleString()} VND\nQuá hạn: ${result.data.daysLate} ngày`);
      } else {
        setSuccessMessage('Không có phạt quá hạn');
      }
    } catch (error) {
      console.error('Error calculating fine:', error);
      setSuccessMessage('Lỗi khi tính phạt');
    }
  };

  // 🆕 THÊM: Hàm xử lý gửi email
  const handleSendEmailClick = (transaction) => {
    setTransactionToEmail(transaction);
    setShowEmailConfirm(true);
  };

  const handleSendEmailConfirm = async () => {
    if (!transactionToEmail) return;

    setEmailLoading(true);
    try {
      // Xác định loại thông báo
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(transactionToEmail.dueDate);
      due.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

      const notificationType = daysUntilDue < 0 ? 'OVERDUE' : 'REMINDER';

      // Gọi API gửi email
      await notificationService.sendNotification(transactionToEmail._id, notificationType);

      setSuccessMessage(`✓ Gửi ${notificationType === 'REMINDER' ? 'nhắc nhở' : 'cảnh báo quá hạn'} thành công cho ${transactionToEmail.memberSnapshot?.name || transactionToEmail.memberId?.name}`);

      setShowEmailConfirm(false);
      setTransactionToEmail(null);

    } catch (error) {
      console.error('Error sending email:', error);
      setSuccessMessage(error.response?.data?.message || 'Lỗi khi gửi email');

      setShowEmailConfirm(false);
      setTransactionToEmail(null);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendEmailCancel = () => {
    setShowEmailConfirm(false);
    setTransactionToEmail(null);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const bookTitle = transaction.bookSnapshot?.title?.toLowerCase() || transaction.bookId?.title?.toLowerCase() || '';
      const author = transaction.bookSnapshot?.author?.toLowerCase() || transaction.bookId?.author?.toLowerCase() || '';
      const memberName = transaction.memberSnapshot?.name?.toLowerCase() || transaction.memberId?.name?.toLowerCase() || '';
      const memberCode = transaction.memberSnapshot?.memberCode?.toLowerCase() || transaction.memberId?.memberCode?.toLowerCase() || '';
      
      return bookTitle.includes(searchTerm.toLowerCase()) || 
             author.includes(searchTerm.toLowerCase()) ||
             memberName.includes(searchTerm.toLowerCase()) ||
             memberCode.includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  return (
    <div className="admin-transactions d-flex flex-column min-vh-100">
      {/* 🆕 THÊM: Email Confirm Modal */}
      <ConfirmModal
        isOpen={showEmailConfirm}
        onClose={handleSendEmailCancel}
        onConfirm={handleSendEmailConfirm}
        title="Gửi email nhắc nhở"
        message={`Bạn có chắc muốn gửi email cho ${transactionToEmail?.memberSnapshot?.name || transactionToEmail?.memberId?.name || 'độc giả này'}?`}
        confirmText="Gửi"
        cancelText="Hủy"
        confirmColor="primary"
        loading={emailLoading}
      >
        <p className="text-dark fw-bold">Sách: {transactionToEmail?.bookSnapshot?.title || transactionToEmail?.bookId?.title || 'Không có thông tin'}</p>
        <p className="text-dark fw-bold">Email: {transactionToEmail?.memberSnapshot?.email || transactionToEmail?.memberId?.email || 'Không có email'}</p>
      </ConfirmModal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showReturnConfirm}
        onClose={handleReturnCancel}
        onConfirm={handleReturnConfirm}
        title="Xác nhận trả sách"
        message={`Bạn có chắc muốn trả sách "${transactionToReturn?.bookSnapshot?.title || transactionToReturn?.bookId?.title || 'sách này'}"?`}
        confirmText="Trả sách"
        cancelText="Hủy"
        confirmColor="primary"
        loading={returnLoading}
      >
        <p className="text-dark fw-bold">Thành viên: {transactionToReturn?.memberSnapshot?.name || transactionToReturn?.memberId?.name || 'Không có thông tin'}</p>
      </ConfirmModal>

      {/* Extend Modal */}
      <ExtendModal
        transaction={transactionToExtend}
        isOpen={showExtendModal}
        onClose={handleExtendCancel}
        onConfirm={handleExtendConfirm}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={handleCloseDetail}
      />

      {/* Page Header */}
      <header className="bg-white shadow-sm border-bottom py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h2 fw-bold text-primary mb-0">Quản lý Giao dịch</h1>
              <p className="text-muted mb-0">Theo dõi và quản lý các giao dịch mượn trả sách</p>
            </div>
            <div className="col-auto">
              <button 
                onClick={handleBorrow}
                className="btn btn-primary"
              >
                <i className="fas fa-plus me-2"></i>
                Mượn sách mới
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Thông báo thành công/lỗi */}
      {successMessage && (
        <div className="container-fluid mt-3">
          <div className={`alert ${
            successMessage.includes('lỗi') || successMessage.includes('Lỗi') || successMessage.includes('Lỗi khi') 
              ? 'alert-danger' 
              : 'alert-success'
          } alert-dismissible fade show`} role="alert">
            <i className={`fas ${
              successMessage.includes('lỗi') || successMessage.includes('Lỗi') || successMessage.includes('Lỗi khi') 
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
            {/* Search Input */}
            <div className="col-md-6">
              <label htmlFor="transaction-search" className="form-label fw-semibold text-muted mb-2">
                <i className="fas fa-search me-2"></i>Tìm kiếm giao dịch
              </label>
              <div className="d-flex align-items-center gap-2">
                <input
                  id="transaction-search"
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo tên sách, tác giả, thành viên..."
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
                <i className="fas fa-filter me-2"></i>Lọc theo trạng thái
              </label>
              <select
                id="status-filter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Quá hạn">Quá hạn</option>
              </select>
            </div>

            {/* Results Counter */}
            <div className="col-md-2">
              <div className="text-center p-2 bg-white rounded border">
                <small className="text-muted d-block">Kết quả</small>
                <strong className="text-primary">{filteredTransactions.length}</strong>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="row mt-3">
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">Bộ lọc đang áp dụng:</small>
                  
                  {searchTerm && (
                    <span className="badge bg-primary">
                      <i className="fas fa-search me-1"></i>
                      Tìm kiếm: "{searchTerm}"
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setSearchTerm('')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                  
                  {statusFilter !== 'all' && (
                    <span className="badge bg-success">
                      <i className="fas fa-filter me-1"></i>
                      Trạng thái: {statusFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setStatusFilter('all')}
                        style={{ fontSize: '0.6rem' }}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert từ context (nếu có) */}
      {error && (
        <div className="container-fluid mt-3">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <TransactionList 
                transactions={filteredTransactions}
                loading={loading}
                onReturn={handleReturnClick}
                onViewDetail={handleViewDetail}
                onExtend={handleExtendClick}
                onSendEmail={handleSendEmailClick} // 🆕 THÊM: Prop mới
              />
            </div>
          </div>
        </div>
      </main>

      {/* Borrow Form Modal */}
      <Modal
        isOpen={showBorrowForm}
        onClose={() => setShowBorrowForm(false)}
        title="Mượn sách mới"
        icon="fas fa-book"
        size="lg"
      >
        <BorrowForm
          onSubmit={handleBorrowSubmit}
          onCancel={() => setShowBorrowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default Transactions;