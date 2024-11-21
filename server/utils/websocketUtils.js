// websocketUtils.js
const WebSocket = require('ws');
const subscribedSymbols = new Set(); // Keep track of subscribed symbols

const addSymbolToSubscription = (symbol, finnhubApiKey) => {
  if (!subscribedSymbols.has(symbol)) {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${finnhubApiKey}`);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol }));
      subscribedSymbols.add(symbol);
      console.log(`Subscribed to real-time updates for symbol: ${symbol}`);
    };
    socket.onerror = (error) => {
      console.error(`WebSocket error for ${symbol}:`, error.message);
    };
  } else {
    console.log(`Symbol ${symbol} is already subscribed.`);
  }
};

module.exports = { addSymbolToSubscription };
