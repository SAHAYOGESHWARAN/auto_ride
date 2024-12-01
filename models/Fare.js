const pool = require('../config/db');

class Fare {
    // Get all fare details
    static async getFareDetails() {
        try {
            const result = await pool.query('SELECT * FROM fares');
            return result.rows; // Return all fare records
        } catch (error) {
            console.error('Error fetching fare details:', error);
            throw new Error('Database query failed');
        }
    }

    // Get fare details by ID
    static async getFareById(id) {
        try {
            const result = await pool.query('SELECT * FROM fares WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                throw new Error('Fare not found');
            }
            return result.rows[0]; // Return the fare record
        } catch (error) {
            console.error('Error fetching fare by ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Add a new fare
    static async addFare(fareData) {
        const { amount, description } = fareData; // Destructure fare data
        try {
            const result = await pool.query(
                'INSERT INTO fares (amount, description) VALUES ($1, $2) RETURNING *',
                [amount, description]
            );
            return result.rows[0]; // Return the newly created fare record
        } catch (error) {
            console.error('Error adding fare:', error);
            throw new Error('Database query failed');
        }
    }

    // Update an existing fare
    static async updateFare(id, fareData) {
        const { amount, description } = fareData; // Destructure fare data
        try {
            const result = await pool.query(
                'UPDATE fares SET amount = $1, description = $2 WHERE id = $3 RETURNING *',
                [amount, description, id]
            );
            if (result.rows.length === 0) {
                throw new Error('Fare not found');
            }
            return result.rows[0]; // Return the updated fare record
        } catch (error) {
            console.error('Error updating fare:', error);
            throw new Error('Database query failed');
        }
    }

    // Delete a fare
    static async deleteFare(id) {
        try {
            const result = await pool.query('DELETE FROM fares WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                throw new Error('Fare not found');
            }
            return result.rows[0]; // Return the deleted fare record
        } catch (error) {
            console.error('Error deleting fare:', error);
            throw new Error('Database query failed');
        }
    }
}

module.exports = Fare;