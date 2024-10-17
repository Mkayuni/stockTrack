// Middleware to check if a user is an admin
const isAdmin = (req, res, next) => {
    // The token has already been verified and decoded by authenticateToken, and req.user is set
    if (req.user && req.user.role === 'admin') {
      next();  // User is admin, allow the request to proceed
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });  // User is not an admin
    }
  };
  
  module.exports = isAdmin;
  