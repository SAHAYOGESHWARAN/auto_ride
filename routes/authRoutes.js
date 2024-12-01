const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validation');

// Registration route
router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = await userController.registerUser (username, password, role);
        return res.status(201).json({ message: 'User  registered successfully', user });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userController.loginUser (username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;