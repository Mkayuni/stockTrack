const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from header
  const secretKey = process.env.YOUR_SECRET_KEY;  // Access secret key from .env

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);  // Verify token with secret key
    req.user = decoded;  // Attach decoded token data (user id, role) to the request
    next();  // Allow the request to proceed
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
