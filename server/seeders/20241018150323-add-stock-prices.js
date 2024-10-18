'use strict';

const { StockPrice } = require('../models');  // Import the StockPrice model

module.exports = {
  async up() {
    await StockPrice.bulkCreate([
      {
        stockId: 1, // Assuming 'AAPL' has ID 1
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
        stockId: 2, // Assuming 'GOOGL' has ID 2
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
        stockId: 3, // Assuming 'TSLA' has ID 3
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
    await StockPrice.destroy({ where: {}, truncate: true });
  }
};
