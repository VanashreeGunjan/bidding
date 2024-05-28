const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool(process.env.DATABASE_URL);

async function getAllBids(itemId) {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.execute(
            'SELECT b.id, b.user_id, u.username, b.bid_amount, b.created_at FROM bids b JOIN users u ON b.user_id = u.id WHERE b.item_id = ? ORDER BY b.bid_amount DESC',
            [itemId]
        );
        
        return rows;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function placeBid(itemId, userId, bidAmount) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Check if item exists and get current price
        const [itemRows] = await connection.execute(
            'SELECT current_price, end_time FROM items WHERE id = ?',
            [itemId]
        );

        if (itemRows.length === 0) {
            throw new Error('Item not found');
        }

        const item = itemRows[0];

        if (new Date() > new Date(item.end_time)) {
            throw new Error('Auction has ended');
        }

        if (bidAmount <= item.current_price) {
            throw new Error('Bid must be higher than the current price');
        }

        // Insert new bid
        await connection.execute(
            'INSERT INTO bids (item_id, user_id, bid_amount, created_at) VALUES (?, ?, ?, NOW())',
            [itemId, userId, bidAmount]
        );

        // Update item's current price
        await connection.execute(
            'UPDATE items SET current_price = ? WHERE id = ?',
            [bidAmount, itemId]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getAllBids,
    placeBid,
};
