const axios = require('axios');
const { StockPrice } = require('../models');

const schedulePriceUpdates = (symbol, stockId) => {
  setInterval(async () => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
      );

      const { c: close, h: high, l: low, o: open } = response.data;

      if (close && high && low && open) {
        await StockPrice.create({
          stockId,
          date: new Date(),
          open,
          close,
          high,
          low,
          volume: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Updated prices for ${symbol}`);
      }
    } catch (error) {
      console.error(`Failed to update prices for ${symbol}:`, error.message);
    }
  }, 60 * 1000); // Fetch updates every 1 minute
};

module.exports = { schedulePriceUpdates };
