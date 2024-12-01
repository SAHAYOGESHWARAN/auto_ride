const { body, validationResult } = require('express-validator');

// User Registration Validation
exports.registerValidation = [
    body('username')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .trim()
        .escape(), // Sanitize input

    body('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .trim()
        .escape(), // Sanitize input

    body('role')
        .isString()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin')
];

// User Login Validation
exports.loginValidation = [
    body('username')
        .isString()
        .withMessage('Username is required')
        .trim()
        .escape(), // Sanitize input

    body('password')
        .isString()
        .withMessage('Password is required')
        .trim()
        .escape() // Sanitize input
];

// Trip Request Validation
exports.requestTripValidation = [
    body('startLocation')
        .isString()
        .withMessage('Start location is required')
        .trim()
        .escape(), // Sanitize input

    body('endLocation')
        .isString()
        .withMessage('End location is required')
        .trim()
        .escape() // Sanitize input
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};