const express = require('express');
const { pool } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Route to submit a new contact form request
router.post('/', contactLimiter, asyncHandler(async (req, res) => {
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

module.exports = router;