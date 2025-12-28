import React from 'react';
import './BookSearch.css';

const BookSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  categories 
}) => {
  const categoryLabels = {
    'all': 'Tất cả thể loại',
    'Văn học': 'Văn học',
    'Khoa học': 'Khoa học',
    'Lịch sử': 'Lịch sử',
    'Công nghệ': 'Công nghệ',
    'Kinh tế': 'Kinh tế',
    'Giáo dục': 'Giáo dục'
  };

  return (
    <div className="book-search">
      <div className="search-container">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-md-8">
            <div className="search-field">
              <label className="search-label">
                🔍 Tìm kiếm sách
              </label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên sách hoặc tác giả..."
                  className="form-control search-input"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-md-4">
            <div className="search-field">
              <label className="search-label">
                📂 Lọc theo thể loại
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearch;