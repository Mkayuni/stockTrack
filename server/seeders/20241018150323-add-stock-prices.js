'use strict';

const { Stock, StockPrice } = require('../models');  // Import both Stock and StockPrice models

module.exports = {
  async up() {
    // Fetch the stocks dynamically by their symbols
    const stocks = await Stock.findAll({
      where: {
        symbol: ['AAPL', 'GOOGL', 'TSLA']  // These are the stock symbols
      }
    });

    // Create a mapping of stock symbols to their corresponding IDs
    const stockMap = {};
    stocks.forEach(stock => {
      stockMap[stock.symbol] = stock.id;
    });

    // Insert stock prices associated with the correct stockId dynamically
    await StockPrice.bulkCreate([
      {
        stockId: stockMap['AAPL'],  // Dynamically map stockId for 'AAPL'
        date: '2024-01-01',
        open: 100.0,
        close: 105.0,
        high: 107.0,
        low: 99.0,
        volume: 1000000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        stockId: stockMap['GOOGL'],  // Dynamically map stockId for 'GOOGL'
        date: '2024-01-01',
        open: 1500.0,
        close: 1520.0,
        high: 1530.0,
        low: 1480.0,
        volume: 800000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        stockId: stockMap['TSLA'],  // Dynamically map stockId for 'TSLA'
        date: '2024-01-01',
        open: 600.0,
        close: 610.0,
        high: 620.0,
        low: 590.0,
        volume: 500000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down() {
    // Remove all stock prices
    await StockPrice.destroy({ where: {}, truncate: true });
  }
};
