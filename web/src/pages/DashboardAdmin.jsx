import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Trash2, MessageSquare, AlertCircle, Clock, CheckCircle2, FileQuestion, X, Image as ImageIcon, Send, User, Users, UserCheck, UserX, ShieldAlert } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { API_URL } from '../config';

const DashboardAdmin = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Response form state
  const [responseMsg, setResponseMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Superadmin User Management State
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' or 'users'
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    fetchComplaints();
    if (user && user.role === 'superadmin') {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const response = await axios.get('/auth/users');
      setUsersList(response.data);
    } catch (err) {
      console.error(err);
      setUsersError('Gagal mengambil data daftar pengguna.');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers();
    } else {
      fetchComplaints();
    }
  };

  const handleToggleUserRole = async (targetId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    const actionLabel = newRole === 'admin' 
      ? 'menjadikan pengguna ini sebagai Petugas (Admin)' 
      : 'kembalikan pengguna ini menjadi Masyarakat biasa';
    
    if (!window.confirm(`Apakah Anda yakin ingin ${actionLabel}?`)) return;

    try {
      await axios.put(`/auth/users/${targetId}/role`, { role: newRole });
      setUsersList(
        usersList.map((u) => (u.id === targetId ? { ...u, role: newRole } : u))
      );
      alert('Peran pengguna berhasil diperbarui.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mengubah peran pengguna.');
    }
  };

  const handleDeleteUser = async (targetId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun pengguna ini secara permanen? Semua data laporan pengaduan dari pengguna ini juga akan ikut terhapus.')) return;

    try {
      await axios.delete(`/auth/users/${targetId}`);
      setUsersList(usersList.filter((u) => u.id !== targetId));
      alert('Akun pengguna berhasil dihapus.');
      // Refresh complaints since some might belong to the deleted user
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menghapus akun pengguna.');
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pengaduan seluruh masyarakat.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const response = await axios.get(`/complaints/${id}`);
      setSelectedComplaint(response.data);
      setResponseMsg('');
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil detail pengaduan.');
    }
  };

  const handleCloseDetail = () => {
    setSelectedComplaint(null);
    setResponseMsg('');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering open detail
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini secara permanen?')) return;

    try {
      await axios.delete(`/complaints/${id}`);
      setComplaints(complaints.filter((c) => c.id !== id));
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint(null);
      }
      alert('Pengaduan berhasil dihapus.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menghapus pengaduan.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/complaints/${id}/status`, { status: newStatus });
      
      // Update in main list
      setComplaints(
        complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      // Update in modal detail if open
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal memperbarui status.');
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseMsg.trim()) return;

    setSubmitLoading(true);
    try {
      const response = await axios.post('/responses', {
        complaint_id: selectedComplaint.id,
        message: responseMsg
      });

      alert('Tanggapan berhasil dikirim.');

      // Refresh detail data to show the new response
      const updatedDetail = await axios.get(`/complaints/${selectedComplaint.id}`);
      setSelectedComplaint(updatedDetail.data);
      setResponseMsg('');

      // Refresh main dashboard list
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mengirim tanggapan.');
    } finally {
      setSubmitLoading(false);
    }
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
      <div className="dashboard-header" style={{ marginBottom: user.role === 'superadmin' ? '1rem' : '2.5rem' }}>
        <div>
          <h1 className="dashboard-title">Panel Admin Pengaduan</h1>
          <p className="dashboard-subtitle">Kelola dan tanggapi seluruh laporan dari masyarakat</p>
        </div>
      </div>

      {/* Super Admin Navigation Tabs */}
      {user && user.role === 'superadmin' && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', gap: '1.5rem' }}>
          <button 
            onClick={() => handleTabChange('complaints')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              color: activeTab === 'complaints' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'complaints' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MessageSquare size={18} />
            Laporan Pengaduan
          </button>
          <button 
            onClick={() => handleTabChange('users')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={18} />
            Manajemen Pengguna
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Render Complaints Tab */}
      {activeTab === 'complaints' && (
        <>
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
              <h3 className="empty-state-title">Tidak Ada Laporan</h3>
              <p className="empty-state-desc">
                {filterStatus === 'all' 
                  ? 'Belum ada masyarakat yang mengirimkan pengaduan.' 
                  : `Tidak ada pengaduan dengan status ${filterStatus}.`}
              </p>
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
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: '500' }}>
                    <User size={14} />
                    <span>Oleh: {complaint.user_name} ({complaint.user_email})</span>
                  </div>

                  <p className="complaint-desc">{complaint.description}</p>
                  
                  {complaint.image && (
                    <img 
                      src={`${API_URL}/uploads/${complaint.image}`} 
                      alt={complaint.title} 
                      className="complaint-image-preview" 
                    />
                  )}

                  <div className="complaint-footer">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <MessageSquare size={14} />
                      {complaint.response_message ? 'Sudah ditanggapi' : 'Butuh tanggapan'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {user && user.role === 'superadmin' && (
                        <button 
                          onClick={(e) => handleDelete(complaint.id, e)} 
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <span className="auth-link" style={{ fontSize: '0.85rem', fontWeight: '600', alignSelf: 'center' }}>
                        Tanggapi &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Render User Management Tab */}
      {activeTab === 'users' && user && user.role === 'superadmin' && (
        <>
          {usersError && <div className="alert alert-danger">{usersError}</div>}
          
          {usersLoading ? (
            <div className="loading-spinner"></div>
          ) : usersList.length === 0 ? (
            <div className="empty-state">
              <Users size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">Tidak Ada Pengguna</h3>
              <p className="empty-state-desc">Belum ada pengguna terdaftar lain di dalam database.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Pengguna</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Peran</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>Terdaftar Pada</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {usr.avatar ? (
                          <img 
                            src={`${API_URL}/uploads/${usr.avatar}`} 
                            alt={usr.name} 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: usr.role === 'admin' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                            color: usr.role === 'admin' ? '#4f46e5' : '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}>
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: '500' }}>{usr.name}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{usr.email}</td>
                      <td style={{ padding: '1rem' }}>
                        {usr.role === 'admin' ? (
                          <span className="badge badge-process" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}><ShieldAlert size={12} /> Admin</span>
                        ) : usr.role === 'superadmin' ? (
                          <span className="badge badge-done" style={{ fontSize: '0.75rem', textTransform: 'none', letterSpacing: 'normal' }}><ShieldAlert size={12} /> Super Admin</span>
                        ) : (
                          <span className="badge badge-pending" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', borderColor: 'rgba(37, 99, 235, 0.2)', textTransform: 'none', letterSpacing: 'normal' }}><User size={12} /> Masyarakat</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {formatDate(usr.created_at)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleUserRole(usr.id, usr.role)}
                            className="btn btn-secondary"
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              borderColor: usr.role === 'user' ? 'rgba(79, 70, 229, 0.3)' : 'rgba(37, 99, 235, 0.3)',
                              color: usr.role === 'user' ? '#4f46e5' : '#2563eb'
                            }}
                            title={usr.role === 'user' ? 'Jadikan Admin' : 'Kembalikan Jadi User'}
                          >
                            <UserCheck size={14} />
                            {usr.role === 'user' ? 'Jadikan Admin' : 'Jadikan User'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="btn btn-danger"
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Hapus Akun"
                          >
                            <UserX size={14} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Detail Modal for Admin */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kelola Pengaduan</h2>
              <button className="modal-close" onClick={handleCloseDetail}><X /></button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <p>Pengirim: <strong style={{ color: 'var(--text-primary)' }}>{selectedComplaint.user_name}</strong> ({selectedComplaint.user_email})</p>
                  <p>Tanggal: {formatDate(selectedComplaint.created_at)}</p>
                </div>
                
                {/* Status Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="status-select" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</label>
                  <select 
                    id="status-select" 
                    value={selectedComplaint.status} 
                    onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value)}
                    className="form-control"
                    style={{ width: '130px', padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="process">Diproses</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>{selectedComplaint.title}</h1>
              <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
                {selectedComplaint.description}
              </p>

              {selectedComplaint.image && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ImageIcon size={16} /> Foto Lampiran:
                  </h4>
                  <img 
                    src={`${API_URL}/uploads/${selectedComplaint.image}`} 
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

              {/* Responses List */}
              <div className="responses-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 className="responses-title">Tanggapan Sebelumnya ({selectedComplaint.responses?.length || 0})</h3>
                {(!selectedComplaint.responses || selectedComplaint.responses.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    Belum ada tanggapan untuk laporan ini.
                  </p>
                ) : (
                  selectedComplaint.responses.map((resp) => (
                    <div key={resp.id} className="response-item">
                      <div className="response-meta">
                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Petugas: {resp.admin_name}</span>
                        <span>{formatDate(resp.created_at)}</span>
                      </div>
                      <p className="response-text">{resp.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Response Form */}
              <div>
                <h3 className="responses-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={16} /> Berikan Tanggapan
                </h3>
                <form onSubmit={handleSubmitResponse}>
                  <div className="form-group">
                    <textarea 
                      className="form-control"
                      placeholder="Ketik tanggapan atau tindakan lanjut di sini..."
                      value={responseMsg}
                      onChange={(e) => setResponseMsg(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={submitLoading || !responseMsg.trim()}>
                      {submitLoading ? 'Mengirim...' : 'Kirim Tanggapan'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
