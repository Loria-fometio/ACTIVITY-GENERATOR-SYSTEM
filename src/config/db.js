const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'timetable_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

let client; 

const connectDB = async () => {
  try {
    client = new Client(dbConfig);
    await client.connect();
    console.log('PostgreSQL connected successfully');
    
    // Initialize database
    await initDB();
    return client;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

const initDB = async () => {
  try {
    // Create time_slots table
    await client.query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created/verified');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

const getClient = () => client;

module.exports = { connectDB, getClient };