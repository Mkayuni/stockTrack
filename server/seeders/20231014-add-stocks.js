'use strict';

const { StockSymbol, Stock } = require('../models');

module.exports = {
  async up() {
    // Insert stock symbols into StockSymbol table
    const symbols = await StockSymbol.bulkCreate([
      { symbol: 'AAPL', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'GOOGL', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'TSLA', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Associate each stock with its symbol
    const stocks = await Stock.bulkCreate([
      {
        companyName: 'Apple Inc.',
        sector: 'Technology',
        marketCap: 2500000000,
        stockSymbolId: symbols[0].id, // Use the stockSymbolId for AAPL
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyName: 'Alphabet Inc.',
        sector: 'Technology',
        marketCap: 1500000000,
        stockSymbolId: symbols[1].id, // Use the stockSymbolId for GOOGL
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyName: 'Tesla Inc.',
        sector: 'Automotive',
        marketCap: 1000000000,
        stockSymbolId: symbols[2].id, // Use the stockSymbolId for TSLA
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    return stocks;
  },

  async down() {
    await Stock.destroy({ where: {}, truncate: true });  // Delete all stocks
    await StockSymbol.destroy({ where: {}, truncate: true });  // Delete all stock symbols
  }
};
