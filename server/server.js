const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const WebSocket = require('ws');
const { StockPrice, StockSymbol } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS before defining routes
app.use(cors());
app.use(express.json());

app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockPriceRoutes);
app.use('/api/admin', adminRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
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
const BTC_THROTTLE_INTERVAL = 20000; // 20 seconds
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
  const currentTime = Date.now();

  // Handle throttling for Bitcoin
  if (mappedSymbol === 'BTC-USD') {
    const lastProcessedTime = lastProcessedTimestamps['BTC-USD'];

    // Throttle Bitcoin updates
    if (currentTime - lastProcessedTime < BTC_THROTTLE_INTERVAL) {
      if (currentTime - lastLogTimestamp['BTC-USD'] > LOG_INTERVAL) {
        console.log(`Throttling Bitcoin updates: Skipping update for ${mappedSymbol}`);
        lastLogTimestamp['BTC-USD'] = currentTime;
      }
      return;
    }
    lastProcessedTimestamps['BTC-USD'] = currentTime;
  }

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

// Connect to Finnhub WebSocket API for real-time data
const connectWebSocket = () => {
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

  socket.onopen = () => {
    console.log('Connected to Finnhub WebSocket');
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'BINANCE:BTCUSDT'];
    symbols.forEach(symbol => {
      console.log(`Subscribing to real-time updates for symbol: ${symbol}`);
      socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'trade' && data.data && data.data.length > 0) {
      const tradeData = data.data[0];
      processTradeData(tradeData);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...');
    setTimeout(connectWebSocket, 5000);
  };
};

// Function to save buffered data to the database
const saveBufferedDataToDB = async () => {
  for (const symbol in tradeBuffer) {
    const tradeData = tradeBuffer[symbol];

    try {
      const stock = await StockSymbol.findOne({ where: { symbol } });

      if (stock) {
        await StockPrice.create({
          stockId: stock.id,
          date: tradeData.timestamp,
          open: tradeData.price,
          close: tradeData.price,
          high: tradeData.price,
          low: tradeData.price,
          volume: tradeData.volume
        });

        console.log(`Saved to DB: ${symbol} - Price: ${tradeData.price}`);
      } else {
        console.log(`Symbol ${symbol} not found in database`);
      }
    } catch (error) {
      console.error(`Error saving trade data for ${symbol}:`, error);
    }
  }
};

// Save buffered data every 30 seconds
setInterval(saveBufferedDataToDB, 30000);

// Start the WebSocket connection
connectWebSocket();
