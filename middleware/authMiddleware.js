const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    // Check if token is provided
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Attach user information to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle token expiration and other errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error('Error during token verification:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};