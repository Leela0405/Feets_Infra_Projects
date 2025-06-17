const express = require('express');
const { pool } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Route to get all contact requests
router.get('/requests', asyncHandler(async (req, res) => {
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
router.get('/requests/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM contact_requests WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }
  res.json(result.rows[0]);
}));

// Route to update the status of a contact request
router.patch('/requests/:id/status', asyncHandler(async (req, res) => {
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
router.delete('/requests/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM contact_requests WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({ success: true, message: 'Request deleted successfully' });
}));

// Route to get dashboard statistics
router.get('/stats', asyncHandler(async (req, res) => {
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

module.exports = router;