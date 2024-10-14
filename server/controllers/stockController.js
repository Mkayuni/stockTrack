const { Stock } = require('../models');  // Import from models/index.js

// Function to get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();  // Fetch all stocks from the database
    console.log('Stocks in the database:', stocks);  // This logs the data to the console
    res.json(stocks);  // Return the data as JSON for the frontend
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Handle server errors
  }
};

module.exports = { getStocks };
