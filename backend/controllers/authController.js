const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field (nama, email, password) harus diisi.' });
  }

  // Check if role is provided, default to 'user'
  const userRole = (role === 'admin' || role === 'superadmin') ? role : 'user';

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({
      message: 'Registrasi berhasil.',
      user: {
        id: result.insertId,
        name,
        email,
        role: userRole
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

// Login user/admin
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi.' });
  }

  try {
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // Sign token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_123_abc_xyz_!@#',
      { expiresIn: '7d' } // Expires in 7 days
    );

    res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nama dan email wajib diisi.' });
  }

  try {
    // Check if email is already taken by another user
    const [existing] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing.length > 0) {
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({ message: 'Email sudah terdaftar oleh pengguna lain.' });
    }

    // Get current user data to check for existing avatar
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const currentUser = users[0];
    let avatar = currentUser.avatar;

    // If new file is uploaded
    if (req.file) {
      avatar = req.file.filename;

      // Delete old avatar from disk if it exists
      if (currentUser.avatar) {
        const oldPath = path.join(__dirname, '../uploads/', currentUser.avatar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // Update users in database
    await db.query(
      'UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?',
      [name, email, avatar, userId]
    );

    // Return success
    res.json({
      message: 'Profil berhasil diperbarui.',
      user: {
        id: userId,
        name,
        email,
        role: currentUser.role,
        avatar
      }
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  updateProfile
};
