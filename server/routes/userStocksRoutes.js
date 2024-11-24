const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, isFavorite, removeFavorite } = require('../controllers/userStockController');
const authenticateToken = require('../middleware/authenticateToken');

// Add a stock to favorites
router.post('/favorite', authenticateToken, addFavorite);

// Get all favorite stocks for the authenticated user
router.get('/favorites', authenticateToken, getFavorites);

// Check if a specific stock is a favorite
router.get('/favorites/:stockSymbolId', authenticateToken, isFavorite);

// Remove a stock from favorites
router.delete('/favorite', authenticateToken, removeFavorite);

module.exports = router;
