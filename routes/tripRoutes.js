const express = require('express');
const {
    requestTrip,
    acceptTrip,
    getPreviousTrips,
    checkFareDetails
} = require('../controllers/tripController');
const { authenticate } = require('../middleware/authMiddleware');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

// Request a trip
router.post(
    '/request',
    authenticate,
    [
        body('pickupLocation')
            .isString()
            .withMessage('Pickup location is required'),
        body('dropoffLocation')
            .isString()
            .withMessage('Dropoff location is required'),
        body('passengerCount')
            .isInt({ min: 1 })
            .withMessage('Passenger count must be at least 1')
    ],
    async (req, res) => {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { pickupLocation, dropoffLocation, passengerCount } = req.body;
            const trip = await requestTrip(req.user.id, pickupLocation, dropoffLocation, passengerCount);
            return res.status(201).json({ message: 'Trip requested successfully', trip });
        } catch (error) {
            console.error('Error requesting trip:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Accept a trip
router.post(
    '/accept/:tripId',
    authenticate,
    [
        param('tripId')
            .isUUID()
            .withMessage('Invalid trip ID format')
    ],
    async (req, res) => {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { tripId } = req.params;
            const trip = await acceptTrip(req.user.id, tripId);
            if (!trip) {
                return res.status(404).json({ message: 'Trip not found or already accepted' });
            }
            return res.status(200).json({ message: 'Trip accepted successfully', trip });
        } catch (error) {
            console.error('Error accepting trip:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Get previous trips
router.get('/previous', authenticate, async (req, res) => {
    try {
        const trips = await getPreviousTrips(req.user.id);
        return res.status(200).json({ trips });
    } catch (error) {
        console.error('Error fetching previous trips:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Check fare details
router.get('/fare', authenticate, async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation } = req.query;
        if (!pickupLocation || !dropoffLocation) {
            return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
        }
        const fareDetails = await checkFareDetails(pickupLocation, dropoffLocation);
        return res.status(200).json({ fareDetails });
    } catch (error) {
        console.error('Error checking fare details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;