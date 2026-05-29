import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Image as ImageIcon, Send, ArrowLeft, X, AlertCircle } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const CreateComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Hanya file gambar yang diizinkan!');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal adalah 5MB.');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Judul dan isi pengaduan wajib diisi.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    if (latitude) {
      formData.append('latitude', latitude);
    }
    if (longitude) {
      formData.append('longitude', longitude);
    }

    try {
      await axios.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Pengaduan berhasil dikirim.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Gagal mengirimkan pengaduan. Coba lagi nanti.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>

      <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Buat Pengaduan Baru</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Sampaikan laporan atau aspirasi Anda dengan detail dan jujur. Lampirkan foto jika diperlukan.
        </p>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Judul Pengaduan</label>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="Tuliskan pokok permasalahan (misal: Jalan Rusak, Saluran Mampet)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Isi Pengaduan / Deskripsi</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Ceritakan detail kronologi kejadian, lokasi lengkap, dan harapan Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <MapComponent 
            latitude={latitude}
            longitude={longitude}
            onLocationSelect={handleLocationSelect}
          />

          <div className="form-group">
            <label className="form-label">Foto Pendukung (Opsional)</label>
            {!imagePreview ? (
              <div 
                style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => document.getElementById('image-upload').click()}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <ImageIcon size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Klik untuk mengunggah gambar pendukung
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Format: PNG, JPG, JPEG, WEBP (Maks. 5MB)
                </p>
              </div>
            ) : (
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(239, 68, 68, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Hapus Foto"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              disabled={loading}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? 'Mengirim...' : (
                <>
                  <Send size={16} />
                  Kirim Laporan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
