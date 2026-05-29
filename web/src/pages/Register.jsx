import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      setSuccess('Registrasi berhasil! Mengalihkan ke halaman masuk...');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Gagal mendaftar. Silakan coba lagi.'
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
          <h1 className="auth-banner-title">Bergabunglah dan Suarakan Aspirasi Anda</h1>
          <p className="auth-banner-text">
            Bersama jutaan masyarakat aktif lainnya, pantau perkembangan infrastruktur dan pelayanan publik demi kemajuan daerah Anda.
          </p>
          <div className="auth-banner-quote">
            "Kolaborasi yang erat antara masyarakat yang peduli dan pemerintah yang responsif adalah kunci dari kemajuan daerah."
          </div>
        </div>
      </div>

      {/* Form Sisi Kanan */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem', color: 'var(--primary)' }}>
            <Shield size={48} />
          </div>
          <h2 className="auth-title">Daftar Akun</h2>
          <p className="auth-subtitle">Buat akun untuk membuat pengaduan Anda</p>

          {error && (
            <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="name" style={{ marginBottom: '0.25rem' }}>Nama Lengkap</label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="email" style={{ marginBottom: '0.25rem' }}>Email</label>
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

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="role" style={{ marginBottom: '0.25rem' }}>Daftar Sebagai</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Masyarakat (User)</option>
                <option value="admin">Petugas (Admin)</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: '0.25rem' }}>Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="confirmPassword" style={{ marginBottom: '0.25rem' }}>Konfirmasi Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Masukkan kembali password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="loading-spinner" style={{ width: '20px', height: '20px', margin: '0' }}></span> : 'Daftar'}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '1.25rem' }}>
            Sudah punya akun?{' '}
            <Link to="/login" className="auth-link">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
