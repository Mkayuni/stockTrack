const express = require('express');
const {
  getStockPrices,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  getLatestStockPrice
} = require('../controllers/stockPriceController');  // Ensure these are correctly imported

const authenticateToken = require('../middleware/authenticateToken');  // Import authentication middleware
const isAdmin = require('../middleware/isAdmin');  // Import admin middleware
const router = express.Router();

// Get stock prices by stock ID and optional date range (public access)
router.get('/:stockId/prices', getStockPrices);  // Example: GET /stocks/:stockId/prices?startDate=2024-01-01&endDate=2024-12-31

// Add new stock price for a stock (admin only)
router.post('/:stockId/prices', authenticateToken, isAdmin, createStockPrice);

// Update existing stock price (admin only)
router.put('/:stockId/prices/:priceId', authenticateToken, isAdmin, updateStockPrice);

// Delete a stock price (admin only)
router.delete('/:stockId/prices/:priceId', authenticateToken, isAdmin, deleteStockPrice);

// Get the latest stock price (public access)
router.get('/:stockId/prices/latest', getLatestStockPrice);

module.exports = router;
