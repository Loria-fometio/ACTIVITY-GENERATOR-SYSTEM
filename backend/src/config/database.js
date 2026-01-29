// SIMPLE DATABASE CONNECTION
const { Pool } = require('pg');

// Create pool with YOUR settings
const pool = new Pool({
  host: 'localhost',       // Your PostgreSQL host
  port: 5432,              // Default PostgreSQL port
  database: 'timetable_db', // Database name (create this in pgAdmin)
  user: 'postgres',        // Your PostgreSQL username
  password: 'password',    // Your PostgreSQL password
  // Remove advanced settings for now
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
    console.log('💡 Tip: Run without database first, add later');
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

module.exports = pool;