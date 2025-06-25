const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const createDefaultAdmin = async () => {
  try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('zoola123', saltRounds);
      
      await pool.query(`
        INSERT INTO admin_users (username, password_hash, email, role, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      `, ['zoola', hashedPassword, 'zoola@feetinfra.com', 'admin']);
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
    // Don't exit the server if admin creation fails
  }
};

module.exports = {
  createDefaultAdmin
};