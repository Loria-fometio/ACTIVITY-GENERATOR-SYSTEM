// server.js

// Import modules
const express = require('express');          // Web framework
const cors = require('cors');               // Allows cross-origin requests
const dotenv = require('dotenv');           // Loads environment variables
const morgan = require('morgan');           // HTTP request logger (added)

// Import routes
const timetableRoutes = require('./src/routes/timetableRoutes');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ========================
// MIDDLEWARE CONFIGURATION
// ========================

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Parse JSON requests with size limit
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (NODE_ENV === 'development') {
  // Detailed logging for development
  app.use(morgan('dev'));
} else {
  // Custom logging for production
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
    next();
  });
}

// ========================
// HEALTH & INFO ENDPOINTS
// ========================

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    service: 'Timetable Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: NODE_ENV,
    endpoints: {
      generate: 'POST /api/timetables/generate',
      getById: 'GET /api/timetables/:id',
      getUserTimetables: 'GET /api/timetables/user/:userId',
      getCurrentWeek: 'GET /api/timetables/user/:userId/current',
      completeActivity: 'PATCH /api/timetables/activity/:id/complete',
      delete: 'DELETE /api/timetables/:id'
    }
  };
  
  // Add database status if available
  if (global.dbStatus) {
    healthData.database = global.dbStatus;
  }
  
  res.status(200).json(healthData);
});

// Service information endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Timetable Service API',
    description: 'Generate and manage weekly activity timetables',
    version: '1.0.0',
    environment: NODE_ENV,
    documentation: 'Visit /health for available endpoints',
    standalone: 'This service works independently',
    integration: 'Can integrate with User/Preference/Activity services',
    status: 'operational'
  });
});

// ========================
// API ROUTES
// ========================

// Timetable API routes
app.use('/api/timetables', timetableRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Timetable Service API',
    basePath: '/api/timetables',
    endpoints: [
      {
        method: 'POST',
        path: '/generate',
        description: 'Generate a new timetable',
        body: {
          userId: 'string (required)',
          activities: 'array of activity objects (required)',
          generationMethod: 'string (optional: random|balanced|smart)'
        }
      },
      {
        method: 'GET',
        path: '/:timetableId',
        description: 'Get timetable by ID'
      },
      {
        method: 'GET',
        path: '/user/:userId',
        description: 'Get all timetables for a user',
        query: {
          limit: 'number (optional, default: 10)',
          offset: 'number (optional, default: 0)'
        }
      },
      {
        method: 'GET',
        path: '/user/:userId/current',
        description: 'Get current week\'s timetable'
      },
      {
        method: 'PATCH',
        path: '/activity/:activityId/complete',
        description: 'Mark activity as completed',
        body: {
          rating: 'number (optional, 1-5)',
          notes: 'string (optional)'
        }
      },
      {
        method: 'DELETE',
        path: '/:timetableId',
        description: 'Delete a timetable'
      }
    ]
  });
});

// ========================
// ERROR HANDLING
// ========================

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requested: `${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/', '/health', '/api/timetables/*']
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: error.message,
    stack: NODE_ENV === 'development' ? error.stack : undefined,
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  
  const statusCode = error.statusCode || 500;
  const isProduction = NODE_ENV === 'production';
  
  res.status(statusCode).json({
    success: false,
    error: 'Internal server error',
    message: isProduction ? undefined : error.message,
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ========================
// GRACEFUL SHUTDOWN
// ========================

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Starting graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Starting graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Process terminated.');
    process.exit(0);
  });
});

// ========================
// START SERVER
// ========================

// Start the server
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Listening on port: ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Base: http://localhost:${PORT}/api/timetables`);
  console.log('='.repeat(50));
  
  // Log startup time
  console.log(`Server started at: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

// Export for testing
module.exports = app;