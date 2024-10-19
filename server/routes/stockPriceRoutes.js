const express = require('express');
const {
  getStockPrices,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  getLatestStockPrice,
  createStockPriceMulti
} = require('../controllers/stockPriceController');

const authenticateToken = require('../middleware/authenticateToken');  // Import authentication middleware
const isAdmin = require('../middleware/isAdmin');  // Import admin middleware
const router = express.Router();

// Get stock prices by stock ID and optional date range (protected)
router.get('/:stockId/prices', authenticateToken, getStockPrices);  // Example: GET /stocks/:stockId/prices?startDate=2024-01-01&endDate=2024-12-31

// Add new stock price for a stock (admin only)
router.post('/:stockId/prices', authenticateToken, isAdmin, createStockPrice);

// Add an array of stock prices to a single stock (admin only)
router.post('/:stockId/prices/multiple', authenticateToken, isAdmin, createStockPriceMulti);

// Update existing stock price (admin only)
router.put('/:stockId/prices/:priceId', authenticateToken, isAdmin, updateStockPrice);

// Delete a stock price (admin only)
router.delete('/:stockId/prices/:priceId', authenticateToken, isAdmin, deleteStockPrice);

// Get the latest stock price (protected)
router.get('/:stockId/prices/latest', authenticateToken, getLatestStockPrice);

module.exports = router;
