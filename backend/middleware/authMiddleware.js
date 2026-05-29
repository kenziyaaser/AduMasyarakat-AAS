const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_123_abc_xyz_!@#');
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({ message: 'Akses ditolak. Hanya untuk Admin/Petugas.' });
  }
  next();
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Akses ditolak. Memerlukan hak akses Super Admin.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isSuperAdmin
};
