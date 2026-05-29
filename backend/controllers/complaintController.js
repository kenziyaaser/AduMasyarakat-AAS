const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. Get all complaints (Admin gets all, User gets only their own)
const getAllComplaints = async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let query = '';
    let params = [];

    if (role === 'admin' || role === 'superadmin') {
      query = `
        SELECT c.*, u.name as user_name, u.email as user_email, 
               r.message as response_message, r.created_at as response_created_at
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN (
          -- Get the latest response for each complaint
          SELECT r1.* FROM responses r1
          INNER JOIN (
            SELECT complaint_id, MAX(created_at) as max_created
            FROM responses
            GROUP BY complaint_id
          ) r2 ON r1.complaint_id = r2.complaint_id AND r1.created_at = r2.max_created
        ) r ON c.id = r.complaint_id
        ORDER BY c.created_at DESC
      `;
    } else {
      query = `
        SELECT c.*, u.name as user_name,
               r.message as response_message, r.created_at as response_created_at
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN (
          SELECT r1.* FROM responses r1
          INNER JOIN (
            SELECT complaint_id, MAX(created_at) as max_created
            FROM responses
            GROUP BY complaint_id
          ) r2 ON r1.complaint_id = r2.complaint_id AND r1.created_at = r2.max_created
        ) r ON c.id = r.complaint_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    }

    const [complaints] = await db.query(query, params);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pengaduan.', error: error.message });
  }
};

// 2. Get complaint by ID
const getComplaintById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    // Fetch complaint
    const [complaints] = await db.query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan.' });
    }

    const complaint = complaints[0];

    // Check ownership/permissions
    if (role !== 'admin' && role !== 'superadmin' && complaint.user_id !== userId) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak berhak melihat pengaduan ini.' });
    }

    // Fetch responses
    const [responses] = await db.query(
      `SELECT r.*, u.name as admin_name 
       FROM responses r
       JOIN users u ON r.admin_id = u.id
       WHERE r.complaint_id = ?
       ORDER BY r.created_at ASC`,
      [id]
    );

    res.json({
      ...complaint,
      responses
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail pengaduan.', error: error.message });
  }
};

const createComplaint = async (req, res) => {
  const { title, description, latitude, longitude } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ message: 'Judul dan isi pengaduan wajib diisi.' });
  }

  // File is optional
  const image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'INSERT INTO complaints (user_id, title, description, image, status, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, image, 'pending', latitude ? parseFloat(latitude) : null, longitude ? parseFloat(longitude) : null]
    );

    res.status(201).json({
      message: 'Pengaduan berhasil dikirim.',
      complaintId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim pengaduan.', error: error.message });
  }
};

// 4. Update complaint status (Admin only)
const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'process', 'done'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid. Harus pending, process, atau done.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan.' });
    }

    res.json({ message: 'Status pengaduan berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status pengaduan.', error: error.message });
  }
};

// 5. Delete complaint (Admin only)
const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    // Get complaint to find image file name
    const [complaints] = await db.query('SELECT image FROM complaints WHERE id = ?', [id]);
    if (complaints.length === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan.' });
    }

    const complaint = complaints[0];

    // Delete database entry (responses table will cascade delete)
    const [result] = await db.query('DELETE FROM complaints WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      // If there was an image, delete it from storage
      if (complaint.image) {
        const imagePath = path.join(__dirname, '../uploads/', complaint.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      return res.json({ message: 'Pengaduan berhasil dihapus.' });
    }

    res.status(404).json({ message: 'Pengaduan tidak ditemukan.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pengaduan.', error: error.message });
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
};
