import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, onSubmit, onCancel, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedYear: '',
    publisher: '',
    totalCopies: 1,
    availableCopies: 1,
    description: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ THÊM: Lưu file object

  const categories = [
    'Văn học',
    'Khoa học', 
    'Lịch sử',
    'Công nghệ',
    'Kinh tế',
    'Giáo dục',
    'Khác'
  ];

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        publishedYear: book.publishedYear || '',
        publisher: book.publisher || '',
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        description: book.description || '',
        imageUrl: book.imageUrl || ''
      });
      
      if (book.imageUrl) {
        setImagePreview(book.imageUrl);
      }
    }
  }, [book]);

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

  // ✅ SỬA: Xử lý upload ảnh - Lưu file, không Base64
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    
    try {
      // ✅ Kiểm tra file size
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Kích thước ảnh không được vượt quá 2MB'
        }));
        setIsUploadingImage(false);
        return;
      }

      // ✅ Kiểm tra định dạng
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'
        }));
        setIsUploadingImage(false);
        return;
      }

      // ✅ Kiểm tra kích thước ảnh (dimensions)
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MIN_WIDTH = 200;
          const MIN_HEIGHT = 300;

          if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
            setErrors(prev => ({
              ...prev,
              imageUrl: `Ảnh phải ít nhất ${MIN_WIDTH}x${MIN_HEIGHT}px (hiện tại: ${img.width}x${img.height}px)`
            }));
            setIsUploadingImage(false);
            return;
          }

          // ✅ Tất cả kiểm tra xong, lưu file
          setSelectedFile(file);
          setImagePreview(e.target.result);
          
          if (errors.imageUrl) {
            setErrors(prev => ({
              ...prev,
              imageUrl: ''
            }));
          }
          setIsUploadingImage(false);
        };
        img.onerror = () => {
          setErrors(prev => ({
            ...prev,
            imageUrl: 'File không phải là ảnh hợp lệ'
          }));
          setIsUploadingImage(false);
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Lỗi khi đọc file'
        }));
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error in handleImageChange:', err);
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    setImagePreview('');
    setErrors(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên sách là bắt buộc';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Tác giả là bắt buộc';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN là bắt buộc';
    }

    if (!formData.category) {
      newErrors.category = 'Thể loại là bắt buộc';
    }

    if (!formData.publishedYear) {
      newErrors.publishedYear = 'Năm xuất bản là bắt buộc';
    } else if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      newErrors.publishedYear = 'Năm xuất bản không hợp lệ';
    }

    if (userRole === 'admin') {
      if (formData.totalCopies < 1) {
        newErrors.totalCopies = 'Số lượng phải ít nhất là 1';
      }

      if (Number(formData.availableCopies) > Number(formData.totalCopies)) {
        newErrors.availableCopies = 'Số lượng có sẵn không được lớn hơn tổng số lượng';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SỬA: Submit dùng FormData để gửi file
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // ✅ Tạo FormData để gửi file
      const submitData = new FormData();
      
      // Thêm các field text
      submitData.append('title', formData.title);
      submitData.append('author', formData.author);
      submitData.append('isbn', formData.isbn);
      submitData.append('category', formData.category);
      submitData.append('publishedYear', parseInt(formData.publishedYear));
      submitData.append('publisher', formData.publisher);
      submitData.append('totalCopies', userRole === 'admin' ? parseInt(formData.totalCopies) : formData.totalCopies);
      submitData.append('availableCopies', userRole === 'admin' ? parseInt(formData.availableCopies) : formData.availableCopies);
      submitData.append('description', formData.description);
      
      // ✅ Thêm file (nếu có)
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }
      
      onSubmit(submitData);
    }
  };

  return (
    <div className="book-form">
     
      <form onSubmit={handleSubmit} className="form">
        {/* Phần upload ảnh */}
        <div className="form-group">
          <label htmlFor="imageUrl">Ảnh bìa sách</label>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="image-preview-img" />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  className="btn-remove-image"
                  disabled={isUploadingImage}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="image-upload-placeholder">
                <span className="upload-icon">{isUploadingImage ? '⏳' : '📷'}</span>
                <p className="upload-text">
                  {isUploadingImage ? 'Đang xử lý ảnh...' : 'Chọn ảnh bìa sách'}
                </p>
              </div>
            )}
            <input
              type="file"
              id="imageUrl"
              name="imageUrl"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="image-input"
              disabled={isUploadingImage}
            />
          </div>
          {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
          <div className="image-help-text">
            Định dạng: JPEG, PNG, WebP (tối đa 2MB) - Tùy chọn
          </div>
        </div>

        <div className="form-grid">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Tên sách *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'error' : ''}`}
              placeholder="Nhập tên sách"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author">Tác giả *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`input-field ${errors.author ? 'error' : ''}`}
              placeholder="Nhập tên tác giả"
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>

          {/* ISBN */}
          <div className="form-group">
            <label htmlFor="isbn">ISBN *</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={`input-field ${errors.isbn ? 'error' : ''}`}
              placeholder="Nhập mã ISBN"
            />
            {errors.isbn && <span className="error-text">{errors.isbn}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Thể loại *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'error' : ''}`}
            >
              <option value="">Chọn thể loại</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Published Year */}
          <div className="form-group">
            <label htmlFor="publishedYear">Năm xuất bản *</label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              className={`input-field ${errors.publishedYear ? 'error' : ''}`}
              placeholder="2024"
              min="1000"
              max={new Date().getFullYear()}
            />
            {errors.publishedYear && <span className="error-text">{errors.publishedYear}</span>}
          </div>

          {/* Publisher */}
          <div className="form-group">
            <label htmlFor="publisher">Nhà xuất bản</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="input-field"
              placeholder="Nhập nhà xuất bản"
            />
          </div>

          {/* CHỈ Admin được sửa số lượng */}
          {userRole === 'admin' && (
            <>
              <div className="form-group">
                <label htmlFor="totalCopies">Tổng số lượng *</label>
                <input
                  type="number"
                  id="totalCopies"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className={`input-field ${errors.totalCopies ? 'error' : ''}`}
                  min="1"
                />
                {errors.totalCopies && <span className="error-text">{errors.totalCopies}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="availableCopies">Số lượng có sẵn *</label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  className={`input-field ${errors.availableCopies ? 'error' : ''}`}
                  min="0"
                  max={formData.totalCopies}
                />
                {errors.availableCopies && <span className="error-text">{errors.availableCopies}</span>}
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Mô tả về sách (tùy chọn)"
            rows="3"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary mr-3">
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={isUploadingImage}>
            {book ? 'Cập nhật' : 'Thêm sách'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;