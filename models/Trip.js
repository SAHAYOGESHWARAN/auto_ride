const pool = require('../config/db');

class Trip {
    // Create a new trip
    static async create(riderId, startLocation, endLocation) {
        try {
            const result = await pool.query(
                'INSERT INTO trips (rider_id, start_location, end_location) VALUES ($1, $2, $3) RETURNING *',
                [riderId, startLocation, endLocation]
            );
            return result.rows[0]; // Return the newly created trip
        } catch (error) {
            console.error('Error creating trip:', error);
            throw new Error('Database query failed');
        }
    }

    // Accept a trip
    static async acceptTrip(driverId, tripId) {
        try {
            const result = await pool.query(
                'UPDATE trips SET driver_id = $1, status = \'accepted\' WHERE id = $2 RETURNING *',
                [driverId, tripId]
            );
            if (result.rows.length === 0) {
                throw new Error('Trip not found or already accepted');
            }
            return result.rows[0]; // Return the updated trip
        } catch (error) {
            console.error('Error accepting trip:', error);
            throw new Error('Database query failed');
        }
    }

    // Get previous trips for a user
    static async getPreviousTrips(userId, role) {
        try {
            const result = await pool.query(`SELECT * FROM trips WHERE ${role}_id = $1`, [userId]);
            return result.rows; // Return all previous trips
        } catch (error) {
            console.error('Error fetching previous trips:', error);
            throw new Error('Database query failed');
        }
    }

    // Get trip details by ID
    static async getTripById(tripId) {
        try {
            const result = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
            if (result.rows.length === 0) {
                throw new Error('Trip not found');
            }
            return result.rows[0]; // Return the trip details
        } catch (error) {
            console.error('Error fetching trip by ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Update trip status
    static async updateTripStatus(tripId, status) {
        try {
            const result = await pool.query(
                'UPDATE trips SET status = $1 WHERE id = $2 RETURNING *',
                [status, tripId]
            );
            if (result.rows.length === 0) {
                throw new Error('Trip not found');
            }
            return result.rows[0]; // Return the updated trip
        } catch (error) {
            console.error('Error updating trip status:', error);
            throw new Error('Database query failed');
        }
    }

    // Delete a trip
    static async deleteTrip(tripId) {
        try {
            const result = await pool.query('DELETE FROM trips WHERE id = $1 RETURNING *', [tripId]);
            if (result.rows.length === 0) {
                throw new Error('Trip not found');
            }
            return result.rows[0]; // Return the deleted trip
        } catch (error) {
            console.error('Error deleting trip:', error);
            throw new Error('Database query failed');
        }
    }
}

module.exports = Trip;