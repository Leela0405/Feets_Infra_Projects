const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// --- Configuration & Initialization ---

// Check for essential environment variables on startup
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- Middleware Setup ---

app.use(cors());
app.use(express.json());

// Utility function to wrap async route handlers and catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// FIXED: Rate limiting with JSON response
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Max 5 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many contact requests, please try again later.'
    });
  }
});

// FIXED: Rate limiting for admin login with JSON response
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Max 5 login attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts, please try again later.'
    });
  }
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or has expired' });
    }
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Route to submit a new contact form request
app.post('/api/contact', contactLimiter, asyncHandler(async (req, res) => {
  const { name, email, phone, company, service, budget, timeline, message } = req.body;

  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, phone, service, message'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const result = await pool.query(`
    INSERT INTO contact_requests (name, email, phone, company, service, budget, timeline, message)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, created_at
  `, [name, email, phone, company || null, service, budget || null, timeline || null, message]);

  res.status(201).json({
    success: true,
    message: 'Contact request submitted successfully',
    requestId: result.rows[0].id,
    submittedAt: result.rows[0].created_at
  });
}));

// ADDED: Route to create/hash admin password (for setup only)
app.post('/api/admin/create-user', asyncHandler(async (req, res) => {
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
app.post('/api/admin/login', loginLimiter, asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const admin = result.rows[0];
  
  // FIXED: Check if password is already hashed or plain text
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
    { expiresIn: '24h' }
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

// --- Admin Routes (Protected) ---

// Route to get all contact requests
app.get('/api/admin/requests', authenticateToken, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM contact_requests';
  let countQuery = 'SELECT COUNT(*) FROM contact_requests';
  let params = [];
  let conditions = [];

  if (status && status !== 'all') {
    conditions.push(`status = $${params.length + 1}`);
    params.push(status);
  }

  if (search) {
    conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const queryParams = [...params, limit, offset];

  const [requestsResult, countResult] = await Promise.all([
    pool.query(query, queryParams),
    pool.query(countQuery, params)
  ]);

  const totalRequests = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalRequests / limit);

  res.json({
    requests: requestsResult.rows,
    pagination: { currentPage: page, totalPages, totalRequests, limit }
  });
}));

// Route to get a single contact request by ID
app.get('/api/admin/requests/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM contact_requests WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }
  res.json(result.rows[0]);
}));

// Route to update the status of a contact request
app.patch('/api/admin/requests/:id/status', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['new', 'in_progress', 'contacted', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  const result = await pool.query(`
    UPDATE contact_requests 
    SET status = $1, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *
  `, [status, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({
    success: true,
    message: 'Status updated successfully',
    request: result.rows[0]
  });
}));

// Route to delete a contact request
app.delete('/api/admin/requests/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM contact_requests WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({ success: true, message: 'Request deleted successfully' });
}));

// Route to get dashboard statistics
app.get('/api/admin/stats', authenticateToken, asyncHandler(async (req, res) => {
  const statsQueries = [
    pool.query('SELECT COUNT(*) FROM contact_requests'),
    pool.query('SELECT COUNT(*) FROM contact_requests WHERE status = $1', ['new']),
    pool.query('SELECT COUNT(*) FROM contact_requests WHERE status = $1', ['in_progress']),
    pool.query('SELECT COUNT(*) FROM contact_requests WHERE status = $1', ['completed']),
    pool.query('SELECT id, name, service, status, created_at FROM contact_requests ORDER BY created_at DESC LIMIT 5')
  ];

  const [totalResult, newResult, inProgressResult, completedResult, recentResult] = await Promise.all(statsQueries);

  res.json({
    totalRequests: parseInt(totalResult.rows[0].count),
    newRequests: parseInt(newResult.rows[0].count),
    inProgressRequests: parseInt(inProgressResult.rows[0].count),
    completedRequests: parseInt(completedResult.rows[0].count),
    recentRequests: recentResult.rows
  });
}));



// --- Health Check & Error Handling ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'The requested route does not exist.' });
});

// --- Server Startup ---

const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await pool.query('SELECT id FROM admin_users WHERE username = $1', ['admin1']);
    
    if (existingAdmin.rows.length === 0) {
      // Create default admin user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin1234', saltRounds);
      
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

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 Default admin credentials:`);
      console.log(`   Username: admin1`);
      console.log(`   Password: admin123`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database or start server:', error);
    process.exit(1);
  }
};

startServer();