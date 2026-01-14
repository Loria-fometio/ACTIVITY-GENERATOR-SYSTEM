const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    res.json({
      status: 'UP',
      service: 'Time Table Service',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      version: '1.0.0'
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      service: 'Time Table Service',
      timestamp: new Date().toISOString(),
      database: 'DISCONNECTED',
      error: err.message
    });
  }
});

module.exports = router;