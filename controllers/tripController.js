const Trip = require('../models/Trip');
const Fare = require('../models/Fare');
const { validationResult } = require('express-validator'); 

// Request a new trip
exports.requestTrip = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { startLocation, endLocation } = req.body;
    const riderId = req.user.id; // Assuming user ID is available in req.user

    try {
        const trip = await Trip.create(riderId, startLocation, endLocation);
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error requesting trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accept a trip
exports.acceptTrip = async (req, res) => {
    const { tripId } = req.params;
    const driverId = req.user.id; // Assuming user ID is available in req.user

    try {
        const trip = await Trip.acceptTrip(driverId, tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found or already accepted' });
        }
        res.json(trip);
    } catch (error) {
        console.error('Error accepting trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get previous trips for a user
exports.getPreviousTrips = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const role = req.user.role; // Assuming role is available in req.user

    try {
        const trips = await Trip.getPreviousTrips(userId, role);
        res.json(trips);
    } catch (error) {
        console.error('Error fetching previous trips:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check fare details
exports.checkFareDetails = async (req, res) => {
    try {
        const fareDetails = await Fare.getFareDetails();
        res.json(fareDetails);
    } catch (error) {
        console.error('Error fetching fare details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};