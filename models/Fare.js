const pool = require('../config/db');

class Fare {
    static async getFareDetails() {
        const result = await pool.query('SELECT * FROM fares');
        return result.rows[0];
    }
}

module.exports = Fare;