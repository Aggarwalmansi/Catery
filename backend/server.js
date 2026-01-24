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
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
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
app.use('/api/planner', require('./routes/plannerRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/akshaya', require('./routes/akshayaRoutes'));
app.use('/api/kutumbh', require('./routes/kutumbhRoutes'));

// Health Check Route
app.get('/', (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'Catery Backend is running', timestamp: new Date() });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  // Log full error details for developers
  console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack);

  // Send sanitized message to client
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'An unexpected server error occurred' : err.message
  });
});

// Start Server
// Start Server
const server = require('http').createServer(app);
const socketIo = require('./sockets');
socketIo.init(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
