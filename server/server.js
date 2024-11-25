const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const userStocksRoutes = require('./routes/userStocksRoutes');
const userRoutes = require('./routes/userRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const emailRoutes = require('./routes/emailRoutes');
const cors = require('cors');
const WebSocket = require('ws');
const { StockPrice, StockSymbol, Stock} = require('./models');
const axios = require('axios');
const subscribedSymbols = new Set(); // Track subscribed symbols

const app = express();
const PORT = process.env.PORT || 3001;

const getThrottleInterval = () => {
  return parseInt(process.env.DEFAULT_THROTTLE_INTERVAL, 10) || 3000; // Default to 3000ms if not defined
};


// Use CORS before defining routes
app.use(cors());
app.use(express.json());

app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockPriceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user-stocks', userStocksRoutes)
app.use('/api/email', emailRoutes)

sequelize.sync().then(async () => {
  try {
    // Enable foreign key constraints for the current session
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('Foreign key constraints enabled.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error enabling foreign key constraints:', error.message);
  }
}).catch(err => {
  console.error('Error syncing database:', err);
});


// WebSocket Server for broadcasting data
const wss = new WebSocket.Server({ port: 8080 });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Environment variable to control logging
const ENABLE_TRADE_LOGGING = process.env.ENABLE_TRADE_LOGGING === 'true';

// Buffer to store the latest trade data
const tradeBuffer = {};
const lastProcessedTimestamps = { 'BTC-USD': 0 };
const lastLogTimestamp = { 'BTC-USD': 0 };
const BTC_THROTTLE_INTERVAL = 5000; 
const LOG_INTERVAL = 10000; // Log every 10 seconds

const mapSymbol = (webSocketSymbol) => {
  const symbolMap = { 'BINANCE:BTCUSDT': 'BTC-USD' };
  return symbolMap[webSocketSymbol] || webSocketSymbol;
};

// Function to process and buffer trade data
const processTradeData = (tradeData) => {
  const webSocketSymbol = tradeData.s;
  const mappedSymbol = mapSymbol(webSocketSymbol);
  const price = tradeData.p;
  const volume = tradeData.v || null;

  // Use BTC_THROTTLE_INTERVAL for BTC-USD
  const throttleInterval = mappedSymbol === 'BTC-USD' ? BTC_THROTTLE_INTERVAL : getThrottleInterval(mappedSymbol);

  const lastProcessedTime = lastProcessedTimestamps[mappedSymbol] || 0;

  // Check if we should throttle the update
  if (Date.now() - lastProcessedTime < throttleInterval) {
    if (Date.now() - (lastLogTimestamp[mappedSymbol] || 0) > LOG_INTERVAL) {
      console.log(`Throttling updates: Skipping update for ${mappedSymbol}`);
      lastLogTimestamp[mappedSymbol] = Date.now();
    }
    return; // Skip this update
  }

  // Update the last processed timestamp
  lastProcessedTimestamps[mappedSymbol] = Date.now();

  // Buffer the latest trade data
  tradeBuffer[mappedSymbol] = {
    price,
    volume,
    timestamp: new Date()
  };

  if (ENABLE_TRADE_LOGGING) {
    console.log(`Buffered trade for ${mappedSymbol} - Price: ${price}, Volume: ${volume}`);
  }
};


// Function to subscribe to a symbol
  const subscribeToSymbol = (socket, symbol) => {
    try {
      if (!subscribedSymbols.has(symbol)) {
        socket.send(JSON.stringify({ type: 'subscribe', symbol }));
        subscribedSymbols.add(symbol);
        console.log(`Subscribed to real-time updates for symbol: ${symbol}`);
      }
    } catch (error) {
      console.error(`Failed to subscribe to symbol ${symbol}:`, error.message);
    }
  };


// Connect to Finnhub WebSocket API for real-time data
const connectWebSocket = async () => {
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

  socket.onopen = async () => {
    console.log('Connected to Finnhub WebSocket');

    // Fetch existing stock symbols from the database
    try {
      const stockSymbols = await StockSymbol.findAll({ attributes: ['symbol'] });
      stockSymbols.forEach(({ symbol }) => {
        subscribeToSymbol(socket, symbol); // Dynamically subscribe to each symbol
      });
    } catch (error) {
      console.error('Error fetching stock symbols:', error.message);
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'trade' && data.data && data.data.length > 0) {
      const tradeData = data.data[0];
      //console.log(`Received trade data for symbol ${tradeData.s}:`, tradeData); // Log trade data
      processTradeData(tradeData);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...');
    setTimeout(() => connectWebSocket(), 5000);
  };
};

// Utility function to fetch the last stock price when real-time data is unavailable
const fetchLastStockPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const { c: close, h: high, l: low, o: open } = response.data;
    if (close && high && low && open) {
      console.log(`Fetched last price for ${symbol}: Open=${open}, Close=${close}, High=${high}, Low=${low}`);
      return { open, close, high, low };
    }
    console.error(`Incomplete data received for ${symbol}`);
    return null;
  } catch (error) {
    console.error(`Error fetching last stock price for ${symbol}:`, error.message);
    return null;
  }
};

const saveBufferedDataToDB = async () => {
  for (const symbol in tradeBuffer) {
    const tradeData = tradeBuffer[symbol];

    console.log(JSON.stringify(tradeData))

    try {
      // Fetch the stock details from the database
      const stock = await Stock.findOne({ where: { symbol } });
      if (!stock) {
        console.error(`Symbol ${symbol} not found in Stocks table. Skipping...`);
        continue;
      }

      console.log(`Saving trade data for ${symbol}: stockId=${stock.id}, TradeData=${JSON.stringify(tradeData)}`);

      if (!tradeData) {
        console.warn(`No real-time data for ${symbol}, fetching fallback price...`);
        const lastPriceData = await fetchLastStockPrice(symbol);
        if (lastPriceData) {
          await StockPrice.create({
            stockId: stock.id,
            date: new Date(),
            open: lastPriceData.open,
            close: lastPriceData.close,
            high: lastPriceData.high,
            low: lastPriceData.low,
            volume: 0, // Default volume for fallback data
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`Saved fallback price for ${symbol} to the database`);
        } else {
          console.error(`No fallback data available for ${symbol}`);
        }
      } else {

        const lastPriceData = await fetchLastStockPrice(symbol);

        if (lastPriceData) {
          // Save real-time trade data
          await StockPrice.create({
            stockId: stock.id,
            date: tradeData.timestamp,
            open: lastPriceData.open,
            close: tradeData.price,
            high: lastPriceData.high,
            low: lastPriceData.low,
            volume: tradeData.volume ?? 0, // Use volume or default to 0
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log(`Real-time data saved: ${symbol} - Price: ${tradeData.price}`);
        }
      }

      // Clear the buffer for the processed symbol
      delete tradeBuffer[symbol];
    } catch (error) {
      console.error(`Error saving trade data for ${symbol}:`, error.message);
    }
  }
};



// Save buffered data every 30 seconds
setInterval(saveBufferedDataToDB, 3000);

// Start the WebSocket connection
connectWebSocket();
