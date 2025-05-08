const { pool } = require('../db'); // assumes you exported pool in db.js

// Create a new notification
async function createNotification(userEmail, message) {
  const query = `
    INSERT INTO notifications (user_email, message)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userEmail, message];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Get all notifications for a user
async function getNotificationsByEmail(userEmail) {
  const query = `
    SELECT * FROM notifications
    WHERE user_email = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [userEmail]);
  return rows;
}

// Mark a notification as read
async function markNotificationAsRead(id) {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  createNotification,
  getNotificationsByEmail,
  markNotificationAsRead
};
