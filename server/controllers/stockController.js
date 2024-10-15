const { Stock } = require('../models');  // Import the Stock model

// Function to create a new stock
const createStock = async (req, res) => {
  try {
    const newStock = await Stock.create(req.body);  // Create a new stock with the request body data
    res.status(201).json(newStock);  // Return the newly created stock
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });  // Handle errors
  }
};

// Function to get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStocks, createStock };
