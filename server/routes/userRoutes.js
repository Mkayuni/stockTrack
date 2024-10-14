const express = require('express');
const { getUsers } = require('../controllers/userController');  // Assuming you have a user controller
const router = express.Router();

router.get('/', getUsers);  // Example route for fetching users

module.exports = router;
