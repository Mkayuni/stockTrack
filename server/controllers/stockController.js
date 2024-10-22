const { Stock, StockSymbol } = require('../models');  

// Function to get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to get a single stock by ID
const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to create a new stock
const createStock = async (req, res) => {
  const { symbol, companyName, sector, marketCap } = req.body;

  try {
    // Check if the stock symbol exists, create it if not
    let stockSymbol = await StockSymbol.findOne({ where: { symbol } });

    if (!stockSymbol) {
      stockSymbol = await StockSymbol.create({ symbol });
    }

    // Create the stock associated with the symbol
    const newStock = await Stock.create({
      symbol, // Directly use the symbol
      companyName,
      sector,
      marketCap
    });

    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create stock', error: error.message });
  }
};

// Function to update an existing stock
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    await stock.update(req.body);
    res.json(stock);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update stock', error: error.message });
  }
};

// Function to delete a stock (with cascading delete of stock prices)
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    await stock.destroy();  // This will cascade and delete associated stock prices if configured
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete stock', error: error.message });
  }
};

module.exports = { getStocks, getStockById, createStock, updateStock, deleteStock };
