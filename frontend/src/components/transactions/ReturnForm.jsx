import React, { useState, useEffect } from 'react';

const ReturnForm = ({ transaction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().split('T')[0],
    condition: 'Tốt',
    notes: '',
    fine: 0
  });

  const [calculatedFine, setCalculatedFine] = useState(0);

  const conditionOptions = [
    { value: 'Tốt', label: 'Tốt', fine: 0 },
    { value: 'Khá', label: 'Khá', fine: 0 },
    { value: 'Hỏng nhẹ', label: 'Hỏng nhẹ', fine: 10000 },
    { value: 'Hỏng nặng', label: 'Hỏng nặng', fine: 50000 },
    { value: 'Mất sách', label: 'Mất sách', fine: 200000 }
  ];

  useEffect(() => {
    calculateFine();
  }, [formData.returnDate, formData.condition, transaction]);

  const calculateFine = () => {
    if (!transaction) return;

    let totalFine = 0;

    // Calculate overdue fine
    const returnDate = new Date(formData.returnDate);
    const dueDate = new Date(transaction.dueDate);
    
    if (returnDate > dueDate) {
      const overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      totalFine += overdueDays * 5000; // 5,000 VND per day
    }

    // Add condition fine
    const conditionFine = conditionOptions.find(opt => opt.value === formData.condition)?.fine || 0;
    totalFine += conditionFine;

    setCalculatedFine(totalFine);
    setFormData(prev => ({ ...prev, fine: totalFine }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getDaysOverdue = () => {
    if (!transaction) return 0;
    const returnDate = new Date(formData.returnDate);
    const dueDate = new Date(transaction.dueDate);
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isOverdue = () => {
    return getDaysOverdue() > 0;
  };

  if (!transaction) {
    return (
      <div className="return-form">
        <div className="text-center py-8">
          <div className="text-gray-500">Không có thông tin giao dịch</div>
        </div>
      </div>
    );
  }

  return (
    <div className="return-form">
      <div className="form-header">
        <h3 className="text-xl font-bold">Trả sách</h3>
        <button onClick={onCancel} className="close-btn">×</button>
      </div>

      {/* Transaction Info */}
      <div className="transaction-info">
        <h4 className="text-lg font-medium mb-3">Thông tin giao dịch:</h4>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Sách:</span>
            <span className="info-value">
              {transaction.bookId?.title || transaction.bookTitle || 'N/A'}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Thành viên:</span>
            <span className="info-value">
              {transaction.memberId?.name || transaction.memberName || 'N/A'}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Ngày mượn:</span>
            <span className="info-value">{formatDate(transaction.borrowDate)}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Hạn trả:</span>
            <span className={`info-value ${isOverdue() ? 'text-red-600 font-medium' : ''}`}>
              {formatDate(transaction.dueDate)}
              {isOverdue() && (
                <span className="text-sm block text-red-500">
                  (Quá hạn {getDaysOverdue()} ngày)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          {/* Return Date */}
          <div className="form-group">
            <label htmlFor="returnDate">Ngày trả thực tế *</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Book Condition */}
          <div className="form-group">
            <label htmlFor="condition">Tình trạng sách *</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="input-field"
            >
              {conditionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.fine > 0 && `(+${option.fine.toLocaleString('vi-VN')} VNĐ)`}
                </option>
              ))}
            </select>
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
            placeholder="Ghi chú về tình trạng sách hoặc lý do trả muộn..."
            rows="3"
          />
        </div>

        {/* Fine Calculation */}
        <div className="fine-calculation">
          <h4 className="text-lg font-medium mb-3">Chi tiết phí phạt:</h4>
          
          <div className="fine-breakdown">
            {isOverdue() && (
              <div className="fine-item">
                <span>Phí trả muộn ({getDaysOverdue()} ngày × 5,000 VNĐ):</span>
                <span className="fine-amount text-red-600">
                  {(getDaysOverdue() * 5000).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            )}

            {formData.condition !== 'Tốt' && formData.condition !== 'Khá' && (
              <div className="fine-item">
                <span>Phí {formData.condition.toLowerCase()}:</span>
                <span className="fine-amount text-red-600">
                  {(conditionOptions.find(opt => opt.value === formData.condition)?.fine || 0).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            )}

            <div className="fine-total">
              <span>Tổng phí phạt:</span>
              <span className={`total-amount ${calculatedFine > 0 ? 'text-red-600' : 'text-green-600'} font-bold`}>
                {calculatedFine.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary mr-3">
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            Xác nhận trả sách
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnForm;