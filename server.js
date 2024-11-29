const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const pool = require('./config/db'); // Import the database connection

dotenv.config();
const app = express();
app.use(express.json());

// Test the database connection
pool.connect()
    .then(client => {
        console.log('Connected to the database successfully');
        client.release(); // Release the client back to the pool
    })
    .catch(err => {
        console.error('Database connection error:', err.stack);
    });

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});