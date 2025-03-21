const { StockPrice, Stock } = require('../models');
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

// Function to get stock prices by stock ID order by date
const getStockPricesByDate = async (req, res) => {
  const { stockId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const whereClause = { stockId };

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const stockPrices = await StockPrice.findAll({
      where: whereClause,
      order: [
        ['date', 'ASC']
      ]
    });
    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to create or update a stock price (admin only) ** Symbols
const createStockPriceSymbols = async (req, res) => {
  const { symbol } = req.params;
  const { date, open, close, high, low, volume, marketCap } = req.body;

  try {
    // Find the stock by symbol
    const stock = await Stock.findOne({ where: { symbol } });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Check if a stock price exists for the given symbol and date
    let existingPrice = await StockPrice.findOne({
      where: { stockId: stock.id, date }  // Use stockId after finding the stock
    });

    if (existingPrice) {
      // Update the existing stock price if found
      await existingPrice.update({
        open,
        close,
        high,
        low,
        volume
      });

      // Optionally, update the stock's market cap
      if (marketCap) {
        await stock.update({ marketCap });
      }

      return res.status(200).json({ message: 'Stock price updated successfully', stockPrice: existingPrice });
    } else {
      // Create a new stock price entry if none exists
      const newPrice = await StockPrice.create({
        stockId: stock.id,  // Use stockId from the found stock
        date,
        open,
        close,
        high,
        low,
        volume
      });

      // Optionally, update the stock's market cap
      if (marketCap) {
        await stock.update({ marketCap });
      }

      return res.status(201).json(newPrice);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to create or update stock price', error: error.message });
  }
};

// Function to create or update a stock price (admin only)
const createOrUpdateStockPrice = async (req, res) => {
  const { stockId } = req.params;
  const { date, open, close, high, low, volume, marketCap } = req.body;

  try {
    // Check if a stock price exists for the given date
    let existingPrice = await StockPrice.findOne({
      where: { stockId, date }
    });

    if (existingPrice) {
      // Update the existing stock price if found
      await existingPrice.update({
        open,
        close,
        high,
        low,
        volume
      });

      // Optionally, update the stock's market cap
      const stock = await Stock.findByPk(stockId);
      if (stock) {
        await stock.update({ marketCap });
      }

      return res.status(200).json({ message: 'Stock price updated successfully', stockPrice: existingPrice });
    } else {
      // Create a new stock price entry if none exists
      const newPrice = await StockPrice.create({
        stockId,
        date,
        open,
        close,
        high,
        low,
        volume
      });

      // Optionally, update the stock's market cap
      const stock = await Stock.findByPk(stockId);
      if (stock) {
        await stock.update({ marketCap });
      }

      return res.status(201).json(newPrice);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to create or update stock price', error: error.message });
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

// Function to get the latest stock price (public route)
const getLatestStockPrice = async (req, res) => {
  const { stockId } = req.params;

  try {
    const latestPrice = await StockPrice.findOne({
      where: { stockId },
      order: [['createdAt', 'DESC']]
    });

    if (!latestPrice) {
      return res.status(404).json({ message: 'No stock prices found for this stock' });
    }

    res.json(latestPrice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch latest stock price', error: error.message });
  }
};

module.exports = {
  getStockPrices,
  createOrUpdateStockPrice,
  updateStockPrice,
  deleteStockPrice,
  getLatestStockPrice,
  createStockPriceSymbols,
  getStockPricesByDate
};
