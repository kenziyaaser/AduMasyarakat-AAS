import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  ArrowRight, 
  Clock, 
  Lock, 
  CheckCircle, 
  MessageSquare, 
  FileText, 
  Smartphone, 
  AlertCircle, 
  Sparkles,
  Search
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Sistem Pengaduan Online Resmi</span>
        </div>
        
        <h1 className="hero-title">
          Suara Anda Perubahan Kita,<br />
          Laporkan Keluhan Secara <span>Cepat & Transparan</span>
        </h1>
        
        <p className="hero-description">
          AduMasyarakat memfasilitasi Anda untuk melaporkan masalah fasilitas umum, lingkungan, dan pelayanan publik secara instan. Mari bersama-sama wujudkan lingkungan yang lebih baik.
        </p>
        
        <div className="hero-buttons">
          <button onClick={handleCtaClick} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            {user ? 'Masuk ke Dashboard' : 'Laporkan Sekarang'}
            <ArrowRight size={18} />
          </button>
          {!user && (
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', textDecoration: 'none' }}>
              Daftar Akun Baru
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">120+</div>
          <div className="stat-label">Total Laporan Masuk</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">45</div>
          <div className="stat-label">Sedang Diproses</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">72</div>
          <div className="stat-label">Selesai Ditangani</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Layanan Pemantauan</div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Kenapa Menggunakan AduMasyarakat?</h2>
          <p className="section-subtitle">
            Kami menghadirkan platform pelaporan yang andal, transparan, dan mudah diakses oleh seluruh lapisan masyarakat.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Clock size={24} />
            </div>
            <h3 className="feature-title">Real-Time Update</h3>
            <p className="feature-desc">
              Pantau status penanganan pengaduan Anda secara real-time langsung dari dashboard atau aplikasi mobile.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Lock size={24} />
            </div>
            <h3 className="feature-title">Aman & Terpercaya</h3>
            <p className="feature-desc">
              Semua informasi pengadu dijaga kerahasiaannya dengan sistem autentikasi dan keamanan yang mutakhir.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <CheckCircle size={24} />
            </div>
            <h3 className="feature-title">Respon Administratif Cepat</h3>
            <p className="feature-desc">
              Tanggapan resmi langsung dari admin instansi terkait untuk setiap laporan yang masuk.
            </p>
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <h2 className="section-title">Alur Pengaduan</h2>
          <p className="section-subtitle">
            Ikuti 4 langkah mudah untuk melaporkan dan menyelesaikan permasalahan di sekitar Anda.
          </p>
        </div>
        
        <div className="process-grid">
          <div className="process-step">
            <div className="process-number">1</div>
            <h3 className="process-step-title">Tulis Laporan</h3>
            <p className="process-step-desc">Tulis keluhan secara rinci dan unggah foto bukti pendukung yang valid.</p>
          </div>
          <div className="process-step">
            <div className="process-number">2</div>
            <h3 className="process-step-title">Verifikasi Laporan</h3>
            <p className="process-step-desc">Admin kami akan memeriksa kelayakan dan memvalidasi kebenaran laporan Anda.</p>
          </div>
          <div className="process-step">
            <div className="process-number">3</div>
            <h3 className="process-step-title">Tindak Lanjut</h3>
            <p className="process-step-desc">Laporan disetujui, diproses, dan ditindaklanjuti oleh petugas di lapangan.</p>
          </div>
          <div className="process-step">
            <div className="process-number">4</div>
            <h3 className="process-step-title">Laporan Selesai</h3>
            <p className="process-step-desc">Status laporan berubah menjadi selesai dan admin memberikan tanggapan resmi.</p>
          </div>
        </div>
      </section>

      {/* Mobile Promo / Integration Section */}
      <section className="cta-wrapper" style={{ marginTop: '2rem' }}>
        <div className="cta-card" style={{ background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(99, 102, 241, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <Smartphone size={48} style={{ color: '#818cf8', marginBottom: '0.5rem' }} />
          <h2 className="cta-title">Tersedia Juga di Android & iOS</h2>
          <p className="cta-desc">
            Dapatkan kemudahan melapor langsung dari smartphone Anda. Unduh aplikasi mobile Expo React Native kami untuk melaporkan masalah secara instan dengan akses kamera langsung.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="user-badge" style={{ color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)', padding: '0.5rem 1rem' }}>Expo Powered</span>
            <span className="user-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)', padding: '0.5rem 1rem' }}>Sistem Notifikasi</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-wrapper">
        <div className="cta-card">
          <h2 className="cta-title">Siap Melaporkan Masalah Hari Ini?</h2>
          <p className="cta-desc">
            Setiap tindakan kecil Anda sangat berharga bagi kenyamanan bersama. Laporkan permasalahan di lingkungan sekitar Anda sekarang juga secara transparan.
          </p>
          <button onClick={handleCtaClick} className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
            {user ? 'Masuk ke Dashboard Saya' : 'Mulai Lapor Sekarang'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <Shield size={24} style={{ color: 'var(--primary)' }} />
          <span>AduMasyarakat</span>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} AduMasyarakat. Hak Cipta Dilindungi Undang-Undang.
        </p>
        <p className="footer-text" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Dibuat dengan dedikasi untuk transparansi fasilitas umum & ketertiban masyarakat.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
