const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logger = require('./utils/logger');

// Import routes
const pokemonRoutes = require('./routes/pokemon');
const teamRoutes = require('./routes/team');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  console.error(err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  logger.info(`Pokemon Team Creator server running on port ${PORT}`);
});
