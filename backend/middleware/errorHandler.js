// Utility function to wrap async route handlers and catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'The requested route does not exist.' });
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler
};