import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import PublicHome from './pages/public/PublicHome';
import PrivateHome from './pages/private/PrivateHome';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import { storage } from './services/httpService';
import { AuthProvider, useAuth } from './context/AuthContext';

function RequireAuth({ children }) {
  const token = storage.getAccessToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RoutesSwitch() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return isAuthenticated ? (
    <Routes>
      <Route path="/private" element={<RequireAuth><PrivateHome /></RequireAuth>} />
      <Route path="/" element={<Navigate to="/private" replace />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/private" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ padding: 10, background: '#eee' }}>
          <Link to="/">Public</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/private">Private</Link>
        </nav>
        <RoutesSwitch />
      </BrowserRouter>
    </AuthProvider>
  );
}
