const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Create a new user
    static async create(username, password, role) {
        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
                [username, hashedPassword, role]
            );
            return result.rows[0]; // Return the newly created user
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Database query failed');
        }
    }

    // Find a user by username
    static async findByUsername(username) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows[0]; // Return the user record
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw new Error('Database query failed');
        }
    }

    // Find a user by ID
    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0]; // Return the user record
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new Error('Database query failed');
        }
    }

    // Update user details
    static async update(id, updates) {
        const { username, password, role } = updates;
        try {
            // Prepare the update query
            const fields = [];
            const values = [];
            let index = 1;

            if (username) {
                fields.push(`username = $${index++}`);
                values.push(username);
            }
            if (password) {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(password, 10);
                fields.push(`password = $${index++}`);
                values.push(hashedPassword);
            }
            if (role) {
                fields.push(`role = $${index++}`);
                values.push(role);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            // Execute the update query
            const result = await pool.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
                [...values, id]
            );

            if (result.rows.length === 0) {
                throw new Error('User  not found');
            }

            return result.rows[0]; // Return the updated user
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Database query failed');
        }
    }

    // Delete a user
    static async delete(id) {
        try {
            const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                throw new Error('User  not found');
            }
            return result.rows[0]; // Return the deleted user
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Database query failed');
        }
    }
}

module.exports = User;