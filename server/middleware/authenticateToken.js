const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
  const secretKey = process.env.YOUR_SECRET_KEY; // Access secret key from .env

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify token with the secret key
    req.user = decoded; // Attach decoded token data (e.g., email, id) to the request

    // Ensure required fields are available in the token
    if (!req.user.email) {
      return res.status(400).json({ message: 'Invalid token: Missing email information.' });
    }

    next(); // Allow the request to proceed
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
