const express = require('express');
const { Stock, StockSymbol, StockPrice } = require('../models'); // Import the models
const jwt = require('jsonwebtoken'); // For token verification
const router = express.Router();
const axios = require('axios');
const { addSymbolToSubscription } = require('../utils/websocketUtils'); // Import the utility function
const { schedulePriceUpdates } = require('../utils/priceScheduler');

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ensure proper extraction
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY); // Ensure correct secret key
    console.log('Decoded:', decoded);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// Route to add a new stock symbol and stock with sector and marketCap (protected)
router.post('/add-symbol', verifyAdmin, async (req, res) => {
  const { symbol, companyName, sector, marketCap } = req.body;

  try {
    // Check if the stock symbol exists or create it
    let stockSymbol = await StockSymbol.findOne({ where: { symbol } });
    if (!stockSymbol) {
      stockSymbol = await StockSymbol.create({ symbol });
    }

    // Create the stock and associate it with the stock symbol
    const newStock = await Stock.create({
      symbol,
      companyName,
      sector,
      marketCap,
      stockSymbolId: stockSymbol.id, // Associate the stock symbol
    });

    // Fetch the latest stock prices from Finnhub
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    const { c: close, h: high, l: low, o: open } = response.data;

    // Insert the fetched price into the StockPrices table
    if (close && high && low && open) {
      await StockPrice.create({
        stockId: newStock.id,
        date: new Date(),
        open,
        close,
        high,
        low,
        volume: null, // Finnhub doesn't provide volume in the quote endpoint
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Schedule periodic price updates
    schedulePriceUpdates(symbol, newStock.id);

    // Subscribe to WebSocket for real-time updates
    addSymbolToSubscription(symbol, process.env.FINNHUB_API_KEY);

    res.status(201).json({ stock: newStock, symbol: stockSymbol });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to add stock', error: error.message });
  }
});


// Route to delete a stock symbol (protected)
router.delete('/symbols/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
      const stockSymbol = await StockSymbol.findByPk(id);
      if (!stockSymbol) {
          return res.status(404).json({ message: 'Stock symbol not found' });
      }

      await stockSymbol.destroy(); // This triggers the cascade delete
      res.status(200).json({ message: 'Stock symbol and associated data deleted successfully' });
  } catch (error) {
      res.status(400).json({ message: 'Failed to delete stock symbol', error: error.message });
  }
});

// Other routes (not protected)
router.get('/symbols', async (req, res) => {
  try {
    const symbols = await StockSymbol.findAll();
    res.status(200).json(symbols);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch stock symbols', error: error.message });
  }
});

router.put('/symbols/:id', verifyAdmin, async (req, res) => {
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

module.exports = router;
