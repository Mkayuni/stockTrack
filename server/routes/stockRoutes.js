const express = require('express');
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getHistoricalStock,
} = require('../controllers/stockController');
const router = express.Router();

// Get all stocks
router.get('/', getStocks);

// Get a single stock by ID
router.get('/:id', getStockById);

// Create a new stock (with symbol creation)
router.post('/', createStock);

router.get('/historic/:id', getHistoricalStock);

// Update a stock by ID
router.put('/:id', updateStock);

// Delete a stock by ID (with cascading delete of stock prices)
router.delete('/:id', deleteStock);

module.exports = router;
