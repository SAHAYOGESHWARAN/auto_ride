const { body } = require('express-validator');

exports.registerValidation = [
    body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isString().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

exports.loginValidation = [
    body('username').isString().withMessage('Username is required'),
    body('password').isString().withMessage('Password is required'),
];

exports.requestTripValidation = [
    body('startLocation').isString().withMessage('Start location is required'),
    body('endLocation').isString().withMessage('End location is required'),
];