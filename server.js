const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const pool = require('./config/db'); 
const { handleError } = require('./middleware/errorMiddleware'); 
const morgan = require('morgan'); 

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('combined')); // Use morgan for logging HTTP requests

// Test the database connection
const connectToDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database successfully');
        client.release(); 
    } catch (err) {
        console.error('Database connection error:', err.stack);
        process.exit(1); 
    }
};

connectToDatabase();

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Error handling middleware
app.use(handleError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});