const express = require('express');
const { Stock, StockSymbol } = require('../models');  // Import the models

const router = express.Router();

// Route to add a new stock symbol and stock
router.post('/add-symbol', async (req, res) => {
  const { symbol, companyName } = req.body;
  try {
    // Create the stock in the Stocks table
    const newStock = await Stock.create({ symbol, companyName });

    // Optionally create the stock symbol in StockSymbols
    const newSymbol = await StockSymbol.create({ symbol });

    res.status(201).json({ stock: newStock, symbol: newSymbol });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add stock', error: error.message });
  }
});

// Route to get all stock symbols
router.get('/symbols', async (req, res) => {
  try {
    const symbols = await StockSymbol.findAll();
    res.status(200).json(symbols);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch stock symbols', error: error.message });
  }
});

// Route to update a stock symbol
router.put('/symbols/:id', async (req, res) => {
  const { id } = req.params;
  const { symbol } = req.body;

  try {
    const stockSymbol = await StockSymbol.findByPk(id);
    if (!stockSymbol) {
      return res.status(404).json({ message: 'Stock symbol not found' });
    }

    stockSymbol.symbol = symbol;
    await stockSymbol.save();

    res.status(200).json(stockSymbol);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update stock symbol', error: error.message });
  }
});

// Route to delete a stock symbol
router.delete('/symbols/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const stockSymbol = await StockSymbol.findByPk(id);
    if (!stockSymbol) {
      return res.status(404).json({ message: 'Stock symbol not found' });
    }

    await stockSymbol.destroy();
    res.status(200).json({ message: 'Stock symbol deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete stock symbol', error: error.message });
  }
});

module.exports = router;
