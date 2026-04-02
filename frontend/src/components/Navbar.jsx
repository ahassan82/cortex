import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-700/50 transition-shadow">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                <polyline points="12,8 12,16" />
                <polyline points="7.5,10.5 16.5,10.5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Cortex</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-white bg-dark-700' : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-white bg-dark-700' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/upload') ? 'text-white bg-dark-700' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  Upload Module
                </Link>
              </>
            )}
          </div>

          {/* Auth buttons / user menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-dark-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white border border-dark-500 hover:border-dark-400 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-dark-600 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg">Dashboard</Link>
                <Link to="/upload" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg">Upload Module</Link>
                <div className="border-t border-dark-600 pt-2 mt-2">
                  <div className="px-4 py-2 text-sm text-gray-400">{user.email}</div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 rounded-lg">Logout</button>
                </div>
              </>
            ) : (
              <div className="border-t border-dark-600 pt-2 mt-2 flex gap-2 px-4">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm border border-dark-500 text-gray-300 rounded-lg">Log in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm bg-brand-600 text-white rounded-lg">Sign up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
