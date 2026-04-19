import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🅿️</span>
          <span className="brand-name">SmartPark</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/parking" className={`nav-link ${isActive('/parking') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Find Parking</Link>
          {user && <Link to="/bookings" className={`nav-link ${isActive('/bookings') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                  <Link to="/bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>📋 My Bookings</Link>
                  {isAdmin && <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>}
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
