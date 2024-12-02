const { Pool } = require('pg');
const { Client } = require('pg');
const dotenv = require('dotenv');
const winston = require('winston'); 

dotenv.config();

// Create a logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'db.log' })
    ],
});

// Create a pool of connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        logger.info(`Connected to the database: ${res.rows[0].now}`);
        client.release();
    } catch (err) {
        logger.error('Database connection error', err);
    }
};

// Call the test connection function
testConnection();

// Handle pool errors
pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', err);
});

// Export the pool for use in other modules
module.exports = pool;