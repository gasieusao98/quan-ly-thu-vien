import api from '../utils/api';

// 📊 STATISTICS API - Dành cho admin/librarian
export const statisticsAPI = {
  // Lấy sách mượn nhiều nhất (Top 10)
  getPopularBooks: async () => {
    try {
      const response = await api.get('/dashboard/popular-books');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching popular books:', error);
      throw error;
    }
  },

  // Lấy độc giả tích cực nhất (Top 10)
  getActiveMembers: async () => {
    try {
      const response = await api.get('/dashboard/active-members');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching active members:', error);
      throw error;
    }
  },

  // Lấy cả hai dữ liệu (tối ưu hóa)
  getAllStatistics: async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        api.get('/dashboard/popular-books'),
        api.get('/dashboard/active-members')
      ]);
      
      return {
        success: true,
        data: {
          popularBooks: booksRes.data.data || [],
          activeMembers: membersRes.data.data || []
        }
      };
    } catch (error) {
      console.error('❌ Error fetching all statistics:', error);
      throw error;
    }
  }
};

export default statisticsAPI;