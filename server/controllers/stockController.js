const { Stock } = require('../models');

// Function to get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to create a new stock
const createStock = async (req, res) => {
  try {
    const newStock = await Stock.create(req.body);
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
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
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

// Function to delete a stock
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    await stock.destroy();
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStocks, getStockById, createStock, updateStock, deleteStock };
