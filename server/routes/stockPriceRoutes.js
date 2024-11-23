const express = require('express');
const {
  getStockPrices,
  createOrUpdateStockPrice,  // Updated here
  updateStockPrice,
  deleteStockPrice,
  getLatestStockPrice,
  createStockPriceSymbols
} = require('../controllers/stockPriceController');

const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Get stock prices by stock ID and optional date range (public access)
router.get('/:stockId/prices', getStockPrices);  // Example: GET /stocks/:stockId/prices?startDate=2024-01-01&endDate=2024-12-31

// Add or update stock price for a stock (admin only)
router.post('/:stockId/prices', authenticateToken, isAdmin, createOrUpdateStockPrice);  // Updated here

// Add or update stock price for a stock (admin only) ** Symbols
router.post('/symbol/:symbol/prices', authenticateToken, isAdmin, createStockPriceSymbols);

// Update existing stock price (admin only)
router.put('/:stockId/prices/:priceId', authenticateToken, isAdmin, updateStockPrice);

// Delete a stock price (admin only)
router.delete('/:stockId/prices/:priceId', authenticateToken, isAdmin, deleteStockPrice);

// Get the latest stock price (public access)
router.get('/:stockId/prices/latest', getLatestStockPrice);

module.exports = router;
