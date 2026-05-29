import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Camera, User, Mail, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Hanya file gambar yang diperbolehkan.');
        return;
      }
      setError('');
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin / Petugas';
      case 'user':
        return 'Masyarakat';
      default:
        return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'superadmin':
        return 'badge-superadmin';
      case 'admin':
        return 'badge-admin';
      default:
        return 'badge-user';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Nama dan email tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await axios.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update global context & local storage
      updateUser(response.data.user);
      setSuccess('Profil Anda berhasil diperbarui!');
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}
      >
        <ArrowLeft size={16} />
        Kembali ke Dashboard
      </button>

      <div className="profile-card">
        <div className="profile-title-section">
          <h1 className="profile-main-title">Profil Saya</h1>
          <p className="profile-sub-title">Kelola detail informasi akun dan foto profil Anda</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-avatar-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="avatar-edit-container" onClick={handleAvatarClick} title="Pilih Foto Baru">
              {avatarPreview ? (
                <img src={avatarPreview} alt={name} className="profile-avatar-big" />
              ) : (
                <div className="profile-avatar-fallback-big">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="avatar-overlay">
                <Camera size={14} />
                <span>Ubah Foto</span>
              </div>
            </div>
            <p className="avatar-help-text">Maksimal ukuran file gambar adalah 5MB</p>
          </div>

          <div className="profile-form-grid">
            <div className="form-group">
              <label htmlFor="profile-name">Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  id="profile-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Peran / Hak Akses</label>
            <div className="badge-wrapper">
              <span className={`profile-badge-large ${getRoleBadgeClass(user?.role)}`}>
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>

          <div className="profile-action-buttons">
            <button 
              type="button" 
              onClick={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setAvatarFile(null);
                setAvatarPreview(user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : null);
                setError('');
                setSuccess('');
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
