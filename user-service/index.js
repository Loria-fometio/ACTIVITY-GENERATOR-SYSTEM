require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
    await sequelize.sync(); // Create tables if they don't exist
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Server setup complete.');
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();