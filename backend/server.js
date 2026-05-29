const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/complaints', complaintRoutes);
app.use('/responses', responseRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sistem Pengaduan Masyarakat API',
    status: 'Running'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack || err.message);
  
  // Specific Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan internal server.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
