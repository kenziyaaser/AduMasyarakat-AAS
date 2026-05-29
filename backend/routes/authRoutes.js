const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// PUT /auth/profile
router.put('/profile', authenticateToken, upload.single('avatar'), updateProfile);

module.exports = router;
