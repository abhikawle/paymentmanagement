import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/dashboard" className="brand-logo">
            💳 Payment Manager
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin Panel
            </Link>
          )}
          <div className="user-info">
            <span className="username">{user?.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
