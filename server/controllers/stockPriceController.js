const { StockPrice } = require('../models');
const { Op } = require('sequelize');

// Function to get stock prices by stock ID with an optional date range
const getStockPrices = async (req, res) => {
  const { stockId } = req.params;
  const { startDate, endDate } = req.query;  // Optional query parameters for date range

  try {
    const whereClause = { stockId };

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const stockPrices = await StockPrice.findAll({ where: whereClause });
    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getStockPrices };
