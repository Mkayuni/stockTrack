'use strict';

const { StockSymbol, Stock, StockPrice } = require('../models');

module.exports = {
  async up() {
    // Fetch the stocks by symbol from the StockSymbols table
    const stockSymbols = await StockSymbol.findAll({
      where: {
        symbol: ['AAPL', 'GOOGL', 'TSLA']  // These are the stock symbols
      }
    });

    // Map stock symbols to their corresponding Stock IDs
    const stockMap = {};
    for (const symbol of stockSymbols) {
      const stock = await Stock.findOne({ where: { stockSymbolId: symbol.id } });
      stockMap[symbol.symbol] = stock ? stock.id : null;
    }

    // Insert stock prices associated with correct stockId
    await StockPrice.bulkCreate([
      {
        stockId: stockMap['AAPL'],  // Stock ID for AAPL
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
        stockId: stockMap['GOOGL'],  // Stock ID for GOOGL
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
        stockId: stockMap['TSLA'],  // Stock ID for TSLA
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
    await StockPrice.destroy({ where: {}, truncate: true });  // Remove all stock prices
  }
};
