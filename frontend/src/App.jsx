import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadModule from './pages/UploadModule';
import ModuleDetail from './pages/ModuleDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><UploadModule /></PrivateRoute>} />
              <Route path="/modules/new" element={<PrivateRoute><UploadModule /></PrivateRoute>} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route
                path="*"
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <p className="text-6xl font-bold text-brand-500 mb-4">404</p>
                    <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
                    <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
