const pool = require('../config/db');

class Trip {
    static async create(riderId, startLocation, endLocation) {
        const result = await pool.query('INSERT INTO trips (rider_id, start_location, end_location) VALUES ($1, $2, $3) RETURNING *', [riderId, startLocation, endLocation]);
        return result.rows[0];
    }

    static async acceptTrip(driverId, tripId) {
        const result = await pool.query('UPDATE trips SET driver_id = $1, status = \'accepted\' WHERE id = $2 RETURNING *', [driverId, tripId]);
        return result.rows[0];
    }

    static async getPreviousTrips(userId, role) {
        const result = await pool.query(`SELECT * FROM trips WHERE ${role}_id = $1`, [userId]);
        return result.rows;
    }
}

module.exports = Trip;