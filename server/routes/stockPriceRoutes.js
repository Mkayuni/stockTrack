const express = require('express');
const { getStockPrices } = require('../controllers/stockPriceController');  // Import your controller functions
const router = express.Router();

// Route to get stock prices by stock ID and optional date range
router.get('/:stockId/prices', getStockPrices);  // Example: GET /stocks/:stockId/prices?startDate=2024-01-01&endDate=2024-12-31

module.exports = router;
