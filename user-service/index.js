require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service' });
});

app.get('/test', (req, res) => {
  res.json({ test: 'ok' });
});

// Routes
app.use('/api/users', userRoutes);

// Sync database and start server

const startServer = async () => {
  try {
    // Test database connection
    await db.getConnection(); // gets a connection from the pool
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
