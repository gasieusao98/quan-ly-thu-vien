import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Loading from './components/common/Loading';

// THÊM VÀO ĐẦU FILE
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Books from './pages/admin/Books';
import Members from './pages/admin/Members';
import Transactions from './pages/admin/Transactions';
import Reservations from './pages/admin/Reservations';
import Librarians from './pages/admin/Librarians';
import Statistics from './pages/admin/Statistics'; // 🆕 THÊM

// Reader Pages
import ReaderDashboard from './pages/reader/ReaderDashboard';
import ReaderBooks from './pages/reader/ReaderBooks';
import ReaderHistory from './pages/reader/ReaderHistory';
import ReaderReservations from './pages/reader/ReaderReservations';

// Shared Pages
import UserProfile from './components/common/UserProfile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Layout Components
import AdminLayout from './layouts/admin/AdminLayout';
import ReaderLayout from './layouts/reader/ReaderLayout';

// Import global styles
import './styles/main.css';

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Component cho public route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return !user ? children : <Navigate to="/" />;
};

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // PHÂN QUYỀN THEO ROLE - Nếu là Độc giả
  if (user.role === 'reader') {
    return (
      <Routes>
        <Route element={<ReaderLayout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <ReaderDashboard />
            </ProtectedRoute>
          } />
          <Route path="/books" element={
            <ProtectedRoute>
              <ReaderBooks />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <ReaderHistory />
            </ProtectedRoute>
          } />
          <Route path="/reservations" element={
            <ProtectedRoute>
              <ReaderReservations />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Nếu là Admin hoặc Thủ thư
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/books" element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        } />
        <Route path="/members" element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        } />
        <Route path="/librarians" element={
          <ProtectedRoute>
            <Librarians />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="/register" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;