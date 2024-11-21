const { Stock, StockSymbol } = require('../models');

const updateStockSymbols = async () => {
  try {
    // Fetch all stocks with their current symbols
    const stocks = await Stock.findAll({ attributes: ['id', 'symbol', 'stockSymbolId'] });

    for (const stock of stocks) {
      if (!stock.symbol) {
        console.error(`Stock with id ${stock.id} has an undefined symbol.`);
        continue; // Skip stocks without a symbol
      }

      // Find the corresponding stock symbol in the StockSymbols table
      let stockSymbol = await StockSymbol.findOne({ where: { symbol: stock.symbol } });

      if (!stockSymbol) {
        console.log(`No corresponding StockSymbol found for stock: ${stock.symbol}. Creating it now.`);
        // Create the StockSymbol if it doesn't exist
        stockSymbol = await StockSymbol.create({ symbol: stock.symbol });
      }

      if (stock.stockSymbolId !== stockSymbol.id) {
        // Update the stock's stockSymbolId if it doesn't match
        await stock.update({ stockSymbolId: stockSymbol.id });
        console.log(`Updated stockSymbolId for stock: ${stock.symbol} to ${stockSymbol.id}`);
      } else {
        console.log(`Stock ${stock.symbol} is already associated with stockSymbolId: ${stockSymbol.id}`);
      }
    }

    console.log('Stock symbols updated successfully.');
  } catch (error) {
    console.error('Error updating stock symbols:', error.message);
  }
};

// Run the update script
updateStockSymbols();
