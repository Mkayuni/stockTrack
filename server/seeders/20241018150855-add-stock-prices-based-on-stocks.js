'use strict';

const { Stock, StockPrice } = require('../models');  // Import both models

module.exports = {
  async up() {
    // Fetch all existing stocks from the Stocks table
    const stocks = await Stock.findAll();

    // Insert stock prices for each stock
    const stockPrices = [];
    
    for (const stock of stocks) {
      stockPrices.push({
        stockId: stock.id,  // Use the stock's ID to associate the price
        date: '2024-01-01',
        open: 100.0,
        close: 105.0,
        high: 107.0,
        low: 99.0,
        volume: 1000000,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insert all stock prices into the StockPrices table
    await StockPrice.bulkCreate(stockPrices);
  },

  async down() {
    // Remove all stock prices
    await StockPrice.destroy({ where: {}, truncate: true });
  }
};
