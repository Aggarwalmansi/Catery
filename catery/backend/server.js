const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());            // Security headers
app.use(cors());              // Enable CORS
app.use(morgan('dev'));       // Request logging
app.use(express.json({ limit: '10mb' }));      // Parse JSON bodies (increased for photo uploads)

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Catery Backend is running', timestamp: new Date() });
});

// Basic Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
