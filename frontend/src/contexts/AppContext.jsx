import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { bookService, memberService, transactionService, dashboardService, librarianService } from '../services';

// Initial state
const initialState = {
  books: [],
  members: [],
  transactions: [],
  librarians: [], // ✅ THÊM: State cho thủ thư
  loading: false,
  error: null,
  stats: {
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalMembers: 0,
    totalTransactions: 0,
    overdueBooks: 0,
    // ✅ THÊM: userStats cho reader
    userStats: {
      currentBorrows: 0,
      totalBorrows: 0,
      overdueBooks: 0,
      availableBooks: 0
    }
  },
  userTransactions: [],
  // ✅ THÊM: Dark Mode & Responsive State
  theme: 'light',
  sidebarOpen: false,
  isMobile: false
};

// Action types
export const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BOOKS: 'SET_BOOKS',
  SET_MEMBERS: 'SET_MEMBERS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_STATS: 'SET_STATS',
  SET_USER_TRANSACTIONS: 'SET_USER_TRANSACTIONS',
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',
  ADD_MEMBER: 'ADD_MEMBER',
  UPDATE_MEMBER: 'UPDATE_MEMBER',
  DELETE_MEMBER: 'DELETE_MEMBER',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  // ✅ THÊM: Dark Mode & Responsive Actions
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  // ✅ THÊM: Librarian Actions
  SET_LIBRARIANS: 'SET_LIBRARIANS',
  ADD_LIBRARIAN: 'ADD_LIBRARIAN',
  UPDATE_LIBRARIAN: 'UPDATE_LIBRARIAN',
  DELETE_LIBRARIAN: 'DELETE_LIBRARIAN'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.SET_BOOKS:
      return { ...state, books: action.payload, loading: false };
    
    case ACTION_TYPES.SET_MEMBERS:
      return { ...state, members: action.payload, loading: false };
    
    case ACTION_TYPES.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload, loading: false };
    
    case ACTION_TYPES.SET_STATS:
      return { ...state, stats: action.payload };
    
    case ACTION_TYPES.SET_USER_TRANSACTIONS:
      return { ...state, userTransactions: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_BOOK:
      return { ...state, books: [...state.books, action.payload] };
    
    case ACTION_TYPES.UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map(book => 
          book._id === action.payload._id ? action.payload : book
        )
      };
    
    case ACTION_TYPES.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter(book => book._id !== action.payload)
      };

    case ACTION_TYPES.ADD_MEMBER:
      return {
        ...state,
        members: [...state.members, action.payload]
      };

    case ACTION_TYPES.UPDATE_MEMBER:
      return {
        ...state,
        members: state.members.map(member =>
          member._id === action.payload._id ? action.payload : member
        )
      };

    case ACTION_TYPES.DELETE_MEMBER:
      return {
        ...state,
        members: state.members.filter(member => member._id !== action.payload)
      };

    case ACTION_TYPES.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        userTransactions: [...state.userTransactions, action.payload]
      };

    case ACTION_TYPES.UPDATE_TRANSACTION:
      const updatedTransactions = state.transactions.map(transaction =>
        transaction._id === action.payload._id ? action.payload : transaction
      );
      const updatedUserTransactions = state.userTransactions.map(transaction =>
        transaction._id === action.payload._id ? action.payload : transaction
      );
      
      return {
        ...state,
        transactions: updatedTransactions,
        userTransactions: updatedUserTransactions
      };

    // ✅ THÊM: Librarian Reducer Cases
    case ACTION_TYPES.SET_LIBRARIANS:
      return { ...state, librarians: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_LIBRARIAN:
      return {
        ...state,
        librarians: [...state.librarians, action.payload]
      };
    
    case ACTION_TYPES.UPDATE_LIBRARIAN:
      return {
        ...state,
        librarians: state.librarians.map(librarian =>
          librarian._id === action.payload._id ? action.payload : librarian
        )
      };
    
    case ACTION_TYPES.DELETE_LIBRARIAN:
      return {
        ...state,
        librarians: state.librarians.filter(librarian => librarian._id !== action.payload)
      };

    // ✅ THÊM: Dark Mode & Responsive Reducer Cases
    case ACTION_TYPES.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTION_TYPES.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: newTheme };
    
    case ACTION_TYPES.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
    
    case ACTION_TYPES.SET_IS_MOBILE:
      return { ...state, isMobile: action.payload };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ✅ THÊM: Initialize theme and responsive detection
  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('library-theme') || 'light';
    dispatch({ type: ACTION_TYPES.SET_THEME, payload: savedTheme });
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Check if mobile on mount
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < 768;
      dispatch({ type: ACTION_TYPES.SET_IS_MOBILE, payload: isMobile });
    };

    checkIsMobile();

    // Add resize listener for responsive detection
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch({ type: ACTION_TYPES.SET_IS_MOBILE, payload: isMobile });
      
      // Auto-close sidebar on mobile when resizing to desktop
      if (window.innerWidth >= 768 && state.sidebarOpen) {
        dispatch({ type: ACTION_TYPES.SET_SIDEBAR_OPEN, payload: false });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.sidebarOpen]);

  // ✅ SỬA: Đơn giản hóa - không dùng useCallback, tạo actions một lần
  const actions = React.useMemo(() => ({
    // Basic actions
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    
    // ✅ THÊM: Dark Mode & Responsive Actions
    setTheme: (theme) => {
      localStorage.setItem('library-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme });
    },
    
    toggleTheme: () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('library-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      dispatch({ type: ACTION_TYPES.TOGGLE_THEME });
    },
    
    setSidebarOpen: (open) => dispatch({ type: ACTION_TYPES.SET_SIDEBAR_OPEN, payload: open }),
    
    toggleSidebar: () => dispatch({ type: ACTION_TYPES.SET_SIDEBAR_OPEN, payload: !state.sidebarOpen }),
    
    closeSidebar: () => dispatch({ type: ACTION_TYPES.SET_SIDEBAR_OPEN, payload: false }),
    
    // Book actions
    fetchBooks: async (params = {}) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await bookService.getAll(params);
        dispatch({ type: ACTION_TYPES.SET_BOOKS, payload: response.data.books });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    },
    
    addBook: async (bookData) => {
      try {
        const response = await bookService.create(bookData);
        dispatch({ type: ACTION_TYPES.ADD_BOOK, payload: response.data.book });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    updateBook: async (id, bookData) => {
      try {
        const response = await bookService.update(id, bookData);
        dispatch({ type: ACTION_TYPES.UPDATE_BOOK, payload: response.data.book });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    deleteBook: async (id) => {
      try {
        await bookService.delete(id);
        dispatch({ type: ACTION_TYPES.DELETE_BOOK, payload: id });
      } catch (error) {
        throw error;
      }
    },
    
    // Member actions - ✅ SỬA HOÀN TOÀN: Xử lý nhiều cấu trúc response
    fetchMembers: async (params = {}) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await memberService.getAll(params);
        
        // ✅ DEBUG: Log toàn bộ response để xem cấu trúc
        console.log('🔍 fetchMembers Response:', response);
        
        // ✅ FIX: Xử lý các cấu trúc response khác nhau
        let membersData = [];
        
        if (response.data) {
          // Case 1: { data: { members: [...] } } - cấu trúc phổ biến
          if (Array.isArray(response.data.members)) {
            membersData = response.data.members;
          } 
          // Case 2: { data: [...] } - data là array trực tiếp
          else if (Array.isArray(response.data)) {
            membersData = response.data;
          }
          // Case 3: { data: { data: [...] } } - nested data
          else if (Array.isArray(response.data.data)) {
            membersData = response.data.data;
          }
          // Case 4: { data: { users: [...] } } - có thể là users thay vì members
          else if (Array.isArray(response.data.users)) {
            membersData = response.data.users;
          }
        } 
        // Case 5: Response trực tiếp là array
        else if (Array.isArray(response)) {
          membersData = response;
        }
        // Case 6: { members: [...] } - không có data wrapper
        else if (Array.isArray(response.members)) {
          membersData = response.members;
        }
        
        console.log('📋 Processed members data:', membersData);
        
        // ✅ ĐẢM BẢO: Luôn dispatch một array
        if (!Array.isArray(membersData)) {
          console.warn('❌ Members data is not an array, defaulting to empty array');
          membersData = [];
        }
        
        dispatch({ type: ACTION_TYPES.SET_MEMBERS, payload: membersData });
      } catch (error) {
        console.error('❌ Error fetching members:', error);
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    },

    addMember: async (memberData) => {
      try {
        const response = await memberService.create(memberData);
        dispatch({ type: ACTION_TYPES.ADD_MEMBER, payload: response.data.member });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    updateMember: async (id, memberData) => {
      try {
        const response = await memberService.update(id, memberData);
        dispatch({ type: ACTION_TYPES.UPDATE_MEMBER, payload: response.data.member });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    deleteMember: async (id) => {
      try {
        await memberService.delete(id);
        dispatch({ type: ACTION_TYPES.DELETE_MEMBER, payload: id });
      } catch (error) {
        throw error;
      }
    },

    // ✅ THÊM: Librarian actions
    fetchLibrarians: async (params = {}) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await librarianService.getAll(params);
        
        // Xử lý response tương tự như members
        let librariansData = [];
        
        if (response.data) {
          if (Array.isArray(response.data.data)) {
            librariansData = response.data.data;
          } else if (Array.isArray(response.data)) {
            librariansData = response.data;
          } else if (Array.isArray(response.data.librarians)) {
            librariansData = response.data.librarians;
          }
        } else if (Array.isArray(response)) {
          librariansData = response;
        }
        
        if (!Array.isArray(librariansData)) {
          console.warn('❌ Librarians data is not an array, defaulting to empty array');
          librariansData = [];
        }
        
        dispatch({ type: ACTION_TYPES.SET_LIBRARIANS, payload: librariansData });
      } catch (error) {
        console.error('❌ Error fetching librarians:', error);
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    },

    addLibrarian: async (librarianData) => {
      try {
        const response = await librarianService.create(librarianData);
        dispatch({ type: ACTION_TYPES.ADD_LIBRARIAN, payload: response.data.data });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    updateLibrarian: async (id, librarianData) => {
      try {
        const response = await librarianService.update(id, librarianData);
        dispatch({ type: ACTION_TYPES.UPDATE_LIBRARIAN, payload: response.data.data });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    deleteLibrarian: async (id) => {
      try {
        await librarianService.delete(id);
        dispatch({ type: ACTION_TYPES.DELETE_LIBRARIAN, payload: id });
      } catch (error) {
        throw error;
      }
    },

    // Transaction actions
    fetchTransactions: async (params = {}) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await transactionService.getAll(params);
        dispatch({ type: ACTION_TYPES.SET_TRANSACTIONS, payload: response.data.data });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    },

    // User transactions
    fetchUserTransactions: async () => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await transactionService.getUserTransactions();
        dispatch({ type: ACTION_TYPES.SET_USER_TRANSACTIONS, payload: response.data.data });
        return response.data;
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    borrowBook: async (borrowData) => {
      try {
        const response = await transactionService.borrow(borrowData);
        dispatch({ type: ACTION_TYPES.ADD_TRANSACTION, payload: response.data.data });
        
        // ✅ FIX: XÓA - Đừng gọi getUserTransactions khi Admin tạo giao dịch
        // Lý do: Admin không phải thành viên, nên sẽ bị lỗi "Thành viên chưa được đăng ký"
        // const userTransactionsResponse = await transactionService.getUserTransactions();
        // dispatch({ type: ACTION_TYPES.SET_USER_TRANSACTIONS, payload: userTransactionsResponse.data.data });
        
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    returnBook: async (id) => {
      try {
        const response = await transactionService.return(id);
        dispatch({ type: ACTION_TYPES.UPDATE_TRANSACTION, payload: response.data.data });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    extendBorrow: async (id, extendData) => {
      try {
        const response = await transactionService.extend(id, extendData);
        dispatch({ type: ACTION_TYPES.UPDATE_TRANSACTION, payload: response.data.data });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    calculateFine: async (id) => {
      try {
        const response = await transactionService.calculateFine(id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Stats actions
    fetchStats: async () => {
      try {
        const response = await dashboardService.getStats();
        
        // Map data từ backend structure sang frontend structure
        const backendData = response.data.data;
        console.log('📊 Backend stats data:', backendData); // Debug
        
        let mappedStats = {
          totalBooks: 0,
          availableBooks: 0,
          borrowedBooks: 0,
          totalMembers: 0,
          totalTransactions: 0,
          overdueBooks: 0,
          userStats: {
            currentBorrows: 0,
            totalBorrows: 0,
            overdueBooks: 0,
            availableBooks: 0
          }
        };

        // Xử lý khác nhau cho admin và reader
        if (backendData.userStats) {
          // Reader dashboard - dùng userStats
          mappedStats = {
            totalBooks: backendData.books?.total || 0,
            availableBooks: backendData.books?.available || 0,
            borrowedBooks: 0, // Reader không cần biết
            totalMembers: 0,
            totalTransactions: 0,
            overdueBooks: backendData.userStats.overdueBooks || 0,
            userStats: {
              currentBorrows: backendData.userStats.currentBorrows || 0,
              totalBorrows: backendData.userStats.totalBorrows || 0,
              overdueBooks: backendData.userStats.overdueBooks || 0,
              availableBooks: backendData.userStats.availableBooks || backendData.books?.available || 0
            }
          };
        } else {
          // Admin dashboard - dùng data tổng
          mappedStats = {
            totalBooks: backendData.books?.total || 0,
            availableBooks: backendData.books?.available || 0,
            borrowedBooks: backendData.books?.borrowed || 0,
            totalMembers: backendData.members || 0,
            totalTransactions: backendData.transactions || 0,
            overdueBooks: backendData.overdue || 0,
            userStats: {
              currentBorrows: 0,
              totalBorrows: 0,
              overdueBooks: 0,
              availableBooks: backendData.books?.available || 0
            }
          };
        }
        
        console.log('📊 Mapped stats:', mappedStats);
        dispatch({ type: ACTION_TYPES.SET_STATS, payload: mappedStats });
        return mappedStats;
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // Reader books
    fetchReaderBooks: async (params = {}) => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        const response = await bookService.getAll(params);
        const availableBooks = response.data.books.filter(book => book.availableCopies > 0);
        dispatch({ type: ACTION_TYPES.SET_BOOKS, payload: availableBooks });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    },

    // Search books
    searchBooks: async (searchTerm, category = 'all') => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        
        let params = {};
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (category !== 'all') {
          params.category = category;
        }

        const response = await bookService.getAll(params);
        const availableBooks = response.data.books.filter(book => book.availableCopies > 0);
        dispatch({ type: ACTION_TYPES.SET_BOOKS, payload: availableBooks });
      } catch (error) {
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      }
    }
  }), [state.theme, state.sidebarOpen]); // ✅ Thêm dependencies cho theme và sidebar

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// ✅ THÊM: Hook riêng cho Dark Mode & Responsive (tùy chọn)
export const useAppTheme = () => {
  const { state, actions } = useAppContext();
  
  return {
    theme: state.theme,
    toggleTheme: actions.toggleTheme,
    setTheme: actions.setTheme,
    isDark: state.theme === 'dark',
    isMobile: state.isMobile,
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: actions.setSidebarOpen,
    toggleSidebar: actions.toggleSidebar,
    closeSidebar: actions.closeSidebar
  };
};