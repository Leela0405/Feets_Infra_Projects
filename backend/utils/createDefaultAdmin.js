const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await pool.query('SELECT id FROM admin_users WHERE username = $1', ['admin']);
    
    if (existingAdmin.rows.length === 0) {
      // Create default admin user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      await pool.query(`
        INSERT INTO admin_users (username, password_hash, email, role, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      `, ['admin', hashedPassword, 'admin@feetinfra.com', 'admin']);
      
      console.log('✅ Default admin user created successfully');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
    // Don't exit the server if admin creation fails
  }
};

module.exports = {
  createDefaultAdmin
};