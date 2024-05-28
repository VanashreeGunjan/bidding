const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(process.env.DATABASE_URL);

async function register(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.execute(
            'INSERT INTO users (username, password, email, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            [username, hashedPassword, email, 'user']
        );
        return result;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function login(username, password) {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.execute(
            'SELECT id, username, password, role FROM users WHERE username = ?',
            [username]
        );
        
        if (rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, user: { id: user.id, username: user.username, role: user.role } };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserProfile(userId) {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.execute(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            throw new Error('User not found');
        }

        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    register,
    login,
    getUserProfile,
};
