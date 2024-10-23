const { Stock, StockSymbol } = require('../models');

const updateStockSymbols = async () => {
  try {
    // Fetch all stocks and ensure `symbol` field is included
    const stocks = await Stock.findAll({ attributes: ['id', 'symbol'] });

    for (const stock of stocks) {
      if (!stock.symbol) {
        console.error(`Stock with id ${stock.id} has an undefined symbol.`);
        continue; // Skip this stock
      }

      // Find the corresponding stock symbol in the StockSymbols table
      const stockSymbol = await StockSymbol.findOne({ where: { symbol: stock.symbol } });

      if (stockSymbol) {
        // Update the stock with the correct stockSymbolId
        await stock.update({ stockSymbolId: stockSymbol.id });
        console.log(`Updated stockSymbolId for stock: ${stock.symbol}`);
      } else {
        console.error(`No corresponding StockSymbol found for stock: ${stock.symbol}`);
      }
    }

    console.log('Stock symbols updated successfully.');
  } catch (error) {
    console.error('Error updating stock symbols:', error.message);
  }
};

// Run the update script
updateStockSymbols();
