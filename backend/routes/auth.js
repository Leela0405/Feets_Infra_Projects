const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Route to create/hash admin password (for setup only)
router.post('/create-user', asyncHandler(async (req, res) => {
  console.log('Create user endpoint hit:', req.body);
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  try {
    const result = await pool.query(`
      INSERT INTO admin_users (username, password_hash, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role
    `, [username, hashedPassword, email || null, 'admin']);
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Username already exists' });
    }
    throw error;
  }
}));

// Route for admin user login
router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const admin = result.rows[0];
  
  // Check if password is already hashed or plain text
  let isValidPassword = false;
  
  try {
    // Try to compare as hashed password first
    isValidPassword = await bcrypt.compare(password, admin.password_hash);
  } catch (error) {
    // If bcrypt fails, it might be a plain text password (for development)
    // In production, you should always use hashed passwords
    if (admin.password_hash === password) {
      isValidPassword = true;
      console.warn('WARNING: Plain text password detected. Please hash your passwords!');
    }
  }
  
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '10min' }
  );

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
}));

module.exports = router;