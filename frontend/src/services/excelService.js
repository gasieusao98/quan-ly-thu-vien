import api from '../utils/api';

export const excelService = {
  // Xuất danh sách sách ra Excel
  exportBooks: () => {
    return api.get('/excel/export', {
      responseType: 'blob'
    });
  },

  // Nhập dữ liệu sách từ Excel
  importBooks: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/excel/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default excelService;