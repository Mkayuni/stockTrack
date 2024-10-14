const express = require('express');
const sequelize = require('./config/db');
const stockRoutes = require('./routes/stockRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS before defining routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api/stocks', stockRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});
