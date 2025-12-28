import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 [AuthContext] Starting auth check on app load...');
      
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      
      console.log('📦 [AuthContext] Stored data:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser
      });

      if (!storedToken || !storedUser) {
        console.log('❌ [AuthContext] No token/user found → Login page will be shown');
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

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
      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setLoading(false);
      
      // ✅ Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/');
      }, 300);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      console.error('❌ [AuthContext] Login failed:', errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 [AuthContext] Attempting register with username:', userData.username);
      setLoading(true);
      
      const response = await authService.register(userData);
      
      console.log('✅ [AuthContext] Registration successful!', response.data.data);
      
      setLoading(false);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      console.error('❌ [AuthContext] Registration failed:', errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 [AuthContext] Logging out...');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login,
        register,
        logout, 
        loading,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};