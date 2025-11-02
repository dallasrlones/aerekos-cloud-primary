import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import PublicHome from './pages/public/PublicHome';
import PrivateHome from './pages/private/PrivateHome';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import { storage } from './services/httpService';
import { AuthProvider, useAuth } from './context/AuthContext';

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div style={{ padding: 20 }}>Loading... 🚀</div>;
  
  const token = storage.getAccessToken();
  if (!token || !isAuthenticated) return <Navigate to="/login" replace />;
  
  return <Outlet />;
}

function RoutesSwitch() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes - all wrapped by RequireAuth */}
      <Route element={<RequireAuth />}>
        <Route path="/private" element={<PrivateHome />} />
        {/* Add more private routes here as needed */}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <nav style={{ padding: 10, background: '#eee' }}>
          <Link to="/">Public</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/private">Private</Link>
        </nav> */}
        <RoutesSwitch />
      </BrowserRouter>
    </AuthProvider>
  );
}
