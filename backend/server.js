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

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,           // Production Frontend
  'http://localhost:3000',            // Local Development
].filter(Boolean);

// Logging Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${origin}`);
  next();
});

// Database Connection Check
const prisma = require('./utils/prisma');
async function checkDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // We don't exit process here strictly, to allow server to start even if DB is flaky initially, 
    // but it's good to know. In production you might want to exit.
  }
}
checkDbConnection();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log(`CORS BLOCKED: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));      // Parse JSON bodies (increased for photo uploads)

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));

// Health Check Route
app.get('/', (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'Catery Backend is running', timestamp: new Date() });
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
