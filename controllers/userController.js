const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validationResult } = require('express-validator'); // For input validation

// Register a new user
exports.registerUser  = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser  = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser .rows.length > 0) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser  = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, role]
        );

        // Respond with the new user's data (excluding the password)
        const { password: _, ...userData } = newUser .rows[0];
        return res.status(201).json(userData);
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Login a user
exports.loginUser  = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        
        // Respond with the token
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};