const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

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

module.exports = {
  authenticateToken
};