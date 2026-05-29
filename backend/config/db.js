const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 8889,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'pengaduan_masyarakat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL database:', error.message);
    console.error('Please ensure MySQL is running and database configuration in .env is correct.');
  }
})();

module.exports = pool;
