const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser, isEmailTaken, isUsernameTaken} = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');  // Import the authentication middleware
const isAdmin = require('../middleware/isAdmin');  // Import the isAdmin middleware
const router = express.Router();

// Public routes (anyone can register and login)
router.post('/register', createUser);  
router.post('/login', loginUser);
router.get('/has-email/:email', isEmailTaken);
router.get('/has-username/:username', isUsernameTaken);

// Protected routes (authentication required)
router.get('/:id', authenticateToken, getUserById);  // Only authenticated users can get their own user info
router.put('/:id', authenticateToken, updateUser);   // Only authenticated users can update their info
router.delete('/:id', authenticateToken, deleteUser);  // Only authenticated users can delete their info

// Admin-only routes (admin access required)
router.get('/', authenticateToken, isAdmin, getUsers);  // Only admins can get the list of all users

module.exports = router;
