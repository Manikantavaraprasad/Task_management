const { Pool } = require('pg');

// PostgreSQL pool connection (Assuming you have a `db.js` file with pool config)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure DATABASE_URL is set in .env
});

// Create a new task
async function createTask(title, description, dueDate, priority, status, creatorEmail, creatorFullName, assigneeEmail, assigneeFullName) {
  const query = `
    INSERT INTO tasks (title, description, due_date, priority, status, creator_email, creator_full_name, assignee_email, assignee_full_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [title, description, dueDate, priority, status, creatorEmail, creatorFullName, assigneeEmail, assigneeFullName];
  const result = await pool.query(query, values);
  return result.rows[0]; // returns the created task
}

// Get all tasks (you can add filters as needed)
async function getTasks() {
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC;';
  const result = await pool.query(query);
  return result.rows; // returns all tasks
}

// Get a specific task by ID
async function getTaskById(id) {
  const query = 'SELECT * FROM tasks WHERE id = $1;';
  const result = await pool.query(query, [id]);
  return result.rows[0]; // returns the task by ID
}

// Update the task status
async function updateTaskStatus(id, status) {
  const query = 'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *;';
  const result = await pool.query(query, [status, id]);
  return result.rows[0]; // returns the updated task
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus
};
