const db = require('../config/db');

// Create a new response to a complaint (Admin only)
const createResponse = async (req, res) => {
  const { complaint_id, message } = req.body;
  const adminId = req.user.id;

  if (!complaint_id || !message) {
    return res.status(400).json({ message: 'ID pengaduan dan pesan tanggapan wajib diisi.' });
  }

  try {
    // Verify complaint exists
    const [complaints] = await db.query('SELECT status FROM complaints WHERE id = ?', [complaint_id]);
    if (complaints.length === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan.' });
    }

    const currentStatus = complaints[0].status;

    // Insert response
    const [result] = await db.query(
      'INSERT INTO responses (complaint_id, admin_id, message) VALUES (?, ?, ?)',
      [complaint_id, adminId, message]
    );

    // Auto-update complaint status to 'process' if it is 'pending'
    if (currentStatus === 'pending') {
      await db.query('UPDATE complaints SET status = ? WHERE id = ?', ['process', complaint_id]);
    }

    res.status(201).json({
      message: 'Tanggapan berhasil dikirim.',
      responseId: result.insertId,
      autoUpdatedStatus: currentStatus === 'pending' ? 'process' : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim tanggapan.', error: error.message });
  }
};

module.exports = {
  createResponse
};
