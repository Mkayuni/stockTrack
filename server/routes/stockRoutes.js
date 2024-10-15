const express = require('express');
const { getStocks, createStock } = require('../controllers/stockController');  // Import both functions
const router = express.Router();

router.get('/', getStocks);  // Fetch stocks
router.post('/', createStock);  // Add a new stock

module.exports = router;
