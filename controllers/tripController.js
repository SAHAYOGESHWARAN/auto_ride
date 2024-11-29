const Trip = require('../models/Trip');
const Fare = require('../models/Fare');

exports.requestTrip = async (req, res) => {
    const { startLocation, endLocation } = req.body;
    const riderId = req.user.id; // Assuming user ID is available in req.user
    const trip = await Trip.create(riderId, startLocation, endLocation);
    res.status(201).json(trip);
};

exports.acceptTrip = async (req, res) => {
    const { tripId } = req.params;
    const driverId = req.user.id; // Assuming user ID is available in req.user
    const trip = await Trip.acceptTrip(driverId, tripId);
    res.json(trip);
};

exports.getPreviousTrips = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const role = req.user.role; // Assuming role is available in req.user
    const trips = await Trip.getPreviousTrips(userId, role);
    res.json(trips);
};

exports.checkFareDetails = async (req, res) => {
    const fareDetails = await Fare.getFareDetails();
    res.json(fareDetails);
};