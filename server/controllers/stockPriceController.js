const { StockPrice } = require('../models');
const { Op } = require('sequelize');

// Function to get stock prices by stock ID with an optional date range
const getStockPrices = async (req, res) => {
  const { stockId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const whereClause = { stockId };

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const stockPrices = await StockPrice.findAll({ where: whereClause });
    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to create a new stock price (admin only)
const createStockPrice = async (req, res) => {
  const { stockId } = req.params;
  const { date, open, close, high, low, volume } = req.body;

  try {
    const newPrice = await StockPrice.create({
      stockId,
      date,
      open,
      close,
      high,
      low,
      volume
    });
    res.status(201).json(newPrice);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create stock price', error: error.message });
  }
};

// Function to update an existing stock price (admin only)
const updateStockPrice = async (req, res) => {
  const { priceId } = req.params;
  const { date, open, close, high, low, volume } = req.body;

  try {
    const price = await StockPrice.findByPk(priceId);
    if (!price) {
      return res.status(404).json({ message: 'Stock price not found' });
    }

    await price.update({
      date,
      open,
      close,
      high,
      low,
      volume
    });

    res.json(price);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update stock price', error: error.message });
  }
};

// Function to delete a stock price (admin only)
const deleteStockPrice = async (req, res) => {
  const { priceId } = req.params;

  try {
    const price = await StockPrice.findByPk(priceId);
    if (!price) {
      return res.status(404).json({ message: 'Stock price not found' });
    }

    await price.destroy();
    res.json({ message: 'Stock price deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete stock price', error: error.message });
  }
};

// Function to get the latest stock price (protected)
const getLatestStockPrice = async (req, res) => {
  const { stockId } = req.params;

  try {
    const latestPrice = await StockPrice.findOne({
      where: { stockId },
      order: [['date', 'DESC']]
    });

    if (!latestPrice) {
      return res.status(404).json({ message: 'No stock prices found for this stock' });
    }

    res.json(latestPrice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch latest stock price', error: error.message });
  }
};

// Function to add an array of prices to the stock
const createStockPriceMulti = async (req, res) => {
  const { stockId } = req.params;
  const stockPricesArray = req.body;

  if (!Array.isArray(stockPricesArray) || stockPricesArray.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array of stock prices.' });
  }

  for (const stockPrice of stockPricesArray) {
    const { date, open, close, high, low, volume } = stockPrice;
    if (!date || !open || !close || !high || !low || !volume) {
      return res.status(400).json({ message: 'All fields are required: date, open, close, high, low, volume.' });
    }
  }

  try {
    const newPrices = await Promise.all(
        stockPricesArray.map(price =>
            StockPrice.create({
              stockId,
              date: price.date,
              open: price.open,
              close: price.close,
              high: price.high,
              low: price.low,
              volume: price.volume
            })
        )
    );

    res.status(201).json(newPrices);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create stock prices', error: error.message });
  }
};

module.exports = {
  getStockPrices,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  getLatestStockPrice,
  createStockPriceMulti
};
