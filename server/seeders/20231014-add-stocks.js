'use strict';

const { Stock } = require('../models');  // Import the Stock model

module.exports = {
  async up() {
    await Stock.bulkCreate([
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        marketCap: 2500000000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        sector: 'Technology',
        marketCap: 1500000000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        sector: 'Automotive',
        marketCap: 1000000000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down() {
    await Stock.destroy({ where: {}, truncate: true });  // Remove all entries from the Stocks table
  }
};
