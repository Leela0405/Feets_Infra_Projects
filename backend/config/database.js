const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
const testConnection = async () => {
  await pool.query('SELECT NOW()');
};

module.exports = {
  pool,
  testConnection
};