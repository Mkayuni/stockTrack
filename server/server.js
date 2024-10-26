const express = require('express');
require('dotenv').config();  // Load environment variables from .env
const sequelize = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const WebSocket = require('ws');  // Import WebSocket library
const fetch = require('node-fetch');  // Import node-fetch for API calls
const { StockPrice, StockSymbol } = require('./models');  // Import StockPrice and StockSymbol models

const app = express();
const PORT = process.env.PORT || 3001;  // Use port from .env or default to 3001

// Use CORS before defining routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockPriceRoutes);
app.use('/api/admin', adminRoutes);


// Webhook Endpoint for Finnhub events
app.post('/api/webhook', async (req, res) => {
  const secret = req.headers['x-finnhub-secret'];
  
  // Check if the secret matches secrete from environment
  if (secret !== process.env.FINNHUB_SECRET_KEY) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  // Acknowledge the event with a 200 status code
  res.status(200).json({ message: 'Event received' });

  // Logic to handle the event can be added here
  console.log('Received Webhook Event:', req.body);

  // Process the event here if needed
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

// Optional: Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

console.log('Secret Key:', process.env.FINNHUB_API_KEY);

// ------ WebSocket Integration for Real-Time Updates ------ //
const wss = new WebSocket.Server({ port: 8080 });

function broadcast(data) {
  console.log('Broadcasting data:', data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Fetch stock data from the Finnhub API for all stock symbols in the database
const fetchStockDataFromAPI = async () => {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    const stockSymbols = await StockSymbol.findAll({ attributes: ['symbol'] });

    const data = {};
    for (const stock of stockSymbols) {
      const symbol = stock.symbol;
      console.log(`Fetching data for symbol: ${symbol}`);

      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
      if (!response.ok) {
        console.error(`Error fetching data for ${symbol}. Status: ${response.status}`);
        continue;
      }

      const stockData = await response.json();
      console.log(`Fetched data for ${symbol}:`, stockData);

      if (Object.keys(stockData).length === 0) {
        console.error(`Empty data for symbol: ${symbol}`);
        continue;
      }

      data[symbol] = stockData;
    }

    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

// Store stock data in the StockPrices table
const updateStockPricesInDB = async (data) => {
  for (const symbol in data) {
    const stockData = data[symbol];
    
    // Ensure that stockData is valid and contains required fields
    if (!stockData || stockData.o == null || stockData.c == null || stockData.h == null || stockData.l == null) {
      console.error(`Missing required data for stock symbol ${symbol}. Skipping database update.`);
      continue;
    }

    // Handle volume: Set it to null if the volume is missing from the API response
    const volume = stockData.v != null ? stockData.v : null;

    try {
      const stock = await StockSymbol.findOne({ where: { symbol } });  // Find the stock ID from the symbol
      await StockPrice.create({
        stockId: stock.id,
        date: new Date(),  // Adjust this to store the correct date if needed
        open: stockData.o,
        close: stockData.c,
        high: stockData.h,
        low: stockData.l,
        volume,  // Explicitly set volume (could be null)
      });
    } catch (error) {
      console.error(`Error updating stock prices for ${symbol} in DB:`, error);
    }
  }
};

// Fetch and broadcast stock data every 1 minute
setInterval(async () => {
  const stockData = await fetchStockDataFromAPI();
  if (stockData) {
    broadcast(stockData);
    await updateStockPricesInDB(stockData);
  }
}, 20000);  // Fetch stock data every 1 minute
