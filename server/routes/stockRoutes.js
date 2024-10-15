const express = require('express');
const { getStocks, getStockById, createStock, updateStock, deleteStock } = require('../controllers/stockController');
const router = express.Router();

// Get all stocks
router.get('/', getStocks);

// Get a single stock by ID
router.get('/:id', getStockById);

// Create a new stock
router.post('/', createStock);

// Update a stock by ID
router.put('/:id', updateStock);

// Delete a stock by ID
router.delete('/:id', deleteStock);

module.exports = router;
