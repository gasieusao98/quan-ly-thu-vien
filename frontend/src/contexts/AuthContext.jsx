import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 [AuthContext] Starting auth check on app load...');
      
      // ✅ THAY: localStorage → sessionStorage (DEV)
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      
      console.log('📦 [AuthContext] Stored data:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser
      });

      // ✅ FIX: Nếu không có token hoặc user, set user = null ngay
      if (!storedToken || !storedUser) {
        console.log('❌ [AuthContext] No token/user found → Login page will be shown');
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      // Nếu có token, verify với backend
      try {
        console.log('✅ [AuthContext] Token found, verifying with backend...');
        const response = await authService.getMe();
        
        console.log('✅ [AuthContext] Token verified! User:', {
          username: response.data.data.username,
          role: response.data.data.role
        });
        
        setUser(response.data.data);
        setToken(storedToken);
        
      } catch (error) {
        // ✅ FIX: Khi verify fail, xóa sessionStorage VÀ set user = null
        console.error('❌ [AuthContext] Token verification FAILED:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
        
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 [AuthContext] Attempting login with username:', credentials.username);
      setLoading(true);
      
      const response = await authService.login(credentials);
      const { token, user } = response.data.data;
      
      console.log('✅ [AuthContext] Login successful! User:', {
        username: user.username,
        role: user.role
      });
      
      // ✅ THAY: localStorage → sessionStorage (DEV)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setLoading(false);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      console.error('❌ [AuthContext] Login failed:', errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 [AuthContext] Logging out...');
    // ✅ THAY: localStorage → sessionStorage (DEV)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        loading,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};