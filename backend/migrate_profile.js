const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('Connecting to MySQL database at 127.0.0.1:8889...');
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 8889,
      user: 'root',
      password: 'root',
      database: 'pengaduan_masyarakat'
    });
    console.log('Successfully connected to database!');

    // Check if column 'avatar' exists in 'users'
    const [columns] = await conn.query('SHOW COLUMNS FROM users LIKE "avatar"');
    if (columns.length > 0) {
      console.log('Column "avatar" already exists in "users" table. Migration not needed.');
    } else {
      console.log('Adding "avatar" column to "users" table...');
      await conn.query('ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
      console.log('Column "avatar" added successfully!');
    }
    
    await conn.end();
    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
})();
