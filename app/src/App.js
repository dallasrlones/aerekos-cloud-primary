import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import PublicHome from './pages/public/PublicHome';
import PrivateHome from './pages/private/PrivateHome';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import { storage } from './services/httpService';
import { AuthProvider, useAuth } from './context/AuthContext';

import LogOut from './pages/private/LogOut';

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div style={{ padding: 20 }}>Loading... 🚀</div>;
  
  const token = storage.getAccessToken();
  if (!token || !isAuthenticated) return <Navigate to="/login" replace />;
  
  return <Outlet />;
}

// Dynamic component loader
const loadComponent = (route, component) => {
  return lazy(() => import(`./pages/private/${route}/${component}.js`));
};

function generateCRUDRoutes(routes) {
  return routes.flatMap((route) => {
    const Create = loadComponent(route, 'Create');
    const Details = loadComponent(route, 'Details');
    const List = loadComponent(route, 'List');
    const Edit = loadComponent(route, 'Edit');

    return [
      <Route 
        key={`${route}-list`}
        path={`/${route}`} 
        element={
          <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <List />
          </Suspense>
        } 
      />,
      <Route 
        key={`${route}-create`}
        path={`/${route}/create`} 
        element={
          <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <Create />
          </Suspense>
        } 
      />,
      <Route 
        key={`${route}-details`}
        path={`/${route}/:id`} 
        element={
          <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <Details />
          </Suspense>
        } 
      />,
      <Route 
        key={`${route}-edit`}
        path={`/${route}/:id/edit`} 
        element={
          <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <Edit />
          </Suspense>
        } 
      />
    ];
  });
}

function RoutesSwitch() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/logout" element={<LogOut />} />
      
      {/* Protected routes - all wrapped by RequireAuth */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<PrivateHome />} />
        {generateCRUDRoutes([
          'devices', 
          'docker_containers', 
          'projects', 
          'aerekos_services',
          'storage',
          'cdn',
          'database',
          'cache',
          'queue',
          'compute',
          'container',
          'serverless',
          'loadbalancer',
          'dns',
          'monitoring',
          'logging',
          'secrets',
          'registry',
          'api_keys',
        ])}
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
