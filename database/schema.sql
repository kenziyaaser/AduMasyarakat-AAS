-- Database Schema for Sistem Pengaduan Masyarakat
-- Database: pengaduan_masyarakat

CREATE DATABASE IF NOT EXISTS pengaduan_masyarakat;
USE pengaduan_masyarakat;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  status ENUM('pending', 'process', 'done') DEFAULT 'pending',
  latitude DECIMAL(10, 8) DEFAULT NULL,
  longitude DECIMAL(11, 8) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Responses Table
CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  admin_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INDEXES for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_responses_complaint ON responses(complaint_id);

-- SEED DATA
-- Default passwords for seed data are 'password123'
-- Bcrypt hash: $2a$10$xoYUdYgotjIAZqE6JFwawO.x0UKWLx.dZ3hzBKF46J3ehqGDywgvG (for password123)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Super Admin', 'superadmin@pengaduan.go.id', '$2a$10$xoYUdYgotjIAZqE6JFwawO.x0UKWLx.dZ3hzBKF46J3ehqGDywgvG', 'superadmin'),
(2, 'Admin Biasa', 'admin@pengaduan.go.id', '$2a$10$xoYUdYgotjIAZqE6JFwawO.x0UKWLx.dZ3hzBKF46J3ehqGDywgvG', 'admin'),
(3, 'Ahmad Fadillah', 'ahmad@example.com', '$2a$10$xoYUdYgotjIAZqE6JFwawO.x0UKWLx.dZ3hzBKF46J3ehqGDywgvG', 'user'),
(4, 'Siti Aminah', 'siti@example.com', '$2a$10$xoYUdYgotjIAZqE6JFwawO.x0UKWLx.dZ3hzBKF46J3ehqGDywgvG', 'user');

INSERT INTO complaints (id, user_id, title, description, image, status, created_at) VALUES
(1, 3, 'Jalan Rusak di RT 03', 'Jalanan utama di RT 03/RW 04 berlubang sangat parah dan sering mengakibatkan kecelakaan bagi pengendara motor terutama saat hujan deras.', NULL, 'pending', '2026-05-20 10:00:00'),
(2, 4, 'Penumpukan Sampah Liar', 'Ada penumpukan sampah liar di dekat taman warga yang menimbulkan bau tidak sedap dan mengundang banyak lalat.', NULL, 'process', '2026-05-20 11:30:00');

INSERT INTO responses (id, complaint_id, admin_id, message, created_at) VALUES
(1, 2, 2, 'Laporan diterima. Petugas kebersihan dinas lingkungan hidup akan dikerahkan ke lokasi besok pagi untuk melakukan pengangkutan.', '2026-05-20 13:00:00');
