import React, { useState } from 'react';
import excelService from '../../services/excelService';
import './ExcelImportExport.css';

const ExcelImportExport = ({ onImportSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = React.useRef(null);

  // 🆕 EXPORT: Xuất danh sách sách ra Excel
  const handleExport = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await excelService.exportBooks();

      // Tạo URL từ blob và download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `danh_sach_sach_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage('✓ Xuất file Excel thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setErrorMessage('❌ Lỗi khi xuất Excel: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 IMPORT: Nhập dữ liệu sách từ Excel
  const handleImport = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setErrorMessage('Vui lòng chọn file');
      return;
    }

    // Kiểm tra loại file
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('❌ Chỉ chấp nhận file Excel (.xlsx, .xls)');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Kiểm tra kích thước file
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('❌ File quá lớn (tối đa 5MB)');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setImportResult(null);

    try {
      const response = await excelService.importBooks(file);

      setImportResult(response.data.data);
      setSuccessMessage(`✓ ${response.data.message}`);

      // Gọi callback để refresh danh sách sách
      if (onImportSuccess) {
        onImportSuccess();
      }

      // Reset input
      fileInputRef.current.value = '';

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Import error:', error);
      setErrorMessage('❌ Lỗi khi nhập Excel: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excel-import-export">
      {/* Header */}
      <div className="excel-header">
        <h3>📊 Quản lý dữ liệu Excel</h3>
        <p>Xuất/Nhập danh sách sách từ file Excel</p>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button 
            onClick={() => setSuccessMessage('')}
            className="alert-close"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage('')}
            className="alert-close"
          >
            ×
          </button>
        </div>
      )}

      {/* Buttons Section */}
      <div className="excel-actions">
        {/* Export Button */}
        <div className="action-item">
          <div className="action-info">
            <h4>📥 Xuất Excel</h4>
            <p>Tải danh sách sách hiện tại dưới dạng file Excel</p>
          </div>
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-export"
          >
            {loading ? '⏳ Đang xuất...' : '📥 Xuất Excel'}
          </button>
        </div>

        {/* Import Button */}
        <div className="action-item">
          <div className="action-info">
            <h4>📤 Nhập Excel</h4>
            <p>Tải lên file Excel để thêm/cập nhật danh sách sách</p>
          </div>
          <div className="import-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              disabled={loading}
              className="file-input"
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" className="btn btn-import">
              {loading ? '⏳ Đang nhập...' : '📤 Chọn file Excel'}
            </label>
          </div>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="import-result">
          <h4>📋 Kết quả nhập:</h4>
          <div className="result-stats">
            <div className="stat">
              <span className="label">✓ Thành công:</span>
              <span className="value success">{importResult.importedCount}</span>
            </div>
            <div className="stat">
              <span className="label">✗ Thất bại:</span>
              <span className="value error">{importResult.errorCount}</span>
            </div>
            <div className="stat">
              <span className="label">📊 Tổng cộng:</span>
              <span className="value">{importResult.totalRows}</span>
            </div>
          </div>

          {/* Errors List */}
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="errors-list">
              <h5>⚠️ Các lỗi:</h5>
              <ul>
                {importResult.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Template Info */}
      <div className="excel-template-info">
        <h4>📝 Hướng dẫn tạo file Excel:</h4>
        <p>File Excel phải có các cột sau (không bắt buộc cột STT):</p>
        <div className="column-list">
          <div className="column-item required">
            <span className="icon">⭐</span>
            <span className="name">Tên sách</span>
            <span className="type">Văn bản (bắt buộc)</span>
          </div>
          <div className="column-item required">
            <span className="icon">⭐</span>
            <span className="name">Tác giả</span>
            <span className="type">Văn bản (bắt buộc)</span>
          </div>
          <div className="column-item required">
            <span className="icon">⭐</span>
            <span className="name">ISBN</span>
            <span className="type">Văn bản (bắt buộc)</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Mã sách</span>
            <span className="type">Văn bản (tự động sinh)</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Thể loại</span>
            <span className="type">Văn bản</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Năm xuất bản</span>
            <span className="type">Số</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Nhà xuất bản</span>
            <span className="type">Văn bản</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Tổng số</span>
            <span className="type">Số</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Số có sẵn</span>
            <span className="type">Số</span>
          </div>
          <div className="column-item">
            <span className="icon">○</span>
            <span className="name">Mô tả</span>
            <span className="type">Văn bản</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportExport;