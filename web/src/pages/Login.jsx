import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Semua field wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Gagal masuk. Silakan periksa kembali email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Banner Sisi Kiri (Hanya tampil di Desktop) */}
      <div className="auth-side-banner">
        <div className="auth-banner-logo">
          <Shield size={28} />
          <span>AduMasyarakat</span>
        </div>
        <div className="auth-banner-content">
          <h1 className="auth-banner-title">Perubahan Besar Dimulai Dari Laporan Anda</h1>
          <p className="auth-banner-text">
            Satu laporan Anda sangat berharga untuk menciptakan lingkungan yang lebih bersih, aman, tertib, dan nyaman bagi kita semua.
          </p>
          <div className="auth-banner-quote">
            "Keberanian untuk melapor dan bersuara adalah langkah pertama menuju pelayanan publik yang transparan dan bebas korupsi."
          </div>
        </div>
      </div>

      {/* Form Sisi Kanan */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Shield size={48} />
          </div>
          <h2 className="auth-title">AduMasyarakat</h2>
          <p className="auth-subtitle">Sistem Pengaduan Masyarakat Online</p>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="loading-spinner" style={{ width: '20px', height: '20px', margin: '0' }}></span> : 'Masuk'}
            </button>
          </form>

          <div className="auth-footer">
            Belum punya akun?{' '}
            <Link to="/register" className="auth-link">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
