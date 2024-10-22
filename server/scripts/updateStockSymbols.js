const { Stock, StockSymbol } = require('../models');

const updateStockSymbols = async () => {
  try {
    // Fetch all stocks and include the associated StockSymbol model using the alias 'stockSymbol'
    const stocks = await Stock.findAll({
      include: [
        {
          model: StockSymbol,
          as: 'stockSymbol',  // This alias should match the alias used in the association
          attributes: ['symbol']
        }
      ]
    });

    for (const stock of stocks) {
      const symbol = stock.stockSymbol ? stock.stockSymbol.symbol : null;

      if (symbol) {
        const stockSymbol = await StockSymbol.findOne({ where: { symbol } });
        if (stockSymbol) {
          await stock.update({ stockSymbolId: stockSymbol.id });
        }
      }
    }

    console.log('Stock symbols updated successfully.');
  } catch (error) {
    console.error('Error updating stock symbols:', error.message);
  }
};

updateStockSymbols();
