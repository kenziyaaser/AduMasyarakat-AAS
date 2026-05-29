import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Calendar, MessageSquare, AlertCircle, Clock, CheckCircle2, FileQuestion, X, Image as ImageIcon } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const DashboardUser = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pengaduan. Silakan muat ulang halaman.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    setDetailLoading(true);
    try {
      const response = await axios.get(`/complaints/${id}`);
      setSelectedComplaint(response.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil detail pengaduan.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedComplaint(null);
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
      case 'process':
        return <span className="badge badge-process"><Clock size={12} /> Diproses</span>;
      case 'done':
        return <span className="badge badge-done"><CheckCircle2 size={12} /> Selesai</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Pengaduan Saya</h1>
          <p className="dashboard-subtitle">Pantau status laporan dan aspirasi Anda di sini</p>
        </div>
        <Link to="/new" className="btn btn-primary">
          <PlusCircle size={18} />
          Buat Pengaduan
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['all', 'pending', 'process', 'done'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
          >
            {status === 'all' ? 'Semua' : status === 'process' ? 'Diproses' : status === 'done' ? 'Selesai' : 'Pending'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <FileQuestion size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">Belum Ada Pengaduan</h3>
          <p className="empty-state-desc">
            {filterStatus === 'all' 
              ? 'Anda belum pernah mengirimkan laporan pengaduan.' 
              : `Tidak ada pengaduan dengan status ${filterStatus}.`}
          </p>
          {filterStatus === 'all' && (
            <Link to="/new" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Kirim Pengaduan Pertama Anda
            </Link>
          )}
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="card complaint-card" onClick={() => handleOpenDetail(complaint.id)} style={{ cursor: 'pointer' }}>
              <div className="complaint-header">
                <span className="complaint-date">{formatDate(complaint.created_at)}</span>
                {getStatusBadge(complaint.status)}
              </div>
              <h3 className="complaint-title">{complaint.title}</h3>
              <p className="complaint-desc">{complaint.description}</p>
              
              {complaint.image && (
                <img 
                  src={`http://localhost:5000/uploads/${complaint.image}`} 
                  alt={complaint.title} 
                  className="complaint-image-preview" 
                />
              )}

              <div className="complaint-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={14} />
                  {complaint.response_message ? 'Sudah ditanggapi' : 'Belum ditanggapi'}
                </span>
                <span className="auth-link" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  Lihat Detail &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Pengaduan</h2>
              <button className="modal-close" onClick={handleCloseDetail}><X /></button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Dikirim pada: {formatDate(selectedComplaint.created_at)}
                </span>
                {getStatusBadge(selectedComplaint.status)}
              </div>

              <h1 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: '700' }}>{selectedComplaint.title}</h1>
              <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {selectedComplaint.description}
              </p>

              {selectedComplaint.image && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ImageIcon size={16} /> Lampiran Foto:
                  </h4>
                  <img 
                    src={`http://localhost:5000/uploads/${selectedComplaint.image}`} 
                    alt={selectedComplaint.title} 
                    className="detail-image" 
                  />
                </div>
              )}

              {selectedComplaint.latitude && selectedComplaint.longitude && (
                <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                  <MapComponent 
                    latitude={parseFloat(selectedComplaint.latitude)}
                    longitude={parseFloat(selectedComplaint.longitude)}
                    isReadOnly={true}
                    height="220px"
                  />
                </div>
              )}

              {/* Responses list */}
              <div className="responses-section">
                <h3 className="responses-title">Tanggapan Petugas ({selectedComplaint.responses?.length || 0})</h3>
                {(!selectedComplaint.responses || selectedComplaint.responses.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    Laporan Anda sedang menunggu tanggapan dan verifikasi dari petugas.
                  </p>
                ) : (
                  selectedComplaint.responses.map((resp) => (
                    <div key={resp.id} className="response-item">
                      <div className="response-meta">
                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Admin: {resp.admin_name}</span>
                        <span>{formatDate(resp.created_at)}</span>
                      </div>
                      <p className="response-text">{resp.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
