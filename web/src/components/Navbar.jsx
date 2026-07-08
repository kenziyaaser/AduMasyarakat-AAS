import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, PlusCircle, Shield, User } from 'lucide-react';
import { API_URL } from '../config';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Shield size={24} style={{ color: 'var(--primary)' }} />
        AduMasyarakat
      </Link>

      {user ? (
        <>
          <ul className="navbar-menu">
            {user.role === 'admin' || user.role === 'superadmin' ? (
              <li>
                <Link 
                  to="/dashboard" 
                  className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard Admin
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    Pengaduan Saya
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/new" 
                    className={`navbar-item ${location.pathname === '/new' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <PlusCircle size={16} />
                    Buat Pengaduan
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="navbar-user">
            <Link to="/profile" className="navbar-profile-link" title="Lihat Profil">
              {user.avatar ? (
                <img 
                  src={`${API_URL}/uploads/${user.avatar}`} 
                  alt={user.name} 
                  className="navbar-avatar" 
                />
              ) : (
                <div className="navbar-avatar-fallback">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="navbar-profile-name">{user.name}</span>
            </Link>
            <span className="user-badge">{user.role}</span>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              title="Logout"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </>
      ) : (
        <div className="navbar-user" style={{ gap: '1.2rem' }}>
          <Link to="/login" className="navbar-item" style={{ textDecoration: 'none' }}>
            Masuk
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Daftar Sekarang
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
