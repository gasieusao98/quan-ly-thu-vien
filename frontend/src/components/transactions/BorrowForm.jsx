import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const BorrowForm = ({ onSubmit, onCancel }) => {
  const { state } = useAppContext();
  const { books, members } = state;

  const [formData, setFormData] = useState({
    bookId: '',
    memberId: '',
    dueDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Set default due date (14 days from today)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setFormData(prev => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    if (formData.bookId) {
      const book = books.find(b => b._id === formData.bookId);
      setSelectedBook(book);
    }
  }, [formData.bookId, books]);

  useEffect(() => {
    if (formData.memberId) {
      const member = members.find(m => m._id === formData.memberId);
      setSelectedMember(member);
    }
  }, [formData.memberId, members]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookId) {
      newErrors.bookId = 'Vui lòng chọn sách';
    }

    if (!formData.memberId) {
      newErrors.memberId = 'Vui lòng chọn thành viên';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn ngày trả';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Ngày trả không được là ngày trong quá khứ';
      }
    }

    // Check if selected book is available
    if (selectedBook && selectedBook.availableCopies <= 0) {
      newErrors.bookId = 'Sách này đã hết';
    }

    // Check if selected member is active
    if (selectedMember && selectedMember.status !== 'Đang hoạt động') {
      newErrors.memberId = 'Thành viên không được phép mượn sách';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const availableBooks = books.filter(book => book.availableCopies > 0);
  const activeMembers = members.filter(member => member.status === 'Đang hoạt động');

  return (
    <div className="borrow-form">
      

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          {/* Book Selection */}
          <div className="form-group">
            <label htmlFor="bookId">Chọn sách *</label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className={`input-field ${errors.bookId ? 'error' : ''}`}
            >
              <option value="">-- Chọn sách --</option>
              {availableBooks.map(book => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.author} (Có sẵn: {book.availableCopies})
                </option>
              ))}
            </select>
            {errors.bookId && <span className="error-text">{errors.bookId}</span>}
          </div>

          {/* Member Selection */}
          <div className="form-group">
            <label htmlFor="memberId">Chọn thành viên *</label>
            <select
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className={`input-field ${errors.memberId ? 'error' : ''}`}
            >
              <option value="">-- Chọn thành viên --</option>
              {activeMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.memberCode}) - {member.membershipType}
                </option>
              ))}
            </select>
            {errors.memberId && <span className="error-text">{errors.memberId}</span>}
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="dueDate">Ngày trả dự kiến *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`input-field ${errors.dueDate ? 'error' : ''}`}
            />
            {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Ghi chú</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            placeholder="Ghi chú thêm (tùy chọn)"
            rows="3"
          />
        </div>

        {/* Selected Items Summary */}
        {(selectedBook || selectedMember) && (
          <div className="selected-summary">
            <h4 className="text-lg font-medium mb-3">Thông tin giao dịch:</h4>
            
            {selectedBook && (
              <div className="summary-item">
                <strong>Sách:</strong> {selectedBook.title}
                <br />
                <span className="text-sm text-gray-600">
                  Tác giả: {selectedBook.author} | ISBN: {selectedBook.isbn}
                </span>
              </div>
            )}

            {selectedMember && (
              <div className="summary-item">
                <strong>Thành viên:</strong> {selectedMember.name}
                <br />
                <span className="text-sm text-gray-600">
                  Mã: {selectedMember.memberCode} | Email: {selectedMember.email}
                </span>
              </div>
            )}

            {formData.dueDate && (
              <div className="summary-item">
                <strong>Ngày trả:</strong> {new Date(formData.dueDate).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary mr-3">
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            Tạo giao dịch
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowForm;