'use strict';

const { Stock } = require('../models');  // Import the Stock model

module.exports = {
  async up() {
    // Use the Stock model to bulk insert data
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
    // Use the Stock model to delete all records
    await Stock.destroy({ where: {}, truncate: true });
  }
};
