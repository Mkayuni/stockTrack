'use strict';

const { StockSymbol, Stock } = require('../models');  // Import both Stock and StockSymbol models

module.exports = {
  async up() {
    // First, insert stock symbols into the StockSymbol table
    const symbols = await StockSymbol.bulkCreate([
      { symbol: 'AAPL', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'GOOGL', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'TSLA', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Then, associate each stock with its symbol
    await Stock.bulkCreate([
      {
        companyName: 'Apple Inc.',
        sector: 'Technology',
        marketCap: 2500000000,
        stockSymbolId: symbols[0].id,  // Associate with AAPL
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyName: 'Alphabet Inc.',
        sector: 'Technology',
        marketCap: 1500000000,
        stockSymbolId: symbols[1].id,  // Associate with GOOGL
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyName: 'Tesla Inc.',
        sector: 'Automotive',
        marketCap: 1000000000,
        stockSymbolId: symbols[2].id,  // Associate with TSLA
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down() {
    await Stock.destroy({ where: {}, truncate: true });  // Remove all entries from the Stocks table
    await StockSymbol.destroy({ where: {}, truncate: true });  // Remove all entries from StockSymbol table
  }
};
