const express = require('express');
require('dotenv').config();  // Load environment variables from .env

const sequelize = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;  // Use port from .env or default to 3001

// Use CORS before defining routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

console.log('Secret Key:', process.env.YOUR_SECRET_KEY);

// Optional: Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
