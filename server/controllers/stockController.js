const { Stock, StockSymbol } = require('../models');
const {request} = require ("axios");
const axios = require('axios');

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

// Function to get historical data from the time it was made to present
const getHistoricalStock = async (req, res) => {
  const symbol = req.params.id;

  if (!symbol) {
    return res.status(400).json({ message: 'Stock symbol is required' });
  }

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history',
    params: {
      symbol: symbol, // Use the symbol from request
      interval: '5m', // 5-minute interval (you can change this as needed)
      diffandsplits: 'false' // Exclude dividend and stock split data
    },
    headers: {
      'x-rapidapi-key': process.env.RAPID_KEY, // Your RapidAPI key from environment variable
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    // Log the parameters to make sure they're correct
    console.log('Requesting stock history for:', symbol);

    // Fetch data from the Yahoo Finance API
    const response = await axios.request(options);

    // Check if 'body' exists in the response data
    if (!response.data || !response.data.body) {
      return res.status(404).json({ message: 'No historical data found for this stock' });
    }

    const historicalData = response.data.body; // Assuming 'body' contains the stock data

    // Ensure the data object is not empty
    if (Object.keys(historicalData).length === 0) {
      return res.status(404).json({ message: 'No historical data found for this stock' });
    }

    // Since 'body' contains multiple entries, map through the values
    const formattedData = Object.values(historicalData).map((entry) => ({
      date: entry.date || null,
      open: entry.open || null,
      high: entry.high || null,
      low: entry.low || null,
      close: entry.close || null,
      volume: entry.volume || null,
    }));

    // Send the formatted historical data as the response
    res.status(200).json({ symbol, historicalData: formattedData });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
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

module.exports = { getStocks, getStockById, createStock, updateStock, deleteStock, getHistoricalStock};
